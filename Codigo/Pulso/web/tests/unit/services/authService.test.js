import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/utils/apiBaseUrl.js', () => ({
  getApiBaseUrl: vi.fn(() => 'http://localhost:3333/api'),
}))

import api from '@/services/api.js'
import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'
import {
  clearAuthTokens,
  forgotPassword,
  getMe,
  login,
  loginWithGoogle,
  logout,
  refresh,
  register,
  resendVerification,
  resetPassword,
  storeAuthTokens,
  validateResetToken,
  verifyEmail,
} from '@/services/authService.js'

describe('services/authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.location.href = 'http://localhost/'
  })

  it('register remove aceitarTermos e retorna payload da API', async () => {
    api.post.mockResolvedValueOnce({ data: { id: '1' } })

    const result = await register({
      nome: 'Ana',
      email: 'ana@email.com',
      senha: 'abc',
      aceitarTermos: true,
    })

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      nome: 'Ana',
      email: 'ana@email.com',
      senha: 'abc',
    })
    expect(result).toEqual({ id: '1' })
  })

  it('login normaliza dados e retorna resposta', async () => {
    api.post.mockResolvedValueOnce({ data: { accessToken: 'token' } })

    const result = await login({
      identificador: '  user@email.com  ',
      senha: '123',
      lembrarMe: 'yes',
    })

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'user@email.com',
      senha: '123',
      lembrarMe: true,
    })
    expect(result).toEqual({ accessToken: 'token' })
  })

  it('forgot/reset/verify usam endpoints corretos', async () => {
    api.post.mockResolvedValueOnce({ data: { ok: true } })
    api.get.mockResolvedValueOnce({ data: { valido: true } })
    api.post.mockResolvedValueOnce({ data: { redefinido: true } })
    api.get.mockResolvedValueOnce({ data: { verificado: true } })

    await forgotPassword('  TESTE@EMAIL.COM ')
    await validateResetToken('token/abc')
    await resetPassword({ token: 'token/abc', senha: '1', confirmarSenha: '1' })
    await verifyEmail('mail/token')

    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'teste@email.com',
    })
    expect(api.get).toHaveBeenCalledWith('/auth/reset-password/token%2Fabc')
    expect(api.post).toHaveBeenCalledWith('/auth/reset-password/token%2Fabc', {
      senha: '1',
      confirmarSenha: '1',
    })
    expect(api.get).toHaveBeenCalledWith('/auth/verify-email/mail%2Ftoken')
  })

  it('refresh, getMe e resendVerification retornam dados esperados', async () => {
    api.post.mockResolvedValueOnce({ data: { accessToken: 'novo' } })
    api.get.mockResolvedValueOnce({ data: { user: { id: 'u1' } } })
    api.post.mockResolvedValueOnce({ data: { enviado: true } })

    await expect(refresh('r1')).resolves.toEqual({ accessToken: 'novo' })
    await expect(getMe()).resolves.toEqual({ id: 'u1' })
    await expect(resendVerification('a@b.com')).resolves.toEqual({ enviado: true })

    expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'r1' })
    expect(api.get).toHaveBeenCalledWith('/auth/me')
    expect(api.post).toHaveBeenCalledWith('/auth/resend-verification', { email: 'a@b.com' })
  })

  it('logout só chama endpoint quando houver refreshToken', async () => {
    await logout()
    expect(api.post).not.toHaveBeenCalled()

    localStorage.setItem('refreshToken', 'refresh-123')
    await logout()
    expect(api.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'refresh-123' })
  })

  it('helper de tokens persiste e limpa localStorage', () => {
    storeAuthTokens({ accessToken: 'a1', refreshToken: 'r1' })
    expect(localStorage.getItem('accessToken')).toBe('a1')
    expect(localStorage.getItem('refreshToken')).toBe('r1')

    storeAuthTokens({ accessToken: 'a2' })
    expect(localStorage.getItem('accessToken')).toBe('a2')
    expect(localStorage.getItem('refreshToken')).toBe('r1')

    clearAuthTokens()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })

  it('loginWithGoogle resolve URL da API para redirecionamento', () => {
    loginWithGoogle()
    expect(getApiBaseUrl).toHaveBeenCalled()
  })
})
