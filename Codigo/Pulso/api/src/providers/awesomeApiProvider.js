const axios = require('axios');
const { ensureCatalog, getCurrency } = require('../constants/currencyCatalog');

const AWESOME_BASE_URL = 'https://economia.awesomeapi.com.br/json';
const FRANKFURTER_BASE_URL = 'https://api.frankfurter.app';
const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

const cache = new Map();

const cacheKey = (suffix) => suffix;

const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.at > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }
    return entry.value;
};

const setCached = (key, value) => {
    cache.set(key, { at: Date.now(), value });
};

const parseRateEntry = (entry) => {
    if (!entry) return null;
    const bid = Number(entry.bid);
    const pctChange = Number(entry.pctChange);
    if (!Number.isFinite(bid) || bid <= 0) return null;

    return {
        code: entry.code,
        name: entry.name,
        bid,
        ask: Number(entry.ask) || bid,
        pctChange: Number.isFinite(pctChange) ? pctChange : 0,
        high: Number(entry.high) || bid,
        low: Number(entry.low) || bid,
        updatedAt: entry.create_date ?? new Date().toISOString(),
        timestamp: entry.timestamp ? Number(entry.timestamp) * 1000 : Date.now(),
    };
};

const buildBrlRate = (currency) => ({
    code: 'BRL',
    name: currency?.name ?? 'Real Brasileiro',
    bid: 1,
    ask: 1,
    pctChange: 0,
    high: 1,
    low: 1,
    updatedAt: new Date().toISOString(),
    timestamp: Date.now(),
});

const combineCrossRate = (code, currency, crossRate, hubRate) => {
    const bid = crossRate.bid * hubRate.bid;
    const ask = (crossRate.ask || crossRate.bid) * (hubRate.ask || hubRate.bid);

    return {
        code,
        name: currency?.name ?? crossRate.name ?? code,
        bid,
        ask,
        pctChange: (Number(crossRate.pctChange) || 0) + (Number(hubRate.pctChange) || 0),
        high: bid,
        low: bid,
        updatedAt: hubRate.updatedAt ?? crossRate.updatedAt ?? new Date().toISOString(),
        timestamp: Math.max(crossRate.timestamp ?? 0, hubRate.timestamp ?? 0) || Date.now(),
    };
};

const fetchPairsFromAwesome = async (pairs) => {
    const uniquePairs = [...new Set(pairs.filter(Boolean))];
    if (!uniquePairs.length) return {};

    const key = cacheKey(`awesome:pairs:${uniquePairs.sort().join(',')}`);
    const cached = getCached(key);
    if (cached) return cached;

    const url = `${AWESOME_BASE_URL}/last/${uniquePairs.join(',')}`;
    const { data } = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });
    const parsed = {};

    for (const value of Object.values(data ?? {})) {
        const rate = parseRateEntry(value);
        if (rate?.code) parsed[rate.code] = rate;
    }

    setCached(key, parsed);
    return parsed;
};

const fetchFrankfurterLatest = async (from, to) => {
    const key = cacheKey(`frankfurter:latest:${from}:${to}`);
    const cached = getCached(key);
    if (cached) return cached;

    const { data } = await axios.get(`${FRANKFURTER_BASE_URL}/latest`, {
        params: { from, to },
        timeout: REQUEST_TIMEOUT_MS,
    });

    const bid = Number(data?.rates?.[to]);
    if (!Number.isFinite(bid) || bid <= 0) {
        throw new Error(`Frankfurter sem taxa ${from}/${to}`);
    }

    const rate = {
        code: from,
        name: from,
        bid,
        ask: bid,
        pctChange: 0,
        high: bid,
        low: bid,
        updatedAt: data?.date ? `${data.date}T12:00:00.000Z` : new Date().toISOString(),
        timestamp: Date.now(),
        source: 'frankfurter',
    };

    setCached(key, rate);
    return rate;
};

const fetchPairsFromFrankfurter = async (requests) => {
    const parsed = {};

    await Promise.all(
        requests.map(async (request) => {
            const { code, currency, type } = request;

            try {
                if (type === 'direct') {
                    const rate = await fetchFrankfurterLatest(code, 'BRL');
                    parsed[code] = {
                        ...rate,
                        name: currency?.name ?? code,
                    };
                    return;
                }

                if (type === 'cross' && currency?.quoteVia) {
                    const [crossRate, hubRate] = await Promise.all([
                        fetchFrankfurterLatest(code, currency.quoteVia),
                        fetchFrankfurterLatest(currency.quoteVia, 'BRL'),
                    ]);
                    parsed[code] = combineCrossRate(code, currency, crossRate, hubRate);
                    parsed[currency.quoteVia] = {
                        ...hubRate,
                        name: getCurrency(currency.quoteVia)?.name ?? currency.quoteVia,
                    };
                }
            } catch (error) {
                console.warn(`[awesomeApiProvider] Frankfurter falhou para ${code}:`, error.message);
            }
        })
    );

    return parsed;
};

const fetchPairs = async (pairs) => {
    try {
        return await fetchPairsFromAwesome(pairs);
    } catch (error) {
        console.warn('[awesomeApiProvider] AwesomeAPI /last falhou:', error.message);
        return {};
    }
};

const parseHistoryDate = (entry) => {
    if (entry?.create_date) {
        return String(entry.create_date).slice(0, 10);
    }

    const timestamp = Number(entry?.timestamp);
    if (Number.isFinite(timestamp) && timestamp > 0) {
        return new Date(timestamp * 1000).toISOString().slice(0, 10);
    }

    return null;
};

const fetchHistoryFromAwesome = async (pair, days = 30) => {
    const safeDays = Math.min(Math.max(Number(days) || 30, 7), 90);
    const key = cacheKey(`awesome:history:${pair}:${safeDays}`);
    const cached = getCached(key);
    if (cached) return cached;

    const url = `${AWESOME_BASE_URL}/daily/${pair}/${safeDays}`;
    const { data } = await axios.get(url, { timeout: REQUEST_TIMEOUT_MS });
    const points = Array.isArray(data)
        ? data
              .map((item) => ({
                  date: parseHistoryDate(item),
                  bid: Number(item.bid),
                  ask: Number(item.ask),
              }))
              .filter((item) => item.date && Number.isFinite(item.bid))
              .reverse()
        : [];

    setCached(key, points);
    return points;
};

const fetchHistoryFromFrankfurter = async (from, to, days = 30) => {
    const safeDays = Math.min(Math.max(Number(days) || 30, 7), 90);
    const key = cacheKey(`frankfurter:history:${from}:${to}:${safeDays}`);
    const cached = getCached(key);
    if (cached) return cached;

    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(end.getUTCDate() - safeDays);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    const { data } = await axios.get(`${FRANKFURTER_BASE_URL}/${startDate}..${endDate}`, {
        params: { from, to },
        timeout: REQUEST_TIMEOUT_MS,
    });

    const rates = data?.rates ?? {};
    const points = Object.entries(rates)
        .map(([date, value]) => {
            const bid = Number(value?.[to]);
            if (!Number.isFinite(bid) || bid <= 0) return null;
            return { date, bid, ask: bid };
        })
        .filter(Boolean)
        .sort((left, right) => left.date.localeCompare(right.date));

    setCached(key, points);
    return points;
};

const fetchHistory = async (pair, days = 30) => {
    try {
        const points = await fetchHistoryFromAwesome(pair, days);
        if (points.length) return points;
    } catch (error) {
        console.warn('[awesomeApiProvider] AwesomeAPI /daily falhou:', error.message);
    }

    const [from] = String(pair).split('-');
    if (!from || from === 'BRL') return [];

    try {
        return await fetchHistoryFromFrankfurter(from, 'BRL', days);
    } catch (error) {
        console.warn('[awesomeApiProvider] Frankfurter histórico falhou:', error.message);
        return [];
    }
};

const mergeCrossHistory = (crossPoints, hubPoints) => {
    const hubByDate = Object.fromEntries(hubPoints.map((point) => [point.date, point]));

    return crossPoints
        .map((point) => {
            const hubPoint = hubByDate[point.date];
            if (!hubPoint?.bid) return null;

            const bid = point.bid * hubPoint.bid;
            const ask = (point.ask || point.bid) * (hubPoint.ask || hubPoint.bid);

            return {
                date: point.date,
                bid,
                ask,
            };
        })
        .filter(Boolean);
};

const fetchHistoryForCurrency = async (code, days = 30) => {
    await ensureCatalog();
    const currency = getCurrency(code);
    if (!currency || code === 'BRL') return [];

    if (currency.pair) {
        return fetchHistory(currency.pair, days);
    }

    if (currency.crossPair && currency.quoteVia) {
        const hubPair = `${currency.quoteVia}-BRL`;
        const [crossPoints, hubPoints] = await Promise.all([
            fetchHistory(currency.crossPair, days),
            fetchHistory(hubPair, days),
        ]);

        return mergeCrossHistory(crossPoints, hubPoints);
    }

    return [];
};

const resolvePairsForCodes = async (codes = []) => {
    await ensureCatalog();

    const pairs = new Set();
    const requests = [];

    for (const rawCode of codes) {
        const code = String(rawCode ?? '').toUpperCase();
        if (code === 'BRL') continue;

        const currency = getCurrency(code);
        if (!currency) continue;

        if (currency.pair) {
            pairs.add(currency.pair);
            requests.push({ code, currency, type: 'direct' });
            continue;
        }

        if (currency.crossPair && currency.quoteVia) {
            pairs.add(currency.crossPair);
            pairs.add(`${currency.quoteVia}-BRL`);
            requests.push({ code, currency, type: 'cross' });
        }
    }

    return { pairs: [...pairs], requests };
};

const getRatesForCodes = async (codes = []) => {
    const normalized = [...new Set(codes.map((code) => String(code ?? '').toUpperCase()).filter(Boolean))];
    if (!normalized.length) return {};

    const { pairs, requests } = await resolvePairsForCodes(normalized);
    let fetched = pairs.length ? await fetchPairs(pairs) : {};

    const missingRequests = requests.filter((request) => {
        if (request.type === 'direct') return !fetched[request.code];
        return !(fetched[request.code] && fetched[request.currency.quoteVia]);
    });

    if (missingRequests.length) {
        const fallback = await fetchPairsFromFrankfurter(missingRequests);
        fetched = { ...fetched, ...fallback };
    }

    const rates = {};

    for (const code of normalized) {
        if (code === 'BRL') {
            rates.BRL = buildBrlRate(getCurrency('BRL'));
            continue;
        }

        const request = requests.find((item) => item.code === code);
        if (!request) continue;

        if (request.type === 'direct') {
            const rate = fetched[code];
            if (rate) rates[code] = rate;
            continue;
        }

        const crossRate = fetched[code];
        const hubRate = fetched[request.currency.quoteVia];
        if (crossRate && hubRate) {
            rates[code] = combineCrossRate(code, request.currency, crossRate, hubRate);
        }
    }

    return rates;
};

const getRateForCode = async (code) => {
    const normalized = String(code ?? '').toUpperCase();
    const rates = await getRatesForCodes([normalized]);
    return rates[normalized] ?? null;
};

module.exports = {
    fetchPairs,
    fetchHistory,
    fetchHistoryForCurrency,
    getRatesForCodes,
    getRateForCode,
    CACHE_TTL_MS,
};
