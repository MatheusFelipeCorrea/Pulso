const TRIP_ORIGINS = [
    {
        id: 'GRU',
        code: 'GRU',
        label: 'São Paulo (GRU)',
        cidade: 'São Paulo',
        busOrigin: 'São Paulo (Tietê / Barra Funda)',
        buserDisponivel: true,
        flightFactor: 1,
    },
    {
        id: 'GIG',
        code: 'GIG',
        label: 'Rio de Janeiro (GIG)',
        cidade: 'Rio de Janeiro',
        busOrigin: 'Rio de Janeiro (Novo Rio)',
        buserDisponivel: true,
        flightFactor: 1.04,
    },
    {
        id: 'CNF',
        code: 'CNF',
        label: 'Belo Horizonte (CNF)',
        cidade: 'Belo Horizonte',
        busOrigin: 'Belo Horizonte (Terminal JK)',
        buserDisponivel: true,
        flightFactor: 1.08,
    },
    {
        id: 'BSB',
        code: 'BSB',
        label: 'Brasília (BSB)',
        cidade: 'Brasília',
        busOrigin: 'Brasília (Rodoferroviária)',
        buserDisponivel: true,
        flightFactor: 1.06,
    },
    {
        id: 'CWB',
        code: 'CWB',
        label: 'Curitiba (CWB)',
        cidade: 'Curitiba',
        busOrigin: 'Curitiba (Terminal Rodoferroviário)',
        buserDisponivel: true,
        flightFactor: 1.07,
    },
    {
        id: 'POA',
        code: 'POA',
        label: 'Porto Alegre (POA)',
        cidade: 'Porto Alegre',
        busOrigin: 'Porto Alegre (Terminal Antônio de Freitas)',
        buserDisponivel: true,
        flightFactor: 1.1,
    },
    {
        id: 'SSA',
        code: 'SSA',
        label: 'Salvador (SSA)',
        cidade: 'Salvador',
        busOrigin: 'Salvador (Terminal Rodoviário)',
        buserDisponivel: true,
        flightFactor: 1.12,
    },
    {
        id: 'REC',
        code: 'REC',
        label: 'Recife (REC)',
        cidade: 'Recife',
        busOrigin: 'Recife (Terminal Integrado)',
        buserDisponivel: true,
        flightFactor: 1.14,
    },
    {
        id: 'FOR',
        code: 'FOR',
        label: 'Fortaleza (FOR)',
        cidade: 'Fortaleza',
        busOrigin: 'Fortaleza (Terminal João Tomé)',
        buserDisponivel: true,
        flightFactor: 1.15,
    },
    {
        id: 'FLN',
        code: 'FLN',
        label: 'Florianópolis (FLN)',
        cidade: 'Florianópolis',
        busOrigin: 'Florianópolis (Terminal Rita Maria)',
        buserDisponivel: true,
        flightFactor: 1.09,
    },
];

const DEFAULT_ORIGIN_ID = 'GRU';

function resolveTripOrigin(originId) {
    const normalized = String(originId ?? DEFAULT_ORIGIN_ID).trim().toUpperCase();
    return TRIP_ORIGINS.find((entry) => entry.id === normalized)
        ?? TRIP_ORIGINS.find((entry) => entry.id === DEFAULT_ORIGIN_ID);
}

function listTripOrigins() {
    return TRIP_ORIGINS.map(({ id, code, label, cidade, busOrigin }) => ({
        id,
        code,
        label,
        cidade,
        busOrigin,
    }));
}

const DEFAULT_ORIGIN = resolveTripOrigin(DEFAULT_ORIGIN_ID);

module.exports = {
    TRIP_ORIGINS,
    DEFAULT_ORIGIN_ID,
    DEFAULT_ORIGIN,
    resolveTripOrigin,
    listTripOrigins,
};
