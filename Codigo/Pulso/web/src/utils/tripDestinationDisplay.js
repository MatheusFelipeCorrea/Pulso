function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function parseDestinoFallback(destino) {
  const parts = String(destino ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return { city: '', country: '' }
  if (parts.length === 1) return { city: parts[0], country: '' }

  return {
    city: parts[0],
    country: parts[parts.length - 1],
  }
}

/** Cidade e país para exibição (ignora estado/região intermediária). */
export function getTripDestinationParts(destino, destinoMeta) {
  if (destinoMeta?.label) {
    return {
      city: String(destinoMeta.label).trim(),
      country: String(destinoMeta.countryName ?? '').trim(),
    }
  }

  return parseDestinoFallback(destino)
}

/** Nome curto para cards, títulos e confirmações: "Macaé, Brasil". */
export function formatTripDestinationDisplay(destino, destinoMeta) {
  const { city, country } = getTripDestinationParts(destino, destinoMeta)
  if (city && country) return `${city}, ${country}`
  return city || String(destino ?? '').trim()
}
