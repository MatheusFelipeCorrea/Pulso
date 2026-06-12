import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  calcularResetVt,
  canUseVtFeatures,
  filterSidebarNavForUser,
  formatDateBR,
  formatDiferenca,
  isVtDisabledByUser,
  isVtNavVisible,
  monthValueFromPeriodo,
  needsVtOptIn,
  periodoFromMonthValue,
  toISODate,
} from '@/utils/transportUtils.js'

describe('transportUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('converte período para month value e vice-versa', () => {
    expect(monthValueFromPeriodo('2026-02')).toEqual({ year: 2026, month: 2 })
    expect(periodoFromMonthValue({ year: 2026, month: 2 })).toBe('2026-02')
    expect(periodoFromMonthValue(null)).toBe('2026-06')
  })

  it('calcula reset VT para período passado, atual e futuro', () => {
    expect(calcularResetVt('2026-05')).toMatchObject({
      isMesAtual: false,
      encerrado: true,
      progresso: 100,
      status: 'Período encerrado',
    })

    expect(calcularResetVt('2026-06')).toMatchObject({
      isMesAtual: true,
      encerrado: false,
    })

    expect(calcularResetVt('2026-07')).toMatchObject({
      isMesAtual: false,
      encerrado: false,
      status: 'Período futuro',
    })
  })

  it('formata data BR e ISO de forma consistente', () => {
    expect(formatDateBR('2026-06-30T12:00:00')).toBe('30/06/2026')
    expect(formatDateBR('invalida')).toBe('—')
    const iso = toISODate(new Date(2026, 5, 10))
    expect(iso.startsWith('2026-06-10')).toBe(true)
    expect(iso.endsWith('Z')).toBe(true)
  })

  it('aplica regras de visibilidade/uso do VT', () => {
    expect(isVtNavVisible('PESSOA_FISICA', true)).toBe(false)
    expect(isVtNavVisible('CLT', undefined)).toBe(true)
    expect(needsVtOptIn('PJ', null)).toBe(true)
    expect(isVtDisabledByUser('PJ', false)).toBe(true)
    expect(canUseVtFeatures('PJ', true)).toBe(true)
    expect(canUseVtFeatures('PJ', false)).toBe(false)
  })

  it('filtra navegação lateral removendo filho VT quando necessário', () => {
    const navItems = [
      {
        id: 'financeiro',
        children: [
          { id: 'transacoes' },
          { id: 'vale-transporte' },
        ],
      },
    ]

    expect(filterSidebarNavForUser(navItems, { modoUso: 'PESSOA_FISICA' })).toEqual([
      { id: 'financeiro', children: [{ id: 'transacoes' }] },
    ])
  })

  it('formata diferença monetária com tom correto', () => {
    expect(formatDiferenca(10)).toMatchObject({ tone: 'positive' })
    expect(formatDiferenca(-10)).toMatchObject({ tone: 'negative' })
    expect(formatDiferenca('x')).toEqual({ text: '—', tone: 'neutral' })
  })
})
