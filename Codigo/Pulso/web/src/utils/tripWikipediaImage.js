const WIKI_CACHE = new Map()
const WIKI_LANGS = ['pt', 'en']
const WIKI_STORAGE_KEY = 'pulso:trip-wiki-images:v1'

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

function resizeWikiThumbnail(url, width = 320) {
  if (!url) return null
  return url.replace(/\/(\d+)px-/, `/${width}px-`)
}

async function fetchWikiSummary(lang, title) {
  const encodedTitle = encodeURIComponent(String(title).trim())
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) return null

  const data = await response.json()
  return resizeWikiThumbnail(data.thumbnail?.source)
}

export async function fetchWikipediaThumbnail(title) {
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

export async function fetchWikipediaThumbnails(titles) {
  const uniqueTitles = [...new Set(titles.filter(Boolean))]
  for (const title of uniqueTitles) {
    const thumbnail = await fetchWikipediaThumbnail(title)
    if (thumbnail) return thumbnail
  }
  return null
}
