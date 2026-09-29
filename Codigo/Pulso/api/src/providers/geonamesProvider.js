const axios = require('axios');
const { searchTripDestinations } = require('../constants/tripDestinationsCatalog');

const GEONAMES_BASE_URL = process.env.GEONAMES_BASE_URL ?? 'http://api.geonames.org';
const CACHE_TTL_MS = 15 * 60 * 1000;
const searchCache = new Map();
const placeCache = new Map();

const hasCredentials = () => Boolean(process.env.GEONAMES_USERNAME);

function cacheGet(store, key) {
    const hit = store.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expiresAt) {
        store.delete(key);
        return null;
    }
    return hit.value;
}

function cacheSet(store, key, value) {
    store.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

function normalizePlace(raw) {
    if (!raw?.geonameId) return null;

    return {
        geonameId: Number(raw.geonameId),
        name: String(raw.name ?? raw.toponymName ?? '').trim(),
        countryCode: String(raw.countryCode ?? '').toUpperCase(),
        countryName: String(raw.countryName ?? '').trim(),
        adminName1: String(raw.adminName1 ?? raw.adminName2 ?? '').trim(),
        lat: Number(raw.lat),
        lng: Number(raw.lng),
        population: Number(raw.population ?? 0),
        fclName: String(raw.fclName ?? '').trim(),
    };
}

function mapCatalogToPlace(entry) {
    return {
        geonameId: null,
        catalogId: entry.id,
        name: entry.label,
        countryCode: entry.countryCode,
        countryName: entry.countryName,
        adminName1: entry.subtitle?.split(',')[0]?.trim() ?? '',
        lat: null,
        lng: null,
        population: 0,
        fclName: 'catalog',
        source: 'catalog',
    };
}

function searchCatalogFallback(term, limit) {
    return searchTripDestinations(term, { limit }).map(mapCatalogToPlace);
}

async function searchPlaces(query, { limit = 20, countryCode } = {}) {
    const term = String(query ?? '').trim();

    if (!term) {
        return searchCatalogFallback('', limit);
    }

    if (!hasCredentials()) {
        return searchCatalogFallback(term, limit);
    }

    const cacheKey = `${term.toLowerCase()}|${limit}|${countryCode ?? ''}`;
    const cached = cacheGet(searchCache, cacheKey);
    if (cached) return cached;

    try {
        const params = {
            q: term,
            maxRows: Math.min(Math.max(limit, 1), 50),
            username: process.env.GEONAMES_USERNAME,
            lang: 'pt',
            style: 'FULL',
            featureClass: 'P',
            orderby: 'relevance',
        };

        if (countryCode) {
            params.country = String(countryCode).toUpperCase();
        }

        const { data } = await axios.get(`${GEONAMES_BASE_URL}/searchJSON`, {
            params,
            timeout: 8000,
        });

        const places = (data?.geonames ?? [])
            .map(normalizePlace)
            .filter(Boolean)
            .map((place) => ({ ...place, source: 'geonames' }));

        if (places.length > 0) {
            cacheSet(searchCache, cacheKey, places);
            return places;
        }
    } catch {
        // fallback silencioso para catálogo interno
    }

    return searchCatalogFallback(term, limit);
}

async function getPlace(geonameId) {
    const id = Number(geonameId);
    if (!Number.isFinite(id) || id <= 0) return null;

    if (!hasCredentials()) return null;

    const cacheKey = String(id);
    const cached = cacheGet(placeCache, cacheKey);
    if (cached) return cached;

    try {
        const { data } = await axios.get(`${GEONAMES_BASE_URL}/getJSON`, {
            params: {
                geonameId: id,
                username: process.env.GEONAMES_USERNAME,
                lang: 'pt',
            },
            timeout: 8000,
        });

        const place = normalizePlace(data);
        if (!place) return null;

        const enriched = { ...place, source: 'geonames' };
        cacheSet(placeCache, cacheKey, enriched);
        return enriched;
    } catch {
        return null;
    }
}

module.exports = {
    hasCredentials,
    searchPlaces,
    getPlace,
};
