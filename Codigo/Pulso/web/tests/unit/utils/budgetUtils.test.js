import { describe, expect, it } from 'vitest'
import {
  barToneFromPercentual,
  formatPercentualCategoria,
  mesReferenciaAnterior,
  periodoToMesReferencia,
  statusToProgressVariant,
} from '@/utils/budgetUtils.js'

describe('budgetUtils', () => {
  it('converte período para mês referência e mês anterior', () => {
    expect(periodoToMesReferencia('2026-06')).toBe('2026-06-01')
    expect(mesReferenciaAnterior('2026-01')).toBe('2025-12-01')
  })

  it('mapeia status para variante da barra', () => {
    expect(statusToProgressVariant('estourado')).toBe('danger')
    expect(statusToProgressVariant('alerta')).toBe('warning')
    expect(statusToProgressVariant('ok')).toBe('primary')
  })

  it('define tom da barra baseado no percentual', () => {
    expect(barToneFromPercentual(120)).toBe('danger')
    expect(barToneFromPercentual(70)).toBe('warning')
    expect(barToneFromPercentual(69.9)).toBe('primary')
  })

  it('formata percentual inteiro e decimal com vírgula', () => {
    expect(formatPercentualCategoria(10)).toBe('10%')
    expect(formatPercentualCategoria(10.16)).toBe('10,2%')
  })
})
