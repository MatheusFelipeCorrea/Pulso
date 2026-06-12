import { describe, expect, it } from 'vitest'
import {
  DEBT_TABS,
  DEFAULT_DEBT_FILTROS,
  buildApiFiltros,
  filtrosDividaIguais,
  filtrosDividaSaoPadrao,
} from '@/utils/debtFilters.js'

describe('debtFilters', () => {
  it('gera filtros padrão e identifica padrão', () => {
    const filtros = DEFAULT_DEBT_FILTROS()
    expect(filtrosDividaSaoPadrao(filtros)).toBe(true)
  })

  it('compara filtros considerando igualdade estrita de datas', () => {
    const data = new Date(2026, 5, 1)
    const a = { ...DEFAULT_DEBT_FILTROS(), dataInicio: data, dataFim: data }
    const b = { ...DEFAULT_DEBT_FILTROS(), dataInicio: data, dataFim: data }
    expect(filtrosDividaIguais(a, b)).toBe(true)

    const c = { ...DEFAULT_DEBT_FILTROS(), dataInicio: new Date(2026, 5, 1), dataFim: data }
    expect(filtrosDividaIguais(a, c)).toBe(false)
  })

  it('constrói payload da API para quitadas e abas ativas', () => {
    const filtros = {
      ...DEFAULT_DEBT_FILTROS(),
      dataInicio: new Date(2026, 5, 1),
      dataFim: new Date(2026, 5, 30),
      busca: 'ana',
    }

    expect(buildApiFiltros(DEBT_TABS.QUITADAS, filtros)).toMatchObject({
      quitada: true,
      busca: 'ana',
      dataInicio: '2026-06-01',
      dataFim: '2026-06-30',
    })

    expect(buildApiFiltros(DEBT_TABS.EU_DEVO, filtros)).toMatchObject({
      quitada: false,
      direcao: DEBT_TABS.EU_DEVO,
    })
  })
})
