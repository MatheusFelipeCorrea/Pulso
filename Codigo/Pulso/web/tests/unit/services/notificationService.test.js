import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

import api from '@/services/api.js'
import {
  contarNaoLidas,
  listarNotificacoes,
  marcarComoLida,
  marcarTodasLidas,
} from '@/services/notificationService.js'

describe('services/notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista notificacoes com params opcionais', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: [{ id: 'n1' }] })
    api.get.mockResolvedValueOnce({ data: [] })

    await expect(listarNotificacoes({ lida: false, limite: 20, pagina: 3 }, { signal })).resolves.toEqual([
      { id: 'n1' },
    ])
    await expect(listarNotificacoes({ limite: 0, pagina: 0 })).resolves.toEqual([])

    expect(api.get).toHaveBeenNthCalledWith(1, '/notificacoes?lida=false&limite=20&pagina=3', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/notificacoes?', { signal: undefined })
  })

  it('conta e marca notificacoes como lidas', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { quantidade: 4 } })
    api.patch.mockResolvedValueOnce({ data: { id: 'n1', lida: true } })
    api.patch.mockResolvedValueOnce({ data: { updated: 2 } })

    await expect(contarNaoLidas({ signal })).resolves.toEqual({ quantidade: 4 })
    await expect(marcarComoLida('n1', { signal })).resolves.toEqual({ id: 'n1', lida: true })
    await expect(marcarTodasLidas({ signal })).resolves.toEqual({ updated: 2 })

    expect(api.get).toHaveBeenCalledWith('/notificacoes/contador', { signal })
    expect(api.patch).toHaveBeenNthCalledWith(1, '/notificacoes/n1/marcar-lida', {}, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(2, '/notificacoes/marcar-todas-lidas', {}, { signal })
  })
})
