import { describe, expect, it, vi } from 'vitest'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

describe('formatCurrency', () => {
  it('formata valor numérico e string', () => {
    expect(formatCurrency(1500.5)).toContain('1.500,50')
    expect(formatCurrency('25.9')).toContain('25,90')
  })

  it('retorna placeholder para valores inválidos', () => {
    expect(formatCurrency(null)).toBe('—')
    expect(formatCurrency(undefined)).toBe('—')
    expect(formatCurrency('abc')).toBe('—')
  })

  it('captura erro do Intl e retorna placeholder', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(formatCurrency(10, 'pt-BR', 'INVALID')).toBe('—')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
