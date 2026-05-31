import api from './api'

export const register = async (data) => {
  const { aceitarTermos: _aceitarTermos, ...payload } = data
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const login = async ({ identificador, senha, lembrarMe }) => {
  const response = await api.post('/auth/login', {
    email: identificador.trim(),
    senha,
    lembrarMe: Boolean(lembrarMe),
  })
  return response.data
}

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', {
    email: email.trim().toLowerCase(),
  })
  return response.data
}

export const validateResetToken = async (token) => {
  const response = await api.get(`/auth/reset-password/${encodeURIComponent(token)}`)
  return response.data
}

export const resetPassword = async ({ token, senha, confirmarSenha }) => {
  const response = await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, {
    senha,
    confirmarSenha,
  })
  return response.data
}

export const refresh = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken })
  return response.data
}

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (refreshToken) {
    await api.post('/auth/logout', { refreshToken })
  }
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data.user
}

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${encodeURIComponent(token)}`)
  return response.data
}

export const resendVerification = async (email) => {
  const response = await api.post('/auth/resend-verification', { email })
  return response.data
}

export const loginWithGoogle = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'
  window.location.href = `${baseUrl}/auth/google`
}

export const storeAuthTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken', accessToken)

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
