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
  copiarOrcamento,
  listarOrcamentos,
  obterStatusOrcamento,
  removerOrcamento,
  salvarOrcamentos,
} from '@/services/budgetService.js'

describe('services/budgetService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtem status e lista com/sem mes', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { status: 'ok' } })
    api.get.mockResolvedValueOnce({ data: [{ id: '1' }] })
    api.get.mockResolvedValueOnce({ data: [{ id: '2' }] })

    await expect(obterStatusOrcamento('2026-06', { signal })).resolves.toEqual({ status: 'ok' })
    await expect(listarOrcamentos('2026-06')).resolves.toEqual([{ id: '1' }])
    await expect(listarOrcamentos()).resolves.toEqual([{ id: '2' }])

    expect(api.get).toHaveBeenNthCalledWith(1, '/orcamentos/status?mes=2026-06', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/orcamentos?mes=2026-06', { signal: undefined })
    expect(api.get).toHaveBeenNthCalledWith(3, '/orcamentos', { signal: undefined })
  })

  it('salva, copia e remove orcamento', async () => {
    api.post.mockResolvedValueOnce({ data: { saved: true } })
    api.post.mockResolvedValueOnce({ data: { copied: true } })
    api.delete.mockResolvedValueOnce({})
    const signal = new AbortController().signal

    await expect(
      salvarOrcamentos({ mesReferencia: '2026-06', limites: [{ categoriaId: 'c1', limite: 100 }] }, { signal })
    ).resolves.toEqual({ saved: true })
    await expect(copiarOrcamento({ mesOrigem: '2026-05', mesDestino: '2026-06' })).resolves.toEqual({
      copied: true,
    })
    await removerOrcamento('orc1', { signal })

    expect(api.post).toHaveBeenNthCalledWith(
      1,
      '/orcamentos',
      { mesReferencia: '2026-06', limites: [{ categoriaId: 'c1', limite: 100 }] },
      { signal }
    )
    expect(api.post).toHaveBeenNthCalledWith(
      2,
      '/orcamentos/copiar',
      { mesOrigem: '2026-05', mesDestino: '2026-06' },
      { signal: undefined }
    )
    expect(api.delete).toHaveBeenCalledWith('/orcamentos/orc1', { signal })
  })
})
