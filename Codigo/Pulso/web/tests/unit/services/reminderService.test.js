import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/services/api.js'
import {
  atualizarLembrete,
  criarLembrete,
  excluirLembrete,
  listarLembretes,
  marcarComoPago,
} from '@/services/reminderService.js'

describe('services/reminderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista lembretes com e sem mes', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: [{ id: 'l1' }] })
    api.get.mockResolvedValueOnce({ data: [{ id: 'l2' }] })

    await expect(listarLembretes({ mes: '2026-06' }, { signal })).resolves.toEqual([{ id: 'l1' }])
    await expect(listarLembretes()).resolves.toEqual([{ id: 'l2' }])

    expect(api.get).toHaveBeenNthCalledWith(1, '/lembretes?mes=2026-06', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/lembretes?', { signal: undefined })
  })

  it('cria, atualiza, exclui e marca lembrete como pago', async () => {
    const signal = new AbortController().signal
    api.post.mockResolvedValueOnce({ data: { id: 'l1' } })
    api.patch.mockResolvedValueOnce({ data: { id: 'l1', titulo: 'Conta' } })
    api.delete.mockResolvedValueOnce({})
    api.post.mockResolvedValueOnce({ data: { id: 'l1', pago: true } })

    await expect(criarLembrete({ titulo: 'Conta' }, { signal })).resolves.toEqual({ id: 'l1' })
    await expect(atualizarLembrete('l1', { titulo: 'Conta' }, { signal })).resolves.toEqual({
      id: 'l1',
      titulo: 'Conta',
    })
    await excluirLembrete('l1', { signal })
    await expect(marcarComoPago('l1', { signal })).resolves.toEqual({ id: 'l1', pago: true })

    expect(api.post).toHaveBeenNthCalledWith(1, '/lembretes', { titulo: 'Conta' }, { signal })
    expect(api.patch).toHaveBeenCalledWith('/lembretes/l1', { titulo: 'Conta' }, { signal })
    expect(api.delete).toHaveBeenCalledWith('/lembretes/l1', { signal })
    expect(api.post).toHaveBeenNthCalledWith(2, '/lembretes/l1/pagar', {}, { signal })
  })
})
