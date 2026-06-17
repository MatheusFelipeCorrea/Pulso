const { DEFAULT_ORIGIN, resolveTripOrigin } = require('./tripOrigins');
const { buildDestinationAirports, normalizeText } = require('./tripDestinationsCatalog');
const { getBusRouteEstimate, getTrainRouteEstimate, toDisplayedBusPrice } = require('./tripTransportRoutes');
const {
    getSeasonalAdjustment,
    applySeasonalPrice,
} = require('./tripSeasonalPricing');

/** @deprecated use tripOrigins.DEFAULT_ORIGIN */
const DEFAULT_ORIGIN_LEGACY = DEFAULT_ORIGIN;

/** Estimativas legadas — preferir tripTransportRoutes */
const GROUND_TRANSPORT_BY_IATA = {
    EZE: {
        busConvencionalBrl: 580,
        buserBrl: null,
        tremDisponivel: false,
    },
    MVD: {
        busConvencionalBrl: 520,
        buserBrl: null,
        tremDisponivel: false,
    },
    ASU: {
        busConvencionalBrl: 490,
        buserBrl: null,
        tremDisponivel: false,
    },
    SCL: {
        busConvencionalBrl: 650,
        buserBrl: null,
        tremDisponivel: false,
    },
    LIM: {
        busConvencionalBrl: 720,
        buserBrl: null,
        tremDisponivel: false,
    },
    BOG: {
        busConvencionalBrl: 780,
        buserBrl: null,
        tremDisponivel: false,
    },
    GIG: {
        busConvencionalBrl: 145,
        buserBrl: 89.9,
        tremDisponivel: false,
    },
    VIX: {
        busConvencionalBrl: 120,
        buserBrl: 74.9,
        tremDisponivel: false,
    },
    CNF: {
        busConvencionalBrl: 95,
        buserBrl: 59.9,
        tremDisponivel: false,
    },
    BSB: {
        busConvencionalBrl: 110,
        buserBrl: 69.9,
        tremDisponivel: false,
    },
    SSA: {
        busConvencionalBrl: 220,
        buserBrl: 149.9,
        tremDisponivel: false,
    },
    GRU: {
        busConvencionalBrl: 0,
        buserBrl: null,
        tremDisponivel: false,
    },
};

const SOUTH_AMERICA_BUS_IATA = new Set(['EZE', 'MVD', 'ASU', 'SCL', 'LIM', 'BOG']);

const DESTINATION_AIRPORTS = buildDestinationAirports();

function keywordMatchesToken(token, normalizedKeyword) {
    if (!normalizedKeyword) return false;

    if (normalizedKeyword.length <= 3) {
        const pattern = new RegExp(`(^|[\\s,-])${normalizedKeyword}($|[\\s,-])`);
        return pattern.test(token);
    }

    return token.includes(normalizedKeyword);
}

function resolveDestinationAirport(destino, destinoMeta) {
    const { getAirportEntryForMeta } = require('./tripDestinationsCatalog');
    const fromMeta = getAirportEntryForMeta(destinoMeta);
    if (fromMeta) return fromMeta;

    const normalized = normalizeText(destino);
    if (!normalized) return null;

    const parts = normalized.split(/[,;/|]+/).map((part) => part.trim()).filter(Boolean);
    const tokens = [...new Set([normalized, ...parts])];

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of DESTINATION_AIRPORTS) {
        for (const keyword of entry.keywords) {
            for (const token of tokens) {
                if (!keywordMatchesToken(token, keyword)) continue;

                const score = keyword.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = entry;
                }
            }
        }

        const normalizedLabel = normalizeText(entry.label);
        for (const token of tokens) {
            if (token === normalizedLabel || token.includes(normalizedLabel)) {
                const score = normalizedLabel.length + 10;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = entry;
                }
            }
        }
    }

    return bestMatch;
}

function buildBusInsight(destination, originInput, travelDates = {}) {
    const origin = resolveTripOrigin(originInput?.id ?? originInput);
    const estimate = getBusRouteEstimate(origin, destination);
    const domestic = Boolean(destination.domestic);
    const busSeason = getSeasonalAdjustment({
        departureDate: travelDates.departureDate,
        returnDate: travelDates.returnDate,
        mode: 'bus',
        domestic,
    });

    if (estimate) {
        const buserDisponivel = estimate.buser != null;
        const idaVolta = domestic;
        const valorConvencionalBrl = toDisplayedBusPrice(
            applySeasonalPrice(estimate.convencional, busSeason),
            idaVolta
        );
        const valorBuserBrl =
            estimate.buser != null
                ? toDisplayedBusPrice(applySeasonalPrice(estimate.buser, busSeason), idaVolta)
                : null;
        const baseMessage = `Saindo de ${origin.busOrigin}${idaVolta ? ' · ida e volta' : ' · ida'}`;

        return {
            disponivel: true,
            destino: destination.label,
            origem: origin.busOrigin,
            origemId: origin.id,
            valorConvencionalBrl,
            valorBuserBrl,
            buserDisponivel,
            fonte: 'estimativa',
            idaVolta,
            ajusteSazonal: busSeason.periodo ? busSeason : null,
            mensagem: baseMessage,
        };
    }

    return {
        disponivel: false,
        destino: destination.label,
        origemId: origin.id,
        mensagem: `Não há rota prática de ônibus de longa distância saindo de ${origin.busOrigin} para ${destination.label}.`,
    };
}

function buildTrainInsight(destination, originInput, travelDates = {}) {
    const origin = resolveTripOrigin(originInput?.id ?? originInput);
    const estimate = getTrainRouteEstimate(origin, destination);
    const trainSeason = getSeasonalAdjustment({
        departureDate: travelDates.departureDate,
        returnDate: travelDates.returnDate,
        mode: 'train',
        domestic: Boolean(destination.domestic),
    });

    if (estimate) {
        const baseMessage = estimate.servico;

        return {
            disponivel: true,
            destino: destination.label,
            origem: origin.cidade,
            origemId: origin.id,
            valorMedioBrl: applySeasonalPrice(estimate.valor, trainSeason),
            fonte: 'estimativa',
            idaVolta: Boolean(estimate.idaVolta),
            servico: estimate.servico,
            ajusteSazonal: trainSeason.periodo ? trainSeason : null,
            mensagem: baseMessage,
        };
    }

    if (!destination.domestic) {
        return {
            disponivel: false,
            destino: destination.label,
            origemId: origin.id,
            mensagem: `${destination.label} não possui trem intercidades a partir do Brasil. Considere voo + trem local no destino.`,
        };
    }

    return {
        disponivel: false,
        destino: destination.label,
        origemId: origin.id,
        mensagem: `Não há rota ferroviária prática de ${origin.cidade} para ${destination.label}.`,
    };
}

module.exports = {
    DEFAULT_ORIGIN: DEFAULT_ORIGIN_LEGACY,
    DESTINATION_AIRPORTS,
    resolveDestinationAirport,
    buildBusInsight,
    buildTrainInsight,
};
