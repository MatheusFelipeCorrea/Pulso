const SOUTH_AMERICA_BUS_IATA = new Set(['EZE', 'MVD', 'ASU', 'SCL', 'LIM', 'BOG']);

/** Estimativas ida (ou ida e volta doméstica) por rota origem:destino */
const BUS_ROUTE_ESTIMATES = {
    'GRU:EZE': { convencional: 580, buser: null },
    'GIG:EZE': { convencional: 690, buser: null },
    'CNF:EZE': { convencional: 750, buser: null },
    'BSB:EZE': { convencional: 720, buser: null },
    'CWB:EZE': { convencional: 640, buser: null },
    'POA:EZE': { convencional: 610, buser: null },
    'GRU:MVD': { convencional: 520, buser: null },
    'GIG:MVD': { convencional: 480, buser: null },
    'GRU:ASU': { convencional: 490, buser: null },
    'GRU:SCL': { convencional: 650, buser: null },
    'GRU:LIM': { convencional: 720, buser: null },
    'GRU:BOG': { convencional: 780, buser: null },
    'GRU:GIG': { convencional: 145, buser: 89.9 },
    'GIG:GRU': { convencional: 145, buser: 89.9 },
    'GRU:CNF': { convencional: 95, buser: 59.9 },
    'CNF:GRU': { convencional: 95, buser: 59.9 },
    'GRU:BSB': { convencional: 110, buser: 69.9 },
    'BSB:GRU': { convencional: 110, buser: 69.9 },
    'GRU:CWB': { convencional: 85, buser: 54.9 },
    'CWB:GRU': { convencional: 85, buser: 54.9 },
    'GRU:POA': { convencional: 130, buser: 79.9 },
    'POA:GRU': { convencional: 130, buser: 79.9 },
    'GRU:SSA': { convencional: 220, buser: 149.9 },
    'SSA:GRU': { convencional: 220, buser: 149.9 },
    'GRU:REC': { convencional: 280, buser: 189.9 },
    'REC:GRU': { convencional: 280, buser: 189.9 },
    'GRU:FOR': { convencional: 320, buser: 219.9 },
    'FOR:GRU': { convencional: 320, buser: 219.9 },
    'GRU:FLN': { convencional: 105, buser: 69.9 },
    'FLN:GRU': { convencional: 105, buser: 69.9 },
    'GIG:CNF': { convencional: 180, buser: 119.9 },
    'CNF:GIG': { convencional: 180, buser: 119.9 },
    'GRU:VIX': { convencional: 175, buser: 109.9 },
    'VIX:GRU': { convencional: 175, buser: 109.9 },
    'GIG:VIX': { convencional: 120, buser: 74.9 },
    'VIX:GIG': { convencional: 120, buser: 74.9 },
    'CNF:VIX': { convencional: 195, buser: 129.9 },
    'VIX:CNF': { convencional: 195, buser: 129.9 },
    'BSB:VIX': { convencional: 210, buser: 139.9 },
    'VIX:BSB': { convencional: 210, buser: 139.9 },
    'CWB:VIX': { convencional: 185, buser: 119.9 },
    'VIX:CWB': { convencional: 185, buser: 119.9 },
};

const FLIGHT_ROUTE_OVERRIDES = {
    'GRU:EZE': 1900,
    'GIG:EZE': 2050,
    'CNF:EZE': 2180,
    'BSB:EZE': 1980,
    'CWB:EZE': 1920,
    'POA:EZE': 1880,
    'GRU:GIG': 650,
    'GIG:GIG': 650,
    'GRU:VIX': 520,
    'GIG:VIX': 480,
    'CNF:VIX': 450,
};

function routeKey(originId, destIata) {
    return `${originId}:${destIata}`;
}

function getFlightFallback(origin, destination) {
    const key = routeKey(origin.id, destination.iata);
    if (FLIGHT_ROUTE_OVERRIDES[key] != null) {
        return FLIGHT_ROUTE_OVERRIDES[key];
    }

    if (origin.id === 'GRU') {
        return destination.fallbackBrl;
    }

    const gruBaseline = FLIGHT_ROUTE_OVERRIDES[routeKey('GRU', destination.iata)]
        ?? destination.fallbackBrl;

    return Math.round(gruBaseline * (origin.flightFactor ?? 1.08));
}

function getBusRouteEstimate(origin, destination) {
    const key = routeKey(origin.id, destination.iata);
    const direct = BUS_ROUTE_ESTIMATES[key];
    if (direct) return direct;

    const domestic = Boolean(destination.domestic);
    const internationalBus = SOUTH_AMERICA_BUS_IATA.has(destination.iata);

    if (!domestic && !internationalBus) {
        return null;
    }

    const gruKey = routeKey('GRU', destination.iata);
    const gruEstimate = BUS_ROUTE_ESTIMATES[gruKey];

    if (gruEstimate) {
        const factor = origin.id === 'GRU' ? 1 : 1.06;
        return {
            convencional: Math.round(gruEstimate.convencional * factor),
            buser: origin.buserDisponivel ? gruEstimate.buser : null,
        };
    }

    if (domestic && origin.buserDisponivel) {
        return {
            convencional: Math.round(130 * (origin.flightFactor ?? 1)),
            buser: Math.round(79.9 * (origin.flightFactor ?? 1)),
        };
    }

    if (internationalBus) {
        return {
            convencional: Math.round(600 * (origin.flightFactor ?? 1.08)),
            buser: null,
        };
    }

    return null;
}

/**
 * Rotas ferroviárias reais no Brasil (intercidades ou turísticas consolidadas).
 * Valores = referência ida em BRL, antes do ajuste sazonal.
 */
const TRAIN_ROUTE_ESTIMATES = {
    'CNF:VIX': { valor: 145, idaVolta: false, servico: 'Trem Vitória-Minas' },
    'VIX:CNF': { valor: 145, idaVolta: false, servico: 'Trem Vitória-Minas' },
    'GRU:VCP': { valor: 72, idaVolta: false, servico: 'Trem regional São Paulo–Campinas' },
    'VCP:GRU': { valor: 72, idaVolta: false, servico: 'Trem regional Campinas–São Paulo' },
};

/** Destinos atendidos por trem a partir de hubs listados (mesmo IATA ou cidade turística). */
const TRAIN_DESTINATION_ROUTES = [
    {
        origins: ['CNF'],
        destLabels: ['Ouro Preto', 'Mariana', 'Tiradentes'],
        valor: 98,
        idaVolta: false,
        servico: 'Trem turístico Maria Fumaça (trecho Ouro Preto–Mariana)',
    },
    {
        origins: ['CWB'],
        destLabels: ['Morretes', 'Paranaguá'],
        valor: 195,
        idaVolta: false,
        servico: 'Serra Verde Express (Curitiba–Morretes/Paranaguá)',
    },
];

function normalizeRouteLabel(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function getTrainRouteEstimate(origin, destination) {
    if (!destination?.domestic) return null;

    const directKey = routeKey(origin.id, destination.iata);
    const direct = TRAIN_ROUTE_ESTIMATES[directKey];
    if (direct) return direct;

    const destLabel = normalizeRouteLabel(destination.label);
    if (!destLabel) return null;

    const labelRoute = TRAIN_DESTINATION_ROUTES.find(
        (entry) =>
            entry.origins.includes(origin.id) &&
            entry.destLabels.some((label) => normalizeRouteLabel(label) === destLabel)
    );

    if (labelRoute) {
        return {
            valor: labelRoute.valor,
            idaVolta: labelRoute.idaVolta,
            servico: labelRoute.servico,
        };
    }

    return null;
}

module.exports = {
    SOUTH_AMERICA_BUS_IATA,
    getFlightFallback,
    getBusRouteEstimate,
    getTrainRouteEstimate,
};
