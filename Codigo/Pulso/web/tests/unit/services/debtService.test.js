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
  excluirPagamento,
  obterResumo,
  quitarDivida,
  reabrirDivida,
  registrarPagamento,
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
      direcao: 'EU_DEVO',
      quitada: false,
      status: 'vencida',
      busca: 'cartao',
      ordenarValor: 'asc',
      dataInicio: '2026-01-01',
      dataFim: '2026-01-31',
      prazoInicio: '2026-02-01',
      prazoFim: '2026-02-28',
      pagina: 1,
      limite: 15,
    })
    const result2 = await buscarDividas({ direcao: 'TODOS', pagina: 3 })

    expect(api.get).toHaveBeenNthCalledWith(
      1,
      '/dividas?direcao=EU_DEVO&quitada=false&status=vencida&busca=cartao&ordenarValor=asc&dataInicio=2026-01-01&dataFim=2026-01-31&prazoInicio=2026-02-01&prazoFim=2026-02-28&pagina=1&limite=15',
      { signal: undefined }
    )
    expect(result1).toEqual({ dividas: [{ id: 'd1' }], total: 7, paginas: 2, pagina: 1 })
    expect(result2).toEqual({ dividas: [{ id: 'd2' }, { id: 'd3' }], total: 2, paginas: 1, pagina: 3 })
  })

  it('resume e muta dividas incluindo pagamentos e reabertura', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { totalAberto: 100 } })
    api.post.mockResolvedValueOnce({ data: { id: 'd1' } })
    api.post.mockResolvedValueOnce({ data: { divida: { id: 'd1', quitada: false }, pagamento: { id: 'p1' } } })
    api.patch.mockResolvedValueOnce({ data: { id: 'd1', valor: 10 } })
    api.patch.mockResolvedValueOnce({ data: { id: 'd1', quitada: true } })
    api.patch.mockResolvedValueOnce({ data: { id: 'd1', quitada: false } })
    api.delete.mockResolvedValueOnce({ data: { id: 'd1', valorRestante: '70.00' } })
    api.delete.mockResolvedValueOnce({})

    await expect(obterResumo({ signal })).resolves.toEqual({ totalAberto: 100 })
    await expect(criarDivida({ valor: 10 }, { signal })).resolves.toEqual({ id: 'd1' })
    await expect(registrarPagamento('d1', { valor: 30 }, { signal })).resolves.toEqual({
      divida: { id: 'd1', quitada: false },
      pagamento: { id: 'p1' },
    })
    await expect(atualizarDivida('d1', { valor: 10 }, { signal })).resolves.toEqual({ id: 'd1', valor: 10 })
    await expect(quitarDivida('d1', { signal })).resolves.toEqual({ id: 'd1', quitada: true })
    await expect(reabrirDivida('d1', { signal })).resolves.toEqual({ id: 'd1', quitada: false })
    await expect(excluirPagamento('d1', 'p1', { signal })).resolves.toEqual({ id: 'd1', valorRestante: '70.00' })
    await excluirDivida('d1', { signal })

    expect(api.post).toHaveBeenNthCalledWith(2, '/dividas/d1/pagamentos', { valor: 30 }, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(1, '/dividas/d1', { valor: 10 }, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(2, '/dividas/d1/quitar', {}, { signal })
    expect(api.patch).toHaveBeenNthCalledWith(3, '/dividas/d1/reabrir', {}, { signal })
    expect(api.delete).toHaveBeenNthCalledWith(1, '/dividas/d1/pagamentos/p1', { signal })
  })
})
