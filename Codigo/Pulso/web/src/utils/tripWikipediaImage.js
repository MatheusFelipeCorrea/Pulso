const WIKI_CACHE = new Map()
const WIKI_LANGS = ['pt', 'en']
const WIKI_STORAGE_KEY = 'pulso:trip-wiki-images:v4'

/** Rejeita clubes, artistas e páginas que não são lugar. */
const REJECTED_PLACE_TEXT =
  /(clube de futebol|football club|soccer club|esporte clube|time de futebol|álbum |banda |série de |filme |personagem |jogador de |cantor |cantora )/i

let storageLoaded = false

function loadStorageCache() {
  if (storageLoaded || typeof sessionStorage === 'undefined') return
  storageLoaded = true

  try {
    const raw = sessionStorage.getItem(WIKI_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    Object.entries(parsed).forEach(([key, value]) => {
      WIKI_CACHE.set(key, value)
    })
  } catch {
    // ignore corrupted cache
  }
}

function persistCacheEntry(key, value) {
  if (typeof sessionStorage === 'undefined') return

  try {
    const raw = sessionStorage.getItem(WIKI_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[key] = value
    sessionStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // ignore quota errors
  }
}

function normalizeCacheKey(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function resizeWikiThumbnail(url, maxWidth) {
  if (!url) return null
  const match = url.match(/\/(\d+)px-/)
  if (!match || !maxWidth) return url

  const current = Number(match[1])
  if (maxWidth >= current) return url

  return url.replace(/\/(\d+)px-/, `/${maxWidth}px-`)
}

export function repairWikiThumbUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (!/\/420px-/.test(url)) return url
  return url.replace(/\/420px-/, '/330px-')
}

export function isPlaceWikiSummary(data) {
  if (!data || data.type === 'disambiguation') return false
  if (!data.thumbnail?.source) return false
  if (/(Flag_of|flag_of|Bandeira_de|bandeira_de|Coat_of_arms|\/flags\/)/i.test(data.thumbnail.source)) return false

  const text = `${data.title ?? ''} ${data.description ?? ''}`
  if (REJECTED_PLACE_TEXT.test(text)) return false

  return true
}

async function fetchWikiSummary(lang, title) {
  const encodedTitle = encodeURIComponent(String(title).trim())
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'PulsoApp/1.0 (viagens@pulso.local)',
    },
  })

  if (!response.ok) return null

  const data = await response.json()
  if (!isPlaceWikiSummary(data)) return null

  return data.thumbnail.source
}

export async function fetchPlaceThumbnail(title) {
  const cacheKey = normalizeCacheKey(title)
  if (!cacheKey) return null

  loadStorageCache()

  if (WIKI_CACHE.has(cacheKey)) {
    return WIKI_CACHE.get(cacheKey)
  }

  for (const lang of WIKI_LANGS) {
    try {
      const thumbnail = await fetchWikiSummary(lang, title)
      if (thumbnail) {
        WIKI_CACHE.set(cacheKey, thumbnail)
        persistCacheEntry(cacheKey, thumbnail)
        return thumbnail
      }
    } catch {
      // try next language
    }
  }

  WIKI_CACHE.set(cacheKey, null)
  persistCacheEntry(cacheKey, null)
  return null
}

export async function fetchPlaceThumbnails(titles) {
  const uniqueTitles = [...new Set(titles.filter(Boolean))]
  for (const title of uniqueTitles) {
    const thumbnail = await fetchPlaceThumbnail(title)
    if (thumbnail) return thumbnail
  }
  return null
}

/** @deprecated use fetchPlaceThumbnail */
export const fetchWikipediaThumbnail = fetchPlaceThumbnail

/** @deprecated use fetchPlaceThumbnails */
export const fetchWikipediaThumbnails = fetchPlaceThumbnails
