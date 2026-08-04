const axios = require('axios');
const awesomeApiProvider = require('./awesomeApiProvider');

const DUFFEL_BASE_URL = process.env.DUFFEL_BASE_URL ?? 'https://api.duffel.com';
const DUFFEL_API_VERSION = process.env.DUFFEL_API_VERSION ?? 'v2';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const priceCache = new Map();

const hasCredentials = () => Boolean(process.env.DUFFEL_ACCESS_TOKEN);

function averageOfferPrice(offers = []) {
    const prices = offers
        .map((offer) => Number(offer?.total_amount))
        .filter((value) => Number.isFinite(value) && value > 0);

    if (!prices.length) return null;

    const sum = prices.reduce((acc, value) => acc + value, 0);
    return {
        average: sum / prices.length,
        currency: offers.find((offer) => offer?.total_currency)?.total_currency ?? 'BRL',
    };
}

async function toBrl(amount, currency) {
    const normalizedCurrency = String(currency ?? 'BRL').toUpperCase();
    if (normalizedCurrency === 'BRL') {
        return Math.round(amount);
    }

    const rate = await awesomeApiProvider.getRateForCode(normalizedCurrency);
    const bid = Number(rate?.bid);
    if (!Number.isFinite(bid) || bid <= 0) {
        return null;
    }

    return Math.round(amount * bid);
}

async function fetchAverageRoundTripPrice({ origin, destination, departureDate, returnDate }) {
    if (!hasCredentials()) return null;

    const cacheKey = `${origin}:${destination}:${departureDate}:${returnDate}`;
    const cached = priceCache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        return cached.value;
    }

    const { data } = await axios.post(
        `${DUFFEL_BASE_URL}/air/offer_requests`,
        {
            data: {
                cabin_class: 'economy',
                slices: [
                    {
                        origin,
                        destination,
                        departure_date: departureDate,
                    },
                    {
                        origin: destination,
                        destination: origin,
                        departure_date: returnDate,
                    },
                ],
                passengers: [{ type: 'adult' }],
            },
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.DUFFEL_ACCESS_TOKEN}`,
                'Duffel-Version': DUFFEL_API_VERSION,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                return_offers: true,
                supplier_timeout: 12000,
            },
            timeout: 15000,
        }
    );

    const offers = (data?.data?.offers ?? []).slice(0, 5);
    const priced = averageOfferPrice(offers);
    if (!priced) return null;

    const averageBrl = await toBrl(priced.average, priced.currency);
    if (!averageBrl) return null;

    priceCache.set(cacheKey, { at: Date.now(), value: averageBrl });
    return averageBrl;
}

module.exports = {
    hasCredentials,
    fetchAverageRoundTripPrice,
};
