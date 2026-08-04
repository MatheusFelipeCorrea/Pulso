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
    api.get.mockResolvedValueOnce({
      data: [{ id: 'n1', tipo: 'STREAK', titulo: 'Streak', mensagem: 'ok', lida: false, criadoEm: '2026-01-01' }],
      headers: { 'x-total-count': '1', 'x-total-pages': '1', 'x-current-page': '1' },
    })

    const result = await listarNotificacoes({ lida: false, limite: 20, pagina: 3 }, { signal })

    expect(result.notificacoes).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(api.get).toHaveBeenCalledWith('/notificacoes?lida=false&limite=20&pagina=3', { signal })
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
