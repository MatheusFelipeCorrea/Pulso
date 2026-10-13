import { describe, expect, it } from 'vitest'
import {
    getObservationBadgeLabel,
    inferObservationTipo,
    resolveObservationBadge,
} from '@/utils/tripObservationTypes.js'

describe('tripObservationTypes', () => {
    it('infere tipo e badge', () => {
        expect(inferObservationTipo({})).toBeNull()
        expect(inferObservationTipo({ checklist: [{ texto: 'passaporte' }] })).toBe('CHECKLIST')
        expect(inferObservationTipo({ linkUrl: 'https://x' })).toBe('LINK')
        expect(inferObservationTipo({ checklist: [{ texto: 'a' }], linkUrl: 'https://x' })).toBe(
            'GERAL'
        )
        expect(getObservationBadgeLabel({ checklist: [{ texto: 'a' }] })).toBe('Checklist')
        expect(resolveObservationBadge({ linkUrl: 'https://x' })).toBe('LINK')
        expect(getObservationBadgeLabel({})).toBeNull()
    })
})
