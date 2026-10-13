import { afterEach, describe, expect, it } from 'vitest'
import {
    DEFAULT_TRIP_ORIGIN_ID,
    TRIP_ORIGIN_STORAGE_KEY,
    getSavedTripOriginId,
    saveTripOriginId,
} from '@/utils/tripOriginStorage.js'

describe('tripOriginStorage', () => {
    afterEach(() => {
        localStorage.clear()
    })

    it('usa GRU por padrão e persiste origem', () => {
        expect(getSavedTripOriginId()).toBe(DEFAULT_TRIP_ORIGIN_ID)
        saveTripOriginId('')
        expect(localStorage.getItem(TRIP_ORIGIN_STORAGE_KEY)).toBeNull()
        saveTripOriginId('CNF')
        expect(getSavedTripOriginId()).toBe('CNF')
    })
})
