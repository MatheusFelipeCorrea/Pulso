import { describe, expect, it } from 'vitest'
import { REQUIRED_FIELD_ERROR, isRequiredValueEmpty } from '@/utils/formValidation.js'

describe('formValidation', () => {
    it('detecta valor obrigatório vazio', () => {
        expect(REQUIRED_FIELD_ERROR).toMatch(/Preencha/)
        expect(isRequiredValueEmpty(null)).toBe(true)
        expect(isRequiredValueEmpty('  ')).toBe(true)
        expect(isRequiredValueEmpty('ok')).toBe(false)
        expect(isRequiredValueEmpty(0)).toBe(false)
    })
})
