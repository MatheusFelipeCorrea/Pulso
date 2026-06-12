import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
  mockApiInstance: vi.fn(),
  requestInterceptor: undefined,
  responseErrorInterceptor: undefined,
}))

vi.mock('axios', () => {
  const axios = {
    create: vi.fn(() => {
      mocked.mockApiInstance.get = vi.fn()
      mocked.mockApiInstance.post = vi.fn()
      mocked.mockApiInstance.patch = vi.fn()
      mocked.mockApiInstance.delete = vi.fn()
      mocked.mockApiInstance.interceptors = {
        request: {
          use: vi.fn((onFulfilled) => {
            mocked.requestInterceptor = onFulfilled
          }),
        },
        response: {
          use: vi.fn((_, onRejected) => {
            mocked.responseErrorInterceptor = onRejected
          }),
        },
      }
      return mocked.mockApiInstance
    }),
    post: vi.fn(),
  }

  return { default: axios }
})

vi.mock('@/utils/apiBaseUrl.js', () => ({
  getApiBaseUrl: vi.fn(() => 'http://localhost:3333/api'),
}))

import axios from 'axios'
import api from '@/services/api.js'

describe('services/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.location.href = 'http://localhost/'
  })

  it('adiciona Authorization no interceptor de request quando existe token', () => {
    localStorage.setItem('accessToken', 'token-123')
    const config = { headers: {} }

    const result = mocked.requestInterceptor(config)

    expect(result.headers.Authorization).toBe('Bearer token-123')
  })

  it('tenta refresh e repete request quando receber 401', async () => {
    localStorage.setItem('refreshToken', 'refresh-123')
    const originalRequest = { url: '/transacoes', headers: {} }
    const error = { response: { status: 401 }, config: originalRequest }
    const retryResponse = { data: { ok: true } }
    mocked.mockApiInstance.mockResolvedValueOnce(retryResponse)
    axios.post.mockResolvedValueOnce({ data: { accessToken: 'novo-token' } })

    const result = await mocked.responseErrorInterceptor(error)

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3333/api/auth/refresh', {
      refreshToken: 'refresh-123',
    })
    expect(localStorage.getItem('accessToken')).toBe('novo-token')
    expect(originalRequest._retry).toBe(true)
    expect(originalRequest.headers.Authorization).toBe('Bearer novo-token')
    expect(mocked.mockApiInstance).toHaveBeenCalledWith(originalRequest)
    expect(result).toEqual(retryResponse)
  })

  it('limpa tokens e redireciona para login sem refresh token', async () => {
    localStorage.setItem('accessToken', 'token-antigo')
    const error = {
      response: { status: 401 },
      config: { url: '/transacoes', headers: {} },
    }

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(error)

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })

  it('limpa sessão quando refresh falha', async () => {
    localStorage.setItem('accessToken', 'token-antigo')
    localStorage.setItem('refreshToken', 'refresh-123')
    const error = {
      response: { status: 401 },
      config: { url: '/transacoes', headers: {} },
    }
    const refreshError = new Error('refresh falhou')
    axios.post.mockRejectedValueOnce(refreshError)

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(refreshError)

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })

  it('não tenta refresh para rotas de autenticação', async () => {
    const error = {
      response: { status: 401 },
      config: { url: '/auth/login', headers: {} },
    }

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(error)
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('exporta a instância criada de axios', () => {
    expect(api).toBe(mocked.mockApiInstance)
  })
})
