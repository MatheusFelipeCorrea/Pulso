import { describe, expect, it } from 'vitest'

import {
  getHealthLabel,
  getHealthVariant,
  getProgressFillPercent,
  getProgressPercent,
  resolveProgressVariant,
} from '@/design-system/utils/progressUtils.js'

describe('design-system/utils/progressUtils', () => {
  it('calcula percentual e largura visual com clamp', () => {
    expect(getProgressPercent(50, 200)).toBe(25)
    expect(getProgressPercent(10, 0)).toBe(0)
    expect(getProgressFillPercent(150, 100)).toBe(100)
    expect(getProgressFillPercent(-10, 100)).toBe(0)
  })

  it('mapeia faixa de saúde para variant e label', () => {
    expect(getHealthVariant(20)).toBe('danger')
    expect(getHealthVariant(45)).toBe('warning')
    expect(getHealthVariant(65)).toBe('info')
    expect(getHealthVariant(80)).toBe('success')
    expect(getHealthVariant(99)).toBe('primary')

    expect(getHealthLabel(20)).toBe('Crítico')
    expect(getHealthLabel(45)).toBe('Alerta')
    expect(getHealthLabel(65)).toBe('Regular')
    expect(getHealthLabel(80)).toBe('Bom')
    expect(getHealthLabel(99)).toBe('Excelente')
  })

  it('resolve variant final conforme overflow e colorMode', () => {
    expect(resolveProgressVariant({ value: 120, max: 100, variant: 'success' })).toBe('danger')
    expect(resolveProgressVariant({ value: 60, max: 100, colorMode: 'health' })).toBe('info')
    expect(resolveProgressVariant({ value: 60, max: 100, colorMode: 'variant', variant: 'warning' })).toBe(
      'warning'
    )
  })
})
