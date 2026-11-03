import { describe, expect, it } from 'vitest'
import {
    formatImportFormats,
    getImportStatementType,
    isImportFileAllowed,
} from '@/utils/importStatementTypes.js'

describe('importStatementTypes', () => {
    it('encontra o tipo e devolve null para id desconhecido', () => {
        expect(getImportStatementType('VA')?.label).toBe('Vale-Alimentação')
        expect(getImportStatementType('OUTRO')).toBeNull()
        expect(formatImportFormats()).toBe('PDF')
    })

    it('aceita apenas pdf do tipo escolhido', () => {
        expect(isImportFileAllowed(null, 'CONTA')).toBe(false)
        expect(isImportFileAllowed({ name: 'extrato.pdf' }, null)).toBe(false)
        expect(isImportFileAllowed({ name: 'extrato.PDF' }, 'VR')).toBe(true)
        expect(isImportFileAllowed({ name: 'extrato.csv' }, 'CONTA')).toBe(false)
        expect(isImportFileAllowed({ name: 'semextensao' }, 'VA')).toBe(false)
    })
})
