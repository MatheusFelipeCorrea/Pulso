const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'
const COMMONS_CACHE = new Map()
const COMMONS_STORAGE_KEY = 'pulso:trip-commons-images:v3'

const REJECT_COMMONS_FILE =
  /(flag|bandeira|logo|escudo|coat of arms|mapa|icon|seal|emblem|svg|diagram|locator|location map|heraldic|arms of)/i

const PREFER_COMMONS_FILE =
  /(skyline|panoram|aerial|vista|beach|praia|cathedral|catedral|bridge|ponte|tower|torre|historic|centro|cityscape|landscape|waterfront|orla|costa|montanha|harbor|porto|bay|baía)/i

function isRejectedThumbnailUrl(url) {
  if (!url) return true
  return /(Flag_of|flag_of|Bandeira_de|bandeira_de|Coat_of_arms|coat_of_arms|Escudo_de|Logotipo|\/flags\/)/i.test(url)
}

let storageLoaded = false

function loadStorageCache() {
  if (storageLoaded || typeof sessionStorage === 'undefined') return
  storageLoaded = true

  try {
    const raw = sessionStorage.getItem(COMMONS_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    Object.entries(parsed).forEach(([key, value]) => {
      COMMONS_CACHE.set(key, value)
    })
  } catch {
    // ignore
  }
}

function persistCacheEntry(key, value) {
  if (typeof sessionStorage === 'undefined') return

  try {
    const raw = sessionStorage.getItem(COMMONS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    parsed[key] = value
    sessionStorage.setItem(COMMONS_STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // ignore
  }
}

function normalizeCacheKey(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function buildCommonsSearchQueries(destino, destinoMeta) {
  const queries = []

  if (destinoMeta?.label) {
    const parts = [destinoMeta.label, destinoMeta.region, destinoMeta.countryName].filter(Boolean)
    queries.push(parts.join(' '))
    queries.push(`${destinoMeta.label} ${destinoMeta.countryName ?? ''}`.trim())
    if (destinoMeta.region) {
      queries.push(`${destinoMeta.label} ${destinoMeta.region} city`)
    }
  }

  if (destino) {
    queries.push(String(destino).replace(/,/g, ' '))
  }

  return [...new Set(queries.filter(Boolean))]
}

export function buildGeoWikiTitles(destino, destinoMeta) {
  const titles = []

  if (destinoMeta?.label) {
    const { label, region, countryName } = destinoMeta
    if (region) {
      titles.push(`${label}, ${region}`)
      titles.push(`${label} (${region})`)
      if (countryName) titles.push(`${label}, ${region}, ${countryName}`)
    }
    if (countryName) titles.push(`${label}, ${countryName}`)
  }

  return [...new Set(titles.filter(Boolean))]
}

async function searchCommonsPlaceImage(query) {
  const cacheKey = normalizeCacheKey(query)
  if (!cacheKey) return null

  loadStorageCache()
  if (COMMONS_CACHE.has(cacheKey)) {
    return COMMONS_CACHE.get(cacheKey)
  }

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|thumburl',
    iiurlwidth: '330',
    format: 'json',
    origin: '*',
  })

  try {
    const response = await fetch(`${COMMONS_API}?${params}`)
    if (!response.ok) return null

    const data = await response.json()
    const pages = data?.query?.pages
    if (!pages) return null

    const candidates = Object.values(pages)
      .map((page) => ({
        title: page.title ?? '',
        url: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url,
      }))
      .filter((item) => item.url && !REJECT_COMMONS_FILE.test(item.title) && !isRejectedThumbnailUrl(item.url))

    const preferred = candidates.find((item) => PREFER_COMMONS_FILE.test(item.title))
    const result = preferred?.url ?? candidates[0]?.url ?? null

    COMMONS_CACHE.set(cacheKey, result)
    persistCacheEntry(cacheKey, result)
    return result
  } catch {
    return null
  }
}

export async function fetchCommonsPlaceImages(queries) {
  for (const query of [...new Set(queries.filter(Boolean))]) {
    const image = await searchCommonsPlaceImage(query)
    if (image) return image
  }
  return null
}
