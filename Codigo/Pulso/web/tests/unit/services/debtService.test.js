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
  atualizarDivida,
  buscarDividas,
  criarDivida,
  excluirDivida,
  obterResumo,
  quitarDivida,
} from '@/services/debtService.js'

describe('services/debtService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('busca dividas com filtros e fallback de headers', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 'd1' }],
      headers: { 'x-total-count': '7', 'x-total-pages': '2', 'x-current-page': '1' },
    })
    api.get.mockResolvedValueOnce({ data: [{ id: 'd2' }, { id: 'd3' }], headers: {} })

    const result1 = await buscarDividas({
      direcao: 'A_PAGAR',
      quitada: false,
      busca: 'cartao',
      ordenarValor: 'asc',
      dataInicio: '2026-01-01',
      dataFim: '2026-01-31',
      pagina: 1,
      limite: 15,
    })
    const result2 = await buscarDividas({ direcao: 'TODOS', pagina: 3 })

    expect(api.get).toHaveBeenNthCalledWith(
      1,
      '/dividas?direcao=A_PAGAR&quitada=false&busca=cartao&ordenarValor=asc&dataInicio=2026-01-01&dataFim=2026-01-31&pagina=1&limite=15',
      { signal: undefined }
    )
    expect(result1).toEqual({ dividas: [{ id: 'd1' }], total: 7, paginas: 2, pagina: 1 })
    expect(result2).toEqual({ dividas: [{ id: 'd2' }, { id: 'd3' }], total: 2, paginas: 1, pagina: 3 })
  })

  it('resume e muta dividas', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { totalAberto: 100 } })
    api.post.mockResolvedValueOnce({ data: { id: 'd1' } })
    api.patch.mockResolvedValueOnce({ data: { id: 'd1', valor: 10 } })
    api.patch.mockResolvedValueOnce({ data: { id: 'd1', quitada: true } })
    api.delete.mockResolvedValueOnce({})

    await expect(obterResumo({ signal })).resolves.toEqual({ totalAberto: 100 })
    await expect(criarDivida({ valor: 10 }, { signal })).resolves.toEqual({ id: 'd1' })
    await expect(atualizarDivida('d1', { valor: 10 }, { signal })).resolves.toEqual({ id: 'd1', valor: 10 })
    await expect(quitarDivida('d1', { signal })).resolves.toEqual({ id: 'd1', quitada: true })
    await excluirDivida('d1', { signal })

    expect(api.get).toHaveBeenCalledWith('/dividas/resumo', { signal })
    expect(api.post).toHaveBeenCalledWith('/dividas', { valor: 10 }, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(1, '/dividas/d1', { valor: 10 }, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(2, '/dividas/d1/quitar', {}, { signal })
    expect(api.delete).toHaveBeenCalledWith('/dividas/d1', { signal })
  })
})
