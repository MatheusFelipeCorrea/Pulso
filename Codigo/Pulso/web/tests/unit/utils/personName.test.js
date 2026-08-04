import { describe, expect, it } from 'vitest'

import { formatPersonName } from '@/utils/personName.js'

describe('formatPersonName', () => {
  it('capitaliza a primeira letra de cada palavra', () => {
    expect(formatPersonName('carol')).toBe('Carol')
    expect(formatPersonName('maria silva')).toBe('Maria Silva')
    expect(formatPersonName('  joão  pedro  ')).toBe('João Pedro')
  })

  it('retorna string vazia para valores inválidos', () => {
    expect(formatPersonName('')).toBe('')
    expect(formatPersonName('   ')).toBe('')
    expect(formatPersonName(null)).toBe('')
  })
})
