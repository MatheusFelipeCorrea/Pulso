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
  atualizarTransacao,
  buscarTransacoes,
  criarTransacao,
  excluirTransacao,
  obterOpcoesFiltro,
  obterResumo,
} from '@/services/transactionService.js'

describe('services/transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('monta query de busca e usa headers para paginação', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 't1' }],
      headers: { 'x-total-count': '11', 'x-total-pages': '3', 'x-current-page': '2' },
    })

    const result = await buscarTransacoes({
      dataInicio: '2026-01-01',
      dataFim: '2026-01-31',
      periodo: 'mes',
      categoria: 'nome:Outros',
      tipo: 'DESPESA',
      recurso: 'VR',
      busca: 'mercado',
      pagina: 2,
      limite: 20,
    })

    expect(api.get).toHaveBeenCalledWith(
      '/transacoes?dataInicio=2026-01-01&dataFim=2026-01-31&periodo=mes&categoriaNome=Outros&tipo=DESPESA&recurso=VR&busca=mercado&pagina=2&limite=20',
      { signal: undefined }
    )
    expect(result).toEqual({
      transacoes: [{ id: 't1' }],
      total: 11,
      paginas: 3,
      pagina: 2,
    })
  })

  it('ignora filtros TODOS e usa fallback de paginação', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 't1' }, { id: 't2' }], headers: {} })

    const result = await buscarTransacoes({ tipo: 'TODOS', recurso: 'TODOS', pagina: 4 })

    expect(api.get).toHaveBeenCalledWith('/transacoes?pagina=4', { signal: undefined })
    expect(result).toEqual({
      transacoes: [{ id: 't1' }, { id: 't2' }],
      total: 2,
      paginas: 1,
      pagina: 4,
    })
  })

  it('obtem resumo e opcoes com signal opcional', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { total: 100 } })
    api.get.mockResolvedValueOnce({ data: { categorias: [] } })

    await expect(obterResumo({ periodo: 'mes' }, { signal })).resolves.toEqual({ total: 100 })
    await expect(obterOpcoesFiltro({ signal })).resolves.toEqual({ categorias: [] })

    expect(api.get).toHaveBeenNthCalledWith(1, '/transacoes/resumo?periodo=mes', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/transacoes/filtros', { signal })
  })

  it('cria, atualiza e exclui transação', async () => {
    api.post.mockResolvedValueOnce({ data: { id: '1' } })
    api.patch.mockResolvedValueOnce({ data: { id: '1', valor: 10 } })
    api.delete.mockResolvedValueOnce({})

    await expect(criarTransacao({ valor: 10 })).resolves.toEqual({ id: '1' })
    await expect(atualizarTransacao('1', { valor: 10 })).resolves.toEqual({ id: '1', valor: 10 })
    await excluirTransacao('1', true)

    expect(api.post).toHaveBeenCalledWith('/transacoes', { valor: 10 })
    expect(api.patch).toHaveBeenCalledWith('/transacoes/1', { valor: 10 })
    expect(api.delete).toHaveBeenCalledWith('/transacoes/1', {
      params: { excluirFuturas: 'true' },
    })
  })
})
