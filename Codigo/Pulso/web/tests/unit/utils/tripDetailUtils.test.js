import { describe, expect, it } from 'vitest'
import {
    buildCategoryBreakdown,
    calcTripTotalInCurrency,
    formatTripDetailDate,
    formatTripRateUpdatedAt,
} from '@/utils/tripDetailUtils.js'

describe('tripDetailUtils', () => {
    it('formata data da viagem e ignora inválida', () => {
        expect(formatTripDetailDate('')).toBe('')
        expect(formatTripDetailDate('2026-10-01')).toMatch(/out\/2026/i)
        expect(formatTripDetailDate('nao-e-data')).toBe('')
    })

    it('formata atualização de câmbio', () => {
        expect(formatTripRateUpdatedAt('')).toBeNull()
        expect(formatTripRateUpdatedAt('invalid')).toBeNull()
        expect(formatTripRateUpdatedAt('2026-10-08T15:00:00.000Z')).toMatch(/\d{2}\/\d{2}\/2026/)
    })

    it('monta breakdown e converte total', () => {
        const rows = buildCategoryBreakdown([
            { categoria: 'ALIMENTACAO', valorEstimado: 100 },
            { categoria: 'ALIMENTACAO', valorEstimado: 50 },
            { categoria: 'TRANSPORTE', valorEstimado: 50 },
        ])
        expect(rows[0].categoria).toBe('ALIMENTACAO')
        expect(rows[0].percentual).toBe(75)
        expect(buildCategoryBreakdown([]).length).toBe(0)
        expect(calcTripTotalInCurrency(100, 'BRL', 5)).toBe(100)
        expect(calcTripTotalInCurrency(100, 'USD', 5)).toBe(20)
        expect(calcTripTotalInCurrency(100, 'USD', 0)).toBe(100)
    })
})
