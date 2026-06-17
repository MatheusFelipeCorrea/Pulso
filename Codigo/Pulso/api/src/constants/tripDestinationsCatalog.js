const BRAZIL_RAW = require('../data/tripDestinations.brazil');
const INTERNATIONAL_RAW = require('../data/tripDestinations.international');
const { getHubFallbackBrl, getCountryMeta } = require('./tripDestinationMeta');

function slugify(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatBrazilDestino(label) {
    return `${label}, Brasil`;
}

function buildSearchText(entry) {
    return normalizeText(
        [
            entry.label,
            entry.subtitle,
            entry.destino,
            entry.countryName,
            entry.iata,
            ...(entry.keywords ?? []),
        ].join(' ')
    );
}

function buildBrazilCatalogEntry(raw) {
    const destino = formatBrazilDestino(raw.label);
    const fallbackBrl = raw.fallbackBrl ?? getHubFallbackBrl(raw.iata);

    const entry = {
        id: `BR-${raw.iata}-${slugify(raw.label)}`,
        label: raw.label,
        subtitle: raw.region ? `${raw.region}, Brasil` : 'Brasil',
        destino,
        iata: raw.iata,
        hubIata: raw.iata,
        countryCode: 'BR',
        countryName: 'Brasil',
        moedaSugerida: 'BRL',
        domestic: true,
        fallbackBrl,
        keywords: [...new Set([raw.label, raw.region, 'Brasil', ...(raw.keywords ?? [])])].filter(Boolean),
        tier: raw.tier ?? 'city',
    };

    entry.searchText = buildSearchText(entry);
    return entry;
}

function buildInternationalCatalogEntry(raw) {
    const country = getCountryMeta(raw.countryCode);
    const fallbackBrl = raw.fallbackBrl ?? getHubFallbackBrl(raw.iata, { international: true });

    const entry = {
        id: `INTL-${raw.countryCode}-${slugify(raw.label)}`,
        label: raw.label,
        subtitle: country.countryName,
        destino: `${raw.label}, ${country.countryName}`,
        iata: raw.iata,
        hubIata: raw.iata,
        countryCode: raw.countryCode,
        countryName: country.countryName,
        moedaSugerida: country.moedaSugerida,
        domestic: false,
        fallbackBrl,
        keywords: [...new Set([raw.label, country.countryName, ...(raw.keywords ?? [])])].filter(Boolean),
        tier: raw.tier ?? 'city',
    };

    entry.searchText = buildSearchText(entry);
    return entry;
}

const TRIP_DESTINATIONS_CATALOG = [
    ...BRAZIL_RAW.map(buildBrazilCatalogEntry),
    ...INTERNATIONAL_RAW.map(buildInternationalCatalogEntry),
];

const CATALOG_BY_ID = new Map(TRIP_DESTINATIONS_CATALOG.map((entry) => [entry.id, entry]));

function toPublicCatalogEntry(entry) {
    return {
        id: entry.id,
        label: entry.label,
        subtitle: entry.subtitle,
        destino: entry.destino,
        iata: entry.iata,
        countryCode: entry.countryCode,
        countryName: entry.countryName,
        moedaSugerida: entry.moedaSugerida,
        domestic: entry.domestic,
    };
}

function listTripDestinations({ limit } = {}) {
    const items = TRIP_DESTINATIONS_CATALOG.map(toPublicCatalogEntry);
    if (limit != null) return items.slice(0, limit);
    return items;
}

function countTripDestinations() {
    return TRIP_DESTINATIONS_CATALOG.length;
}

function scoreDestination(entry, tokens) {
    let score = 0;

    for (const token of tokens) {
        if (!token) continue;

        const normalizedLabel = normalizeText(entry.label);
        const normalizedDestino = normalizeText(entry.destino);

        if (normalizedLabel === token) score += 120;
        if (normalizedLabel.startsWith(token)) score += 80;
        if (normalizedDestino.includes(token)) score += 40;
        if (entry.searchText.includes(token)) score += 20;

        for (const keyword of entry.keywords ?? []) {
            const normalizedKeyword = normalizeText(keyword);
            if (normalizedKeyword === token) score += 60;
            if (normalizedKeyword.startsWith(token)) score += 35;
        }
    }

    return score;
}

function searchTripDestinations(query, { limit = 20 } = {}) {
    const normalized = normalizeText(query);
    if (!normalized) {
        return listTripDestinations({ limit });
    }

    const tokens = normalized.split(/\s+/).filter(Boolean);

    return TRIP_DESTINATIONS_CATALOG
        .map((entry) => ({ entry, score: scoreDestination(entry, tokens) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label, 'pt-BR'))
        .slice(0, limit)
        .map(({ entry }) => toPublicCatalogEntry(entry));
}

function getCatalogEntry(catalogId) {
    if (!catalogId) return null;
    return CATALOG_BY_ID.get(String(catalogId)) ?? null;
}

function buildDestinoMetaFromCatalog(catalogId) {
    const entry = getCatalogEntry(catalogId);
    if (!entry) return null;

    return {
        source: 'catalog',
        catalogId: entry.id,
        geonameId: null,
        iata: entry.iata,
        label: entry.label,
        region: entry.subtitle?.split(',')[0]?.trim() || null,
        countryCode: entry.countryCode,
        countryName: entry.countryName,
        moedaSugerida: entry.moedaSugerida,
        domestic: entry.domestic,
    };
}

function buildAirportEntryFromCatalog(entry) {
    return {
        keywords: [...new Set([entry.label, ...(entry.keywords ?? [])])].map((value) => normalizeText(value)),
        iata: entry.iata,
        label: entry.label,
        fallbackBrl: entry.fallbackBrl,
        domestic: entry.domestic,
        catalogId: entry.id,
    };
}

function buildDestinationAirports() {
    return TRIP_DESTINATIONS_CATALOG.map(buildAirportEntryFromCatalog);
}

function getAirportEntryForMeta(destinoMeta) {
    if (!destinoMeta) return null;

    if (destinoMeta.geonameId || (destinoMeta.iata && destinoMeta.label && !getCatalogEntry(destinoMeta.catalogId))) {
        const domestic = Boolean(destinoMeta.domestic);
        return {
            keywords: [normalizeText(destinoMeta.label)],
            iata: destinoMeta.iata,
            label: destinoMeta.label,
            fallbackBrl: getHubFallbackBrl(destinoMeta.iata, { international: !domestic }),
            domestic,
            catalogId: destinoMeta.catalogId,
            geonameId: destinoMeta.geonameId,
        };
    }

    if (destinoMeta.catalogId) {
        const catalog = getCatalogEntry(destinoMeta.catalogId);
        if (catalog) return buildAirportEntryFromCatalog(catalog);
    }

    if (destinoMeta.iata && destinoMeta.label) {
        const catalog = TRIP_DESTINATIONS_CATALOG.find(
            (entry) => entry.iata === destinoMeta.iata && entry.label === destinoMeta.label
        );
        if (catalog) return buildAirportEntryFromCatalog(catalog);
    }

    return null;
}

/** Compatibilidade com módulos legados */
function buildTripBrazilDestinations() {
    return TRIP_DESTINATIONS_CATALOG.filter((entry) => entry.domestic).map((entry) => ({
        keywords: entry.keywords.map((keyword) => normalizeText(keyword)),
        iata: entry.iata,
        label: entry.label,
        fallbackBrl: entry.fallbackBrl,
        domestic: true,
    }));
}

module.exports = {
    TRIP_DESTINATIONS_CATALOG,
    listTripDestinations,
    countTripDestinations,
    searchTripDestinations,
    getCatalogEntry,
    buildDestinoMetaFromCatalog,
    buildDestinationAirports,
    getAirportEntryForMeta,
    buildTripBrazilDestinations,
    normalizeText,
    toPublicCatalogEntry,
};
