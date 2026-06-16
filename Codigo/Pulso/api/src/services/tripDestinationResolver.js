const { getCountryMeta } = require('../constants/tripDestinationMeta');
const { findNearestAirportHub, getHubByIata } = require('../constants/tripAirportHubs');
const {
    getCatalogEntry,
    buildDestinoMetaFromCatalog,
    toPublicCatalogEntry,
} = require('../constants/tripDestinationsCatalog');

function formatRegionName(region, countryCode) {
    const value = String(region ?? '').trim();
    if (!value) return '';

    if (countryCode === 'BR' && value.toLowerCase() === 'brazil') {
        return '';
    }

    return value;
}

function shouldIncludeRegion(city, region, country) {
    const normalizedCity = String(city ?? '').trim().toLowerCase();
    const normalizedRegion = String(region ?? '').trim().toLowerCase();
    const normalizedCountry = String(country ?? '').trim().toLowerCase();

    if (!normalizedRegion) return false;
    if (normalizedRegion === normalizedCity) return false;
    if (normalizedRegion === normalizedCountry) return false;

    return true;
}

function formatDestinoLabel({ name, region, countryCode, countryName }) {
    const city = String(name ?? '').trim();
    const country = getCountryMeta(countryCode).countryName || countryName || countryCode;
    const state = formatRegionName(region, countryCode);

    if (countryCode === 'BR') {
        if (!shouldIncludeRegion(city, state, country)) {
            return `${city}, Brasil`;
        }
        return `${city}, ${state}, Brasil`;
    }

    if (shouldIncludeRegion(city, state, country)) {
        return `${city}, ${state}, ${country}`;
    }

    return `${city}, ${country}`;
}

function formatDestinationSubtitle({ label, region, countryName }) {
    const state = formatRegionName(region);
    if (shouldIncludeRegion(label, state, countryName)) {
        return `${state}, ${countryName}`;
    }
    return countryName;
}

function resolveFromGeoNamesPlace(place) {
    if (!place?.name) return null;

    const countryCode = String(place.countryCode ?? '').toUpperCase();
    const countryMeta = getCountryMeta(countryCode);
    const countryName = countryMeta.countryName;
    const moedaSugerida = countryMeta.moedaSugerida;
    const domestic = countryCode === 'BR';
    const region = formatRegionName(place.adminName1, countryCode);

    const hub =
        place.lat != null && place.lng != null
            ? findNearestAirportHub({ lat: place.lat, lng: place.lng, countryCode })
            : null;

    const iata = hub?.iata ?? (domestic ? 'GRU' : 'MIA');
    const label = place.name;
    const destino = formatDestinoLabel({
        name: label,
        region,
        countryCode,
        countryName,
    });

    const geonameId = place.geonameId ? Number(place.geonameId) : null;
    const id = geonameId ? `GN-${geonameId}` : place.catalogId;

    const destinoMeta = {
        source: place.source ?? (geonameId ? 'geonames' : 'catalog'),
        geonameId,
        catalogId: id,
        iata,
        hubIata: iata,
        label,
        region: region || null,
        countryCode,
        countryName,
        moedaSugerida,
        domestic,
        lat: Number.isFinite(place.lat) ? place.lat : null,
        lng: Number.isFinite(place.lng) ? place.lng : null,
        hubDistanceKm: hub?.distanceKm ?? null,
    };

    return {
        id,
        label,
        subtitle: formatDestinationSubtitle({ label, region, countryName }),
        destino,
        iata,
        countryCode,
        countryName,
        moedaSugerida,
        domestic,
        geonameId,
        source: destinoMeta.source,
        destinoMeta,
    };
}

function resolveFromCatalogId(catalogId) {
    const entry = getCatalogEntry(catalogId);
    if (!entry) return null;

    return {
        ...toPublicCatalogEntry(entry),
        geonameId: null,
        source: 'catalog',
        destinoMeta: buildDestinoMetaFromCatalog(catalogId),
    };
}

function buildAirportEntryFromResolved(resolved) {
    if (!resolved?.destinoMeta) return null;

    const meta = resolved.destinoMeta;
    const hub = getHubByIata(meta.iata);

    return {
        keywords: [String(meta.label ?? '').toLowerCase()],
        iata: meta.iata,
        label: meta.label,
        fallbackBrl: hub?.fallbackBrl ?? (meta.domestic ? 550 : 4500),
        domestic: Boolean(meta.domestic),
        catalogId: meta.catalogId,
        geonameId: meta.geonameId,
    };
}

module.exports = {
    formatDestinoLabel,
    formatDestinationSubtitle,
    shouldIncludeRegion,
    resolveFromGeoNamesPlace,
    resolveFromCatalogId,
    buildAirportEntryFromResolved,
};
