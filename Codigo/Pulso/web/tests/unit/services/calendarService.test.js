import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import api from '@/services/api.js'
import {
  desconectarGoogle,
  obterDetalheDia,
  obterPendentesSyncGoogle,
  obterStatusGoogle,
  obterUrlGoogle,
  obterVisaoMes,
  sincronizarPendentesGoogle,
} from '@/services/calendarService.js'

describe('services/calendarService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtem visoes e status do calendario', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { dias: [] } })
    api.get.mockResolvedValueOnce({ data: { eventos: [] } })
    api.get.mockResolvedValueOnce({ data: { conectado: true } })
    api.get.mockResolvedValueOnce({ data: { url: 'http://google' } })
    api.get.mockResolvedValueOnce({ data: { pendentes: 2 } })

    await expect(obterVisaoMes('2026-06', { signal })).resolves.toEqual({ dias: [] })
    await expect(obterDetalheDia('2026-06-10', { signal })).resolves.toEqual({ eventos: [] })
    await expect(obterStatusGoogle({ signal })).resolves.toEqual({ conectado: true })
    await expect(obterUrlGoogle({ signal })).resolves.toEqual({ url: 'http://google' })
    await expect(obterPendentesSyncGoogle({ signal })).resolves.toEqual({ pendentes: 2 })

    expect(api.get).toHaveBeenNthCalledWith(1, '/calendario/mes?mes=2026-06', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/calendario/dia?data=2026-06-10', { signal })
    expect(api.get).toHaveBeenNthCalledWith(3, '/calendario/google/status', { signal })
    expect(api.get).toHaveBeenNthCalledWith(4, '/calendario/google/url', { signal })
    expect(api.get).toHaveBeenNthCalledWith(5, '/calendario/google/sync/pendentes', { signal })
  })

  it('desconecta e sincroniza Google', async () => {
    const signal = new AbortController().signal
    api.post.mockResolvedValueOnce({})
    api.post.mockResolvedValueOnce({ data: { synced: true } })
    api.post.mockResolvedValueOnce({ data: { synced: 'future' } })

    await desconectarGoogle({ signal })
    await expect(sincronizarPendentesGoogle(undefined, { signal })).resolves.toEqual({ synced: true })
    await expect(sincronizarPendentesGoogle('todos', { signal })).resolves.toEqual({ synced: 'future' })

    expect(api.post).toHaveBeenNthCalledWith(1, '/calendario/google/desconectar', {}, { signal })
    expect(api.post).toHaveBeenNthCalledWith(
      2,
      '/calendario/google/sync',
      { escopo: 'futuros' },
      { signal }
    )
    expect(api.post).toHaveBeenNthCalledWith(3, '/calendario/google/sync', { escopo: 'todos' }, { signal })
  })
})
