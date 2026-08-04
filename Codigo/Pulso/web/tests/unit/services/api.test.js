import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
  mockApiInstance: vi.fn(),
  responseErrorInterceptor: undefined,
  refreshPost: vi.fn(),
}))

vi.mock('axios', () => {
  const axios = {
    create: vi.fn((config) => {
      mocked.mockApiInstance.withCredentials = config?.withCredentials
      mocked.mockApiInstance.get = vi.fn()
      mocked.mockApiInstance.post = vi.fn()
      mocked.mockApiInstance.patch = vi.fn()
      mocked.mockApiInstance.delete = vi.fn()
      mocked.mockApiInstance.interceptors = {
        request: { use: vi.fn() },
        response: {
          use: vi.fn((_, onRejected) => {
            mocked.responseErrorInterceptor = onRejected
          }),
        },
      }
      return mocked.mockApiInstance
    }),
    post: (...args) => mocked.refreshPost(...args),
  }

  return { default: axios }
})

vi.mock('@/utils/apiBaseUrl.js', () => ({
  getApiBaseUrl: vi.fn(() => '/api'),
}))

import axios from 'axios'
import api from '@/services/api.js'

describe('services/api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost/transactions', pathname: '/transactions' },
    })
  })

  it('cria instância com withCredentials para cookies httpOnly', () => {
    expect(api.withCredentials).toBe(true)
  })

  it('tenta refresh e repete request quando receber 401', async () => {
    const originalRequest = { url: '/transacoes', headers: {} }
    const error = { response: { status: 401 }, config: originalRequest }
    const retryResponse = { data: { ok: true } }
    mocked.refreshPost.mockResolvedValueOnce({ data: { ok: true } })
    mocked.mockApiInstance.mockResolvedValueOnce(retryResponse)

    const result = await mocked.responseErrorInterceptor(error)

    expect(mocked.refreshPost).toHaveBeenCalledWith('/api/auth/refresh', {}, {
      withCredentials: true,
    })
    expect(originalRequest._retry).toBe(true)
    expect(mocked.mockApiInstance).toHaveBeenCalledWith(originalRequest)
    expect(result).toEqual(retryResponse)
  })

  it('deduplica refresh concorrente com mutex', async () => {
    const originalRequestA = { url: '/transacoes', headers: {} }
    const originalRequestB = { url: '/metas', headers: {} }
    const errorA = { response: { status: 401 }, config: originalRequestA }
    const errorB = { response: { status: 401 }, config: originalRequestB }

    let resolveRefresh
    mocked.refreshPost.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefresh = resolve
      })
    )
    mocked.mockApiInstance.mockResolvedValue({ data: { ok: true } })

    const promiseA = mocked.responseErrorInterceptor(errorA)
    const promiseB = mocked.responseErrorInterceptor(errorB)

    expect(mocked.refreshPost).toHaveBeenCalledTimes(1)

    resolveRefresh({ data: { ok: true } })
    await Promise.all([promiseA, promiseB])
  })

  it('redireciona para login quando refresh falha', async () => {
    const error = {
      response: { status: 401 },
      config: { url: '/transacoes', headers: {} },
    }
    const refreshError = new Error('refresh falhou')
    mocked.refreshPost.mockRejectedValueOnce(refreshError)

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(refreshError)
    expect(window.location.href).toBe('/login')
  })

  it('não tenta refresh para rotas de autenticação', async () => {
    const error = {
      response: { status: 401 },
      config: { url: '/auth/login', headers: {} },
    }

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(error)
    expect(mocked.refreshPost).not.toHaveBeenCalled()
  })

  it('não tenta refresh para GET /auth/me (bootstrap de sessão)', async () => {
    const error = {
      response: { status: 401 },
      config: { url: '/auth/me', headers: {} },
    }

    await expect(mocked.responseErrorInterceptor(error)).rejects.toBe(error)
    expect(mocked.refreshPost).not.toHaveBeenCalled()
    expect(window.location.href).toBe('http://localhost/transactions')
  })

  it('não redireciona para login quando refresh falha em rota pública', async () => {
    window.location.pathname = '/login'
    window.location.href = 'http://localhost/login'

    const error = {
      response: { status: 401 },
      config: { url: '/transacoes', headers: {} },
    }
    mocked.refreshPost.mockRejectedValueOnce(new Error('refresh falhou'))

    await expect(mocked.responseErrorInterceptor(error)).rejects.toThrow('refresh falhou')
    expect(window.location.href).toBe('http://localhost/login')
  })

  it('exporta a instância criada de axios', () => {
    expect(api).toBe(mocked.mockApiInstance)
  })
})
