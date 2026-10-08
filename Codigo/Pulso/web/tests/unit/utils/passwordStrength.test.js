import { describe, expect, it } from 'vitest'
import {
    PASSWORD_RULES,
    allPasswordRulesPassed,
    getPasswordStrength,
} from '@/utils/passwordStrength.js'

describe('passwordStrength', () => {
    it('trata senha vazia como fraca', () => {
        expect(getPasswordStrength('')).toMatchObject({ label: 'Fraca', segments: 0 })
        expect(allPasswordRulesPassed('')).toBe(false)
    })

    it('classifica fraca, média e forte', () => {
        expect(getPasswordStrength('abc').label).toBe('Fraca')
        expect(getPasswordStrength('Abcdef12').label).toBe('Média')
        expect(getPasswordStrength('Abcdef1@').label).toBe('Forte')
        expect(allPasswordRulesPassed('Abcdef1@')).toBe(true)
    })

    it('expoe as cinco regras', () => {
        expect(PASSWORD_RULES).toHaveLength(5)
        expect(PASSWORD_RULES.map((rule) => rule.id)).toEqual([
            'length',
            'lower',
            'upper',
            'number',
            'special',
        ])
    })
})
