import { describe, expect, it } from 'vitest'
import { DEFAULT_PASSWORD_RULES } from '@/design-system/components/inputs/InputPassword/passwordRules.js'

describe('DEFAULT_PASSWORD_RULES', () => {
  it('expõe as 3 regras padrão', () => {
    expect(DEFAULT_PASSWORD_RULES).toHaveLength(3)
    expect(DEFAULT_PASSWORD_RULES.map((rule) => rule.label)).toEqual([
      'Mínimo 8 caracteres',
      'Pelo menos 1 número',
      'Pelo menos 1 maiúscula',
    ])
  })

  it('valida as regras por conteúdo', () => {
    expect(DEFAULT_PASSWORD_RULES[0].test('Abc12345')).toBe(true)
    expect(DEFAULT_PASSWORD_RULES[1].test('Abcdef')).toBe(false)
    expect(DEFAULT_PASSWORD_RULES[2].test('abc12345')).toBe(false)
  })
})
