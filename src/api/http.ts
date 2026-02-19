import axios from 'axios'
import router from '@/router'
import {
  clearTokens,
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  saveTokens,
} from '@/auth/tokenStorage.ts'
import { setGlobalError } from '@/api/globalError.ts'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

http.interceptors.request.use(async (config) => {
  const token = getAccessToken()
  const expiresAt = getAccessTokenExpiresAt()

  const willExpireSoon = Date.now() > expiresAt - 30_000

  if (token && willExpireSoon && !isRefreshing) {
    isRefreshing = true
    try {
      const res = await axios.post(`${http.defaults.baseURL}/auth/refresh`, {
        refreshToken: getRefreshToken(),
      })

      saveTokens(res.data.accessToken, res.data.refreshToken, res.data.expiresInSeconds)

      pendingRequests.forEach((cb) => cb(res.data.accessToken))
      pendingRequests = []

      config.headers['Authorization'] = `Bearer ${res.data.accessToken}`
    } catch (err) {
      clearTokens()
      throw err
    } finally {
      isRefreshing = false
    }
  } else if (token && isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push((newToken) => {
        config.headers['Authorization'] = `Bearer ${newToken}`
        resolve(config)
      })
    })
  } else if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      setGlobalError('Server down!')
      console.error(error.message)

      return Promise.reject({
        type: 'NETWORK',
        message: 'Network error (Server Down??)',
      })
    }

    const status = error?.response?.status

    if (status === 401 || status === 403) {
      clearTokens()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }

      return Promise.reject({
        type: 'AUTH',
        message: error.message,
      })
    }

    return Promise.reject({
      type: 'UNKNOWN',
      message: error.message,
    })
  },
)
export default http
