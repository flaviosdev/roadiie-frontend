import { ref } from 'vue'
import { http } from '@/api/http.ts'
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getAccessTokenExpiresAt
} from '@/auth/tokenStorage.ts'

const isAuthenticated = ref<boolean>(!!getAccessToken())

export const useAuth = () => {
  async function login(email: string, password: string) {
    try {
      const { data } = await http.post('/auth/login', { email, password })

      saveTokens(data.accessToken, data.refreshToken, data.expiresInSeconds)
      isAuthenticated.value = true

      return { ok: true }
    } catch (err: any) {
      if (err.type === 'NETWORK') {
        return { ok: false , message: 'Cannot connect to auth server.' }
      }

      if (err.type === 'AUTH') {
        return { ok: false , message: 'Connection aborted'}
      }

      if (err.type === 'ERR_NETWORK') {
        return { ok: false , message: "network error (server down??)" }
      }
      if (!err.response) return { ok: false, message: 'Network connection error. Please try again later' }
      if (err.response.status === 401) return { ok: false, message: 'Authentication failed' }
      return { ok: false, message: 'Unexpected error occurred.' }
    }
  }

  async function logout() {
    clearTokens()
    isAuthenticated.value = false
  }

  async function refreshAccessToken() {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      logout()
      return null;
    }

    try {
      const { data } = await http.post('/auth/refresh', { refreshToken })

      saveTokens(data.accessToken, data.refreshToken, data.expiresInSeconds)
      return data.accessToken
    } catch {
      logout()
      return null;
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
    refreshAccessToken,
  }
}
