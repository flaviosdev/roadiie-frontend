export function saveTokens(accessToken: string, refreshToken: string, expiresInSeconds: number) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)

  const expiresAt = Date.now() + expiresInSeconds * 1000
  localStorage.setItem('accessTokenExpiresAt', String(expiresAt))
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

export function getAccessTokenExpiresAt() {
  const v = localStorage.getItem('accessTokenExpiresAt')
  return v ? parseInt(v, 10) : 0
}

export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('expiresInSeconds')
}
