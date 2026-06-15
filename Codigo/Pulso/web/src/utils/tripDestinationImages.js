import { TRIP_COUNTRY_ENTRIES } from './tripCountryImages.js'
import { fetchWikipediaThumbnails } from './tripWikipediaImage.js'

const IMAGE_SIZE = 'w=320&h=420&fit=crop&q=80'

const DEFAULT_TRAVEL_IMAGE =
  `https://images.unsplash.com/photo-1488646953014-85cb44e25828?${IMAGE_SIZE}`

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?${IMAGE_SIZE}`

const CITY_ENTRIES = [
  { keywords: ['tokyo', 'toquio', 'osaka', 'kyoto'], url: unsplash('1542051841857-5f90071e7989') },
  { keywords: ['buenos aires', 'buenos-aires', 'patagonia', 'mendoza'], url: unsplash('1559827260-dc66d52bef19') },
  { keywords: ['paris'], url: unsplash('1502602898657-3e91760cbb34') },
  { keywords: ['orlando', 'disney'], url: unsplash('1566073771259-6a8506099945') },
  { keywords: ['londres', 'london'], url: unsplash('1513635269975-59663e0ac1ad') },
  { keywords: ['nova york', 'new york', 'manhattan'], url: unsplash('1496442226666-8d4d0e62e6e9') },
  {
    keywords: [
      'rio de janeiro',
      'rio',
      'são paulo',
      'sao paulo',
      'macaé',
      'macae',
      'salvador',
      'fortaleza',
      'recife',
      'florianópolis',
      'florianopolis',
      'belo horizonte',
      'brasília',
      'brasilia',
      'curitiba',
      'manaus',
      'natal',
      'joão pessoa',
      'joao pessoa',
    ],
    url: unsplash('1483729558449-99ef09a8c325'),
  },
  { keywords: ['roma', 'rome'], url: unsplash('1552832230-c0197dd311b5') },
  { keywords: ['barcelona', 'madri', 'madrid'], url: unsplash('1583422409516-2895a77efded') },
  { keywords: ['lisboa'], url: unsplash('1555881400-74d7acaacd8b') },
  { keywords: ['cancun', 'cancún'], url: unsplash('1510094456374-77f4762b3c24') },
  { keywords: ['sydney', 'sidney'], url: unsplash('1506973035872-a19ec8bdb8df') },
  { keywords: ['toronto', 'vancouver'], url: unsplash('1519831353900-9a5817d4d633') },
  { keywords: ['dubai'], url: unsplash('1512453979798-5ea266f8880c') },
  { keywords: ['bangkok'], url: unsplash('1552465011-b4e21bf8e59a') },
  { keywords: ['pequim', 'beijing', 'shanghai'], url: unsplash('1508804185872-d7badad00f7d') },
  { keywords: ['machu', 'cusco', 'lima'], url: unsplash('1526392060635-9d65b163cf6e') },
  { keywords: ['santiago'], url: unsplash('1584489674699-c47f3310a485') },
  { keywords: ['berlim', 'berlin', 'munique', 'munich'], url: unsplash('1560969184-10fe8719e047') },
  { keywords: ['amsterdã', 'amsterda', 'amsterdam', 'rotterdam'], url: unsplash('1534351590666-13e3e96b5017') },
  { keywords: ['zurich', 'genebra', 'geneva', 'bern'], url: unsplash('1530122034175-a5e1e288bebb') },
  { keywords: ['cairo'], url: unsplash('1572252009280-0fe5366e28ab') },
  { keywords: ['marrakech', 'casablanca'], url: unsplash('1517824801-321778ff817e') },
  { keywords: ['cidade do cabo', 'cape town', 'johannesburg'], url: unsplash('1580060839134-75a3bda8e6e6') },
  { keywords: ['seul', 'seoul', 'busan'], url: unsplash('1517154429-39d7bd6ede51') },
  { keywords: ['istambul', 'istanbul', 'ankara'], url: unsplash('1524231757912-21f4fe3a7200') },
  { keywords: ['praga', 'prague'], url: unsplash('1541849543465-caf2a05f953b') },
  { keywords: ['atenas', 'athens', 'santorini'], url: unsplash('1555993539-1732b0258235') },
  { keywords: ['bogotá', 'bogota', 'medellin', 'cartagena'], url: unsplash('1568630860962-9d0f9f4b56c0') },
  { keywords: ['montevideo', 'punta del este'], url: unsplash('1571019614246-ac5c128766b0') },
  { keywords: ['asunción', 'asuncion'], url: unsplash('1542405996687-a8d9075e2b3b') },
  { keywords: ['mumbai', 'delhi', 'goa'], url: unsplash('1524492413737-28c90b9e9a1d') },
  { keywords: ['bali', 'jakarta'], url: unsplash('1537996194471-e657df775b90') },
  { keywords: ['hanoi', 'ho chi minh'], url: unsplash('1559592413-7cec4d0a5d2b') },
  { keywords: ['moscou', 'moscow', 'sao petersburgo', 'saint petersburg'], url: unsplash('1513326738677-b964603b136d') },
  { keywords: ['wellington', 'auckland', 'queenstown'], url: unsplash('1507699625316-4e0e8d4d8f1f') },
  { keywords: ['reykjavik'], url: unsplash('1529963182637-1a4ae0b4a47c') },
  { keywords: ['dublin'], url: unsplash('1549893074-28de3948b0bb') },
  { keywords: ['viena', 'vienna'], url: unsplash('1516550893923-42e8bda32f0f') },
  { keywords: ['budapeste', 'budapest'], url: unsplash('1541343677864-21606b1e6ffb') },
  { keywords: ['cracovia', 'krakow'], url: unsplash('1550159930-eb6679faf53f') },
  { keywords: ['havana', 'havana'], url: unsplash('1518173941575-04136d6ab01a') },
  { keywords: ['nairobi'], url: unsplash('1523805007896-d9fe131b25a1') },
  { keywords: ['doha'], url: unsplash('1565008576549-57569a49371d') },
  { keywords: ['tel aviv'], url: unsplash('1542813509-29b4b74ad53d') },
  { keywords: ['hong kong'], url: unsplash('1536590158207-e557b945d703') },
  { keywords: ['taipei'], url: unsplash('1476611336951-b130745ff6aa') },
]

const CURRENCY_DEFAULT_IMAGES = {
  AED: unsplash('1512453979798-5ea266f8880c'),
  ARS: unsplash('1559827260-dc66d52bef19'),
  AUD: unsplash('1506973035872-a19ec8bdb8df'),
  BOB: unsplash('1526392060635-9d65b163cf6e'),
  BRL: unsplash('1483729558449-99ef09a8c325'),
  CAD: unsplash('1519831353900-9a5817d4d633'),
  CHF: unsplash('1530122034175-a5e1e288bebb'),
  CLP: unsplash('1584489674699-c47f3310a485'),
  CNY: unsplash('1508804185872-d7badad00f7d'),
  COP: unsplash('1568630860962-9d0f9f4b56c0'),
  CZK: unsplash('1541849543465-caf2a05f953b'),
  DKK: unsplash('1513622473948-489b6c8e8f0e'),
  EGP: unsplash('1572252009280-0fe5366e28ab'),
  EUR: unsplash('1502602898657-3e91760cbb34'),
  GBP: unsplash('1513635269975-59663e0ac1ad'),
  HKD: unsplash('1536590158207-e557b945d703'),
  HUF: unsplash('1541343677864-21606b1e6ffb'),
  IDR: unsplash('1537996194471-e657df775b90'),
  ILS: unsplash('1542813509-29b4b74ad53d'),
  INR: unsplash('1524492413737-28c90b9e9a1d'),
  JPY: unsplash('1542051841857-5f90071e7989'),
  KRW: unsplash('1517154429-39d7bd6ede51'),
  MAD: unsplash('1517824801-321778ff817e'),
  MXN: unsplash('1510094456374-77f4762b3c24'),
  MYR: unsplash('1552465011-b4e21bf8e59a'),
  NOK: unsplash('1513622473948-489b6c8e8f0e'),
  NZD: unsplash('1507699625316-4e0e8d4d8f1f'),
  PEN: unsplash('1526392060635-9d65b163cf6e'),
  PHP: unsplash('1518548419970-58e3b4079ab7'),
  PLN: unsplash('1550159930-eb6679faf53f'),
  PYG: unsplash('1542405996687-a8d9075e2b3b'),
  RUB: unsplash('1513326738677-b964603b136d'),
  SEK: unsplash('1513622473948-489b6c8e8f0e'),
  SGD: unsplash('1525626924213-d8914c2e1a52'),
  THB: unsplash('1552465011-b4e21bf8e59a'),
  TRY: unsplash('1524231757912-21f4fe3a7200'),
  TWD: unsplash('1476611336951-b130745ff6aa'),
  USD: unsplash('1496442226666-8d4d0e62e6e9'),
  UYU: unsplash('1571019614246-ac5c128766b0'),
  VND: unsplash('1559592413-7cec4d0a5d2b'),
  ZAR: unsplash('1580060839134-75a3bda8e6e6'),
}

export const TRIP_FALLBACK_IMAGE = DEFAULT_TRAVEL_IMAGE

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

function keywordMatches(normalizedDestino, keyword, { exact = false } = {}) {
  const normalizedKeyword = normalizeDestinationText(keyword)
  if (!normalizedKeyword) return false

  if (exact) return normalizedDestino === normalizedKeyword

  if (normalizedKeyword.length <= 2) {
    const pattern = new RegExp(`(^|[\\s,])${normalizedKeyword}($|[\\s,])`)
    return pattern.test(normalizedDestino)
  }

  return normalizedDestino.includes(normalizedKeyword)
}

function findKeywordEntry(entries, normalizedDestino, { exact = false } = {}) {
  return entries.find((entry) =>
    entry.keywords.some((keyword) => keywordMatches(normalizedDestino, keyword, { exact }))
  )
}

function findCityImage(normalizedDestino) {
  const exact = findKeywordEntry(CITY_ENTRIES, normalizedDestino, { exact: true })
  if (exact) return exact.url

  const partial = findKeywordEntry(CITY_ENTRIES, normalizedDestino)
  return partial?.url ?? null
}

function findCountryMatch(normalizedDestino) {
  const exact = findKeywordEntry(TRIP_COUNTRY_ENTRIES, normalizedDestino, { exact: true })
  if (exact) return exact

  return findKeywordEntry(TRIP_COUNTRY_ENTRIES, normalizedDestino) ?? null
}

function findCountryImage(normalizedDestino) {
  return findCountryMatch(normalizedDestino)?.image ?? null
}

export function getTripCurrencyImage(moeda) {
  const code = String(moeda ?? '').toUpperCase()
  return CURRENCY_DEFAULT_IMAGES[code] ?? null
}

export function collectWikipediaTitles(destino) {
  const parts = parseDestinationParts(destino)
  const titles = []

  parts.forEach((part) => {
    const normalizedPart = normalizeDestinationText(part)
    const countryMatch = findCountryMatch(normalizedPart)
    if (countryMatch?.wikiTitles) {
      titles.push(...countryMatch.wikiTitles)
    }
    titles.push(part)
  })

  return [...new Set(titles.filter(Boolean))]
}

export function getTripDestinationImage(destino, moeda) {
  const normalizedDestino = normalizeDestinationText(destino)
  const code = String(moeda ?? '').toUpperCase()

  if (normalizedDestino) {
    const cityImage = findCityImage(normalizedDestino)
    if (cityImage) return cityImage

    const countryImage = findCountryImage(normalizedDestino)
    if (countryImage) return countryImage
  }

  if (CURRENCY_DEFAULT_IMAGES[code]) return CURRENCY_DEFAULT_IMAGES[code]

  return DEFAULT_TRAVEL_IMAGE
}

export function getTripDestinationImageFallback(destino, moeda) {
  const currencyImage = getTripCurrencyImage(moeda)
  if (currencyImage) return currencyImage

  return TRIP_FALLBACK_IMAGE
}

export async function resolveTripDestinationImage(destino, moeda) {
  const normalizedDestino = normalizeDestinationText(destino)

  if (normalizedDestino) {
    const cityImage = findCityImage(normalizedDestino)
    if (cityImage) return cityImage
  }

  const wikiImage = await fetchWikipediaThumbnails(collectWikipediaTitles(destino))
  if (wikiImage) return wikiImage

  return getTripDestinationImage(destino, moeda)
}
