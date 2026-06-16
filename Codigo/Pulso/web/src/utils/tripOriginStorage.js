export const TRIP_ORIGIN_STORAGE_KEY = 'pulso_trip_origin_id'
export const DEFAULT_TRIP_ORIGIN_ID = 'GRU'

export function getSavedTripOriginId() {
  if (typeof window === 'undefined') return DEFAULT_TRIP_ORIGIN_ID
  return localStorage.getItem(TRIP_ORIGIN_STORAGE_KEY) || DEFAULT_TRIP_ORIGIN_ID
}

export function saveTripOriginId(originId) {
  if (typeof window === 'undefined' || !originId) return
  localStorage.setItem(TRIP_ORIGIN_STORAGE_KEY, originId)
}
