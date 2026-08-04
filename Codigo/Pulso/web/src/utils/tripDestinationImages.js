import { TRIP_COUNTRY_ENTRIES } from './tripCountryImages.js'
import { TRIP_BRAZIL_CITY_ENTRIES } from './tripBrazilCityCatalog.js'
import { CURRENCY_COUNTRY_CODE, getCountryFlagUrl } from './tripFlagImages.js'
import {
  buildCommonsSearchQueries,
  buildGeoWikiTitles,
  fetchCommonsPlaceImages,
} from './tripCommonsImage.js'
import { fetchPlaceThumbnails, repairWikiThumbUrl } from './tripWikipediaImage.js'

const IMAGE_SIZE = 'w=320&h=420&fit=crop&q=80'

/** Placeholder neutro enquanto carrega (não bandeira). */
export const TRIP_FALLBACK_IMAGE =
  `https://images.unsplash.com/photo-1488646953014-85cb44e25828?${IMAGE_SIZE}`

export function normalizeDestinationText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function parseDestinationParts(destino) {
  const raw = String(destino ?? '').trim()
  if (!raw) return []

  const segments = raw
    .split(/[,;/|]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const unique = new Set([raw, ...segments])
  return [...unique]
}

function keywordMatches(token, keyword) {
  const normalizedKeyword = normalizeDestinationText(keyword)
  if (!normalizedKeyword) return false

  if (normalizedKeyword.length <= 3) {
    const pattern = new RegExp(`(^|[\\s,-])${normalizedKeyword}($|[\\s,-])`)
    return pattern.test(token)
  }

  return token.includes(normalizedKeyword)
}

function findBestKeywordEntry(entries, destino) {
  const normalized = normalizeDestinationText(destino)
  if (!normalized) return null

  const parts = normalized.split(/[,;/|]+/).map((part) => part.trim()).filter(Boolean)
  const tokens = [...new Set([normalized, ...parts])]

  let bestEntry = null
  let bestScore = 0

  for (const entry of entries) {
    for (const keyword of entry.keywords) {
      for (const token of tokens) {
        if (!keywordMatches(token, keyword)) continue

        const score = normalizeDestinationText(keyword).length
        if (score > bestScore) {
          bestScore = score
          bestEntry = entry
        }
      }
    }
  }

  return bestEntry
}

function findCountryMatch(normalizedDestino) {
  return findBestKeywordEntry(TRIP_COUNTRY_ENTRIES, normalizedDestino)
}

function getIsoFromCountryEntry(entry) {
  if (!entry) return null
  const iso = entry.keywords.find((keyword) => /^[a-z]{2}$/i.test(String(keyword).trim()))
  return iso ? iso.toUpperCase() : null
}

export function resolveCountryCode(destino, destinoMeta, moeda) {
  if (destinoMeta?.countryCode) {
    return String(destinoMeta.countryCode).toUpperCase()
  }

  for (const part of parseDestinationParts(destino)) {
    const iso = getIsoFromCountryEntry(findCountryMatch(normalizeDestinationText(part)))
    if (iso) return iso
  }

  const fromCurrency = CURRENCY_COUNTRY_CODE[String(moeda ?? '').toUpperCase()]
  return fromCurrency ?? null
}

function findBrazilCityEntry(destino, destinoMeta) {
  const candidates = [destinoMeta?.label, destino].filter(Boolean)
  for (const text of candidates) {
    const entry = findBestKeywordEntry(TRIP_BRAZIL_CITY_ENTRIES, text)
    if (entry) return entry
  }
  return null
}

/** Títulos Wikipedia desambiguados (espelha a API). */
const EXTRA_WIKI_TITLES_BY_LABEL = {
  macae: ['Macaé (Rio de Janeiro)', 'Macaé, Rio de Janeiro', 'Macae, Rio de Janeiro'],
  vitoria: ['Vitória, Espírito Santo', 'Vitória (Espírito Santo)'],
  toquio: ['Tóquio', 'Tokyo', 'Tóquio, Japão'],
  tokyo: ['Tokyo', 'Tóquio'],
  paris: ['Paris', 'Paris, França'],
  londres: ['Londres', 'London', 'Londres, Reino Unido'],
  london: ['London', 'Londres'],
  'nova york': ['Nova Iorque', 'New York City', 'Nova York'],
  'new york': ['New York City', 'Nova Iorque'],
}

function appendExtraWikiTitles(titles, label) {
  const key = normalizeDestinationText(label)
  const extras = EXTRA_WIKI_TITLES_BY_LABEL[key]
  if (extras) titles.push(...extras)

  const firstPart = key.split(',')[0]?.trim()
  if (firstPart && firstPart !== key) {
    const partExtras = EXTRA_WIKI_TITLES_BY_LABEL[firstPart]
    if (partExtras) titles.push(...partExtras)
  }
}

export function collectPlaceWikipediaTitles(destino, destinoMeta) {
  const titles = []

  const brEntry = findBrazilCityEntry(destino, destinoMeta)
  if (brEntry?.wikiTitles) {
    titles.push(...brEntry.wikiTitles)
  }

  if (destinoMeta?.label) {
    appendExtraWikiTitles(titles, destinoMeta.label)
  }

  for (const part of parseDestinationParts(destino)) {
    appendExtraWikiTitles(titles, part)
    if (part.length > 2) titles.push(part)
  }

  titles.push(...buildGeoWikiTitles(destino, destinoMeta))

  return [...new Set(titles.filter(Boolean))]
}

export function collectWikipediaTitles(destino, destinoMeta) {
  return collectPlaceWikipediaTitles(destino, destinoMeta)
}

export function getTripCurrencyImage(moeda) {
  return getCountryFlagUrl(CURRENCY_COUNTRY_CODE[String(moeda ?? '').toUpperCase()])
}

/** Imagem salva na API; null enquanto o card resolve assincronamente. */
export function getTripDestinationImage(destino, moeda, destinoMeta) {
  const url = destinoMeta?.coverImageUrl
  return url ? repairWikiThumbUrl(url) : null
}

export function getTripDestinationImageFallback() {
  return TRIP_FALLBACK_IMAGE
}

/**
 * Viagens antigas sem coverImageUrl: Wikipedia → Commons → bandeira.
 * Novas viagens já vêm com coverImageUrl da API.
 */
export async function resolveTripDestinationImage(destino, moeda, destinoMeta) {
  if (destinoMeta?.coverImageUrl) return repairWikiThumbUrl(destinoMeta.coverImageUrl)

  const placeTitles = collectPlaceWikipediaTitles(destino, destinoMeta)
  if (placeTitles.length) {
    const wikiImage = await fetchPlaceThumbnails(placeTitles)
    if (wikiImage) return wikiImage
  }

  const commonsImage = await fetchCommonsPlaceImages(buildCommonsSearchQueries(destino, destinoMeta))
  if (commonsImage) return commonsImage

  return TRIP_FALLBACK_IMAGE
}
