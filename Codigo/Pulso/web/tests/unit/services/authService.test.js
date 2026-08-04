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
  getApiBaseUrl: vi.fn(() => '/api'),
}))

import api from '@/services/api.js'
import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'
import {
  clearAuthTokens,
  exchangeOAuth,
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
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost/' },
    })
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
    api.post.mockResolvedValueOnce({ data: { user: { id: 'u1' } } })

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
    expect(result).toEqual({ user: { id: 'u1' } })
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

  it('refresh, getMe, resendVerification e exchangeOAuth retornam dados esperados', async () => {
    api.post.mockResolvedValueOnce({ data: { ok: true } })
    api.get.mockResolvedValueOnce({ data: { user: { id: 'u1' } } })
    api.post.mockResolvedValueOnce({ data: { enviado: true } })
    api.post.mockResolvedValueOnce({ data: { user: { id: 'u2' } } })

    await expect(refresh()).resolves.toEqual({ ok: true })
    await expect(getMe()).resolves.toEqual({ id: 'u1' })
    await expect(resendVerification('a@b.com')).resolves.toEqual({ enviado: true })
    await expect(exchangeOAuth('exchange-token')).resolves.toEqual({ user: { id: 'u2' } })

    expect(api.post).toHaveBeenCalledWith('/auth/refresh')
    expect(api.get).toHaveBeenCalledWith('/auth/me')
    expect(api.post).toHaveBeenCalledWith('/auth/resend-verification', { email: 'a@b.com' })
    expect(api.post).toHaveBeenCalledWith('/auth/oauth/exchange', {
      exchange: 'exchange-token',
    })
  })

  it('logout chama endpoint sem body', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'ok' } })

    await logout()

    expect(api.post).toHaveBeenCalledWith('/auth/logout')
  })

  it('helpers de token são no-op com cookies httpOnly', () => {
    expect(() => storeAuthTokens({ accessToken: 'a1' })).not.toThrow()
    expect(() => clearAuthTokens()).not.toThrow()
  })

  it('loginWithGoogle resolve URL da API para redirecionamento', () => {
    loginWithGoogle()
    expect(getApiBaseUrl).toHaveBeenCalled()
    expect(window.location.href).toBe('/api/auth/google')
  })
})
