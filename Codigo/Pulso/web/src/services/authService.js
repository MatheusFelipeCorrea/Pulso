import api from './api'
import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'

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

export const refresh = async () => {
  const response = await api.post('/auth/refresh')
  return response.data
}

export const logout = async () => {
  await api.post('/auth/logout')
}

export const exchangeOAuth = async (exchange) => {
  const response = await api.post('/auth/oauth/exchange', { exchange })
  return response.data
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
  window.location.href = `${getApiBaseUrl()}/auth/google`
}

/** @deprecated Sessão em cookies httpOnly — mantido para compatibilidade de chamadas existentes */
export const storeAuthTokens = () => {}

/** @deprecated Cookies httpOnly são limpos pelo backend em logout */
export const clearAuthTokens = () => {}
