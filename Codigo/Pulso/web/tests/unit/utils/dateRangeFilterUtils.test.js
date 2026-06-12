import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  datesIguais,
  defaultMesAtualDateRange,
  filtrosPeriodoSaoPadrao,
  formatDateParam,
  parseDateParam,
  periodoFromDateRange,
  periodoParaDateRange,
} from '@/utils/dateRangeFilterUtils.js'

describe('dateRangeFilterUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formata e converte parâmetros de data', () => {
    const date = new Date(2026, 5, 9)
    expect(formatDateParam(date)).toBe('2026-06-09')
    expect(parseDateParam('2026-06-09')).toEqual(new Date(2026, 5, 9))
    expect(parseDateParam('x')).toBeNull()
  })

  it('compara datas corretamente', () => {
    expect(datesIguais(null, null)).toBe(true)
    expect(datesIguais(new Date(2026, 5, 1), new Date(2026, 5, 1))).toBe(true)
    expect(datesIguais(new Date(2026, 5, 1), new Date(2026, 5, 2))).toBe(false)
  })

  it('converte período e intervalos do mês atual', () => {
    const range = periodoParaDateRange('2026-07')
    expect(formatDateParam(range.start)).toBe('2026-07-01')
    expect(formatDateParam(range.end)).toBe('2026-07-31')

    const atual = defaultMesAtualDateRange()
    expect(periodoFromDateRange(atual.start)).toBe('2026-06')
  })

  it('valida se filtros representam o mês atual padrão', () => {
    const { start, end } = defaultMesAtualDateRange()
    expect(filtrosPeriodoSaoPadrao(start, end)).toBe(true)
    expect(filtrosPeriodoSaoPadrao(new Date(2026, 5, 2), end)).toBe(false)
  })
})
