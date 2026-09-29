const axios = require('axios');

const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL ?? 'https://test.api.amadeus.com';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const priceCache = new Map();
let tokenCache = { token: null, expiresAt: 0 };

const hasCredentials = () =>
    Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);

async function getAccessToken() {
    if (!hasCredentials()) return null;

    if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
    }

    const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
    });

    const { data } = await axios.post(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
    });

    tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + Math.max(0, (Number(data.expires_in) - 60) * 1000),
    };

    return tokenCache.token;
}

function averageOfferPrice(offers = []) {
    const prices = offers
        .map((offer) => Number(offer?.price?.grandTotal ?? offer?.price?.total))
        .filter((value) => Number.isFinite(value) && value > 0);

    if (!prices.length) return null;

    const sum = prices.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / prices.length);
}

async function fetchAverageRoundTripPrice({ origin, destination, departureDate, returnDate }) {
    if (!hasCredentials()) return null;

    const cacheKey = `${origin}:${destination}:${departureDate}:${returnDate}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        return cached.value;
    }

    const token = await getAccessToken();
    if (!token) return null;

    const { data } = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate,
            returnDate,
            adults: 1,
            currencyCode: 'BRL',
            max: 5,
            nonStop: false,
        },
        timeout: 12000,
    });

    const average = averageOfferPrice(data?.data ?? []);
    if (average) {
        priceCache.set(cacheKey, { at: Date.now(), value: average });
    }

    return average;
}

module.exports = {
    hasCredentials,
    fetchAverageRoundTripPrice,
};
