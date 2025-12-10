import axios from 'axios'
import {
  clearTokens,
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  saveTokens,
} from '@/auth/tokenStorage.ts'

export const http = axios.create({
  baseURL: 'http://localhost:8080',
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
      const res = await axios.post('http://localhost:8080/auth/refresh', {
        refreshToken: getRefreshToken(),
      })

      saveTokens(res.data.accessToken, res.data.refreshtoken, res.data.expiresInSeconds)

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

export default http
