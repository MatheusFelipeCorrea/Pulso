const axios = require('axios');

const UNIQ_URL = 'https://economia.awesomeapi.com.br/xml/available/uniq';
const AVAILABLE_URL = 'https://economia.awesomeapi.com.br/json/available';
const CATALOG_TTL_MS = 24 * 60 * 60 * 1000;
const QUOTE_HUBS = ['USD', 'EUR', 'GBP'];

const EXCLUDED_CODES = new Set([
    'BRLT',
    'BRLPTAX',
    'USDT',
    'CHFRTS',
    'JPYRTS',
    'RUBTOD',
    'RUBTOM',
    'NGNI',
    'NGNPARALLEL',
    'SDR',
    'XBR',
    'BRETT',
    'CNH',
]);

const CRYPTO_CODES = new Set(['BTC', 'ETH', 'LTC', 'XRP', 'SOL', 'BNB']);

const CURRENCY_SYMBOLS = {
    BRL: 'R$',
    USD: 'US$',
    EUR: '€',
    GBP: '£',
    ARS: 'AR$',
    MXN: 'MX$',
    JPY: '¥',
    CAD: 'CA$',
    CHF: 'CHF',
    AUD: 'A$',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    THB: '฿',
    RUB: '₽',
    PLN: 'zł',
    TRY: '₺',
    ZAR: 'R',
    AED: 'د.إ',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    ILS: '₪',
    PHP: '₱',
    VND: '₫',
};

const BRL_CURRENCY = {
    code: 'BRL',
    name: 'Real Brasileiro',
    symbol: 'R$',
    pair: null,
    quoteVia: null,
    crossPair: null,
};

const FALLBACK_CURRENCIES = [
    BRL_CURRENCY,
    { code: 'USD', name: 'Dólar Americano', symbol: 'US$', pair: 'USD-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'EUR', name: 'Euro', symbol: '€', pair: 'EUR-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£', pair: 'GBP-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'ARS', name: 'Peso Argentino', symbol: 'AR$', pair: 'ARS-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'MXN', name: 'Peso Mexicano', symbol: 'MX$', pair: 'MXN-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'JPY', name: 'Iene Japonês', symbol: '¥', pair: 'JPY-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'CAD', name: 'Dólar Canadense', symbol: 'CA$', pair: 'CAD-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF', pair: 'CHF-BRL', quoteVia: 'direct', crossPair: null },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', pair: 'AUD-BRL', quoteVia: 'direct', crossPair: null },
];

const DEFAULT_FAVORITES = ['USD', 'EUR', 'GBP', 'ARS'];

let catalogCache = null;
let catalogLoadedAt = 0;
let catalogPromise = null;
let currencyByCode = Object.fromEntries(FALLBACK_CURRENCIES.map((item) => [item.code, item]));

const cleanCurrencyName = (name) => String(name ?? '').replace(/\s*\[[^\]]*\]\s*$/u, '').trim();

const parseUniqXml = (xml) =>
    [...String(xml).matchAll(/<([A-Z0-9]{3,})>([^<]*)<\/\1>/gu)].map((match) => ({
        code: match[1],
        name: cleanCurrencyName(match[2]),
    }));

const resolveQuote = (code, pairs, brlPairs) => {
    if (code === 'BRL') {
        return { pair: null, quoteVia: null, crossPair: null };
    }

    const directPair = `${code}-BRL`;
    if (brlPairs.has(directPair)) {
        return { pair: directPair, quoteVia: 'direct', crossPair: null };
    }

    for (const hub of QUOTE_HUBS) {
        const crossPair = `${code}-${hub}`;
        const hubPair = `${hub}-BRL`;
        if (pairs.includes(crossPair) && brlPairs.has(hubPair)) {
            return { pair: null, quoteVia: hub, crossPair };
        }
    }

    return null;
};

const buildIndex = (catalog) => {
    currencyByCode = Object.fromEntries(catalog.map((item) => [item.code, item]));
};

const loadCatalogFromApi = async () => {
    const [uniqResponse, availableResponse] = await Promise.all([
        axios.get(UNIQ_URL, { timeout: 10000 }),
        axios.get(AVAILABLE_URL, { timeout: 10000 }),
    ]);

    const names = parseUniqXml(uniqResponse.data);
    const pairs = Object.keys(availableResponse.data ?? {});
    const brlPairs = new Set(pairs.filter((pair) => pair.endsWith('-BRL')));

    const moedas = [BRL_CURRENCY];

    for (const { code, name } of names) {
        if (code === 'BRL' || !/^[A-Z]{3}$/u.test(code) || EXCLUDED_CODES.has(code) || CRYPTO_CODES.has(code)) {
            continue;
        }

        const quote = resolveQuote(code, pairs, brlPairs);
        if (!quote) continue;

        moedas.push({
            code,
            name: name || code,
            symbol: CURRENCY_SYMBOLS[code] ?? code,
            pair: quote.pair,
            quoteVia: quote.quoteVia,
            crossPair: quote.crossPair,
        });
    }

    moedas.sort((left, right) => {
        if (left.code === 'BRL') return -1;
        if (right.code === 'BRL') return 1;
        return left.name.localeCompare(right.name, 'pt-BR');
    });

    return moedas;
};

const ensureCatalog = async () => {
    if (catalogCache && Date.now() - catalogLoadedAt < CATALOG_TTL_MS) {
        return catalogCache;
    }

    if (!catalogPromise) {
        catalogPromise = loadCatalogFromApi()
            .then((catalog) => {
                catalogCache = catalog;
                catalogLoadedAt = Date.now();
                buildIndex(catalog);
                return catalog;
            })
            .catch((error) => {
                console.warn('[currencyCatalog] usando fallback local:', error.message);
                catalogCache = FALLBACK_CURRENCIES;
                catalogLoadedAt = Date.now();
                buildIndex(catalogCache);
                return catalogCache;
            })
            .finally(() => {
                catalogPromise = null;
            });
    }

    return catalogPromise;
};

const isSupportedCurrency = (code) => Boolean(currencyByCode[String(code ?? '').toUpperCase()]);

const getCurrency = (code) => currencyByCode[String(code ?? '').toUpperCase()] ?? null;

const getSupportedCurrencies = async () => ensureCatalog();

module.exports = {
    BRL_CURRENCY,
    FALLBACK_CURRENCIES,
    DEFAULT_FAVORITES,
    ensureCatalog,
    getSupportedCurrencies,
    isSupportedCurrency,
    getCurrency,
};
