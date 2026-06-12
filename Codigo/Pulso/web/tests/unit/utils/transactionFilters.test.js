import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_TRANSACTION_FILTROS,
  buildTransactionApiFiltros,
  filtrosPeriodoSaoPadrao,
  filtrosTransacaoIguais,
  filtrosTransacaoSaoPadrao,
  periodoFromFiltros,
} from '@/utils/transactionFilters.js'

describe('transactionFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('gera filtros padrão com período do mês atual', () => {
    const filtros = DEFAULT_TRANSACTION_FILTROS()
    expect(filtros.tipo).toBe('TODOS')
    expect(periodoFromFiltros(filtros)).toBe('2026-06')
    expect(filtrosPeriodoSaoPadrao(filtros.dataInicio, filtros.dataFim)).toBe(true)
  })

  it('compara filtros e identifica padrão', () => {
    const a = DEFAULT_TRANSACTION_FILTROS()
    const b = DEFAULT_TRANSACTION_FILTROS()
    expect(filtrosTransacaoIguais(a, b)).toBe(true)
    expect(filtrosTransacaoSaoPadrao(a)).toBe(true)

    b.busca = 'mercado'
    expect(filtrosTransacaoIguais(a, b)).toBe(false)
  })

  it('constrói filtros para API convertendo datas', () => {
    expect(
      buildTransactionApiFiltros({
        dataInicio: new Date(2026, 5, 1),
        dataFim: new Date(2026, 5, 30),
        categoria: 'cat-1',
      })
    ).toEqual({
      categoria: 'cat-1',
      dataInicio: '2026-06-01',
      dataFim: '2026-06-30',
    })

    expect(buildTransactionApiFiltros({ busca: 'x' })).toEqual({
      busca: 'x',
      dataInicio: undefined,
      dataFim: undefined,
    })
  })
})
