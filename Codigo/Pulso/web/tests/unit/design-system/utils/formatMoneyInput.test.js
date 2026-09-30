import { describe, expect, it } from 'vitest'

import { digitsToNumber, formatMoneyMask } from '@/design-system/utils/formatMoneyInput.js'

describe('design-system/utils/formatMoneyInput', () => {
  it('formata valores monetários com 2 casas', () => {
    expect(formatMoneyMask(1234.5)).toBe('1.234,50')
    expect(formatMoneyMask(NaN)).toBe('0,00')
  })

  it('converte dígitos em número decimal', () => {
    expect(digitsToNumber('12345')).toBe(123.45)
    expect(digitsToNumber('R$ 9,90')).toBe(9.9)
    expect(digitsToNumber('')).toBe(0)
  })
})
