import { describe, expect, it, vi } from 'vitest'

import { formatNumber } from '@/design-system/utils/formatNumber.js'

describe('design-system/utils/formatNumber', () => {
  it('formata números válidos com locale padrão e customizado', () => {
    expect(formatNumber(1500.5)).toBe('1.500,5')
    expect(formatNumber('1500.5', { minimumFractionDigits: 2 })).toBe('1.500,50')
    expect(formatNumber(1000, { locale: 'en-US' })).toBe('1,000')
  })

  it('retorna placeholder para valores inválidos', () => {
    expect(formatNumber(null)).toBe('—')
    expect(formatNumber(undefined)).toBe('—')
    expect(formatNumber('abc')).toBe('—')
  })

  it('captura erro do Intl.NumberFormat', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(formatNumber(10, { style: 'currency', currency: 'INVALID' })).toBe('—')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
