const DEFAULT_ORIGIN = {
    code: 'GRU',
    label: 'São Paulo (GRU)',
};

const DESTINATION_AIRPORTS = [
    { keywords: ['argentina', 'buenos aires', 'buenos-aires'], iata: 'EZE', label: 'Buenos Aires', fallbackBrl: 1900 },
    { keywords: ['uruguai', 'montevideo'], iata: 'MVD', label: 'Montevidéu', fallbackBrl: 1700 },
    { keywords: ['paraguai', 'asuncion', 'asunción'], iata: 'ASU', label: 'Assunção', fallbackBrl: 1650 },
    { keywords: ['chile', 'santiago'], iata: 'SCL', label: 'Santiago', fallbackBrl: 2100 },
    { keywords: ['peru', 'lima', 'cusco'], iata: 'LIM', label: 'Lima', fallbackBrl: 2400 },
    { keywords: ['colombia', 'colômbia', 'bogota', 'bogotá'], iata: 'BOG', label: 'Bogotá', fallbackBrl: 2600 },
    { keywords: ['mexico', 'méxico', 'cancun', 'cancún', 'cidade do mexico'], iata: 'MEX', label: 'Cidade do México', fallbackBrl: 3200 },
    { keywords: ['estados unidos', 'united states', 'usa', 'nova york', 'new york', 'orlando', 'miami'], iata: 'MIA', label: 'Miami', fallbackBrl: 3400 },
    { keywords: ['canada', 'toronto', 'vancouver'], iata: 'YYZ', label: 'Toronto', fallbackBrl: 4200 },
    { keywords: ['portugal', 'lisboa'], iata: 'LIS', label: 'Lisboa', fallbackBrl: 3800 },
    { keywords: ['espanha', 'spain', 'madri', 'madrid', 'barcelona'], iata: 'MAD', label: 'Madri', fallbackBrl: 4100 },
    { keywords: ['franca', 'frança', 'france', 'paris'], iata: 'CDG', label: 'Paris', fallbackBrl: 4300 },
    { keywords: ['italia', 'itália', 'italy', 'roma', 'rome'], iata: 'FCO', label: 'Roma', fallbackBrl: 4500 },
    { keywords: ['reino unido', 'inglaterra', 'london', 'londres'], iata: 'LHR', label: 'Londres', fallbackBrl: 4600 },
    { keywords: ['alemanha', 'germany', 'berlim', 'berlin', 'munique'], iata: 'FRA', label: 'Frankfurt', fallbackBrl: 4400 },
    { keywords: ['japao', 'japão', 'japan', 'tokyo', 'toquio', 'tóquio', 'osaka'], iata: 'NRT', label: 'Tóquio', fallbackBrl: 6200 },
    { keywords: ['coreia', 'seul', 'seoul'], iata: 'ICN', label: 'Seul', fallbackBrl: 5800 },
    { keywords: ['china', 'pequim', 'beijing', 'shanghai'], iata: 'PVG', label: 'Xangai', fallbackBrl: 5600 },
    { keywords: ['tailandia', 'tailândia', 'bangkok'], iata: 'BKK', label: 'Bangkok', fallbackBrl: 5200 },
    { keywords: ['india', 'india', 'delhi', 'mumbai'], iata: 'DEL', label: 'Nova Delhi', fallbackBrl: 5400 },
    { keywords: ['australia', 'austrália', 'sydney', 'sidney'], iata: 'SYD', label: 'Sydney', fallbackBrl: 7800 },
    { keywords: ['emirados', 'dubai'], iata: 'DXB', label: 'Dubai', fallbackBrl: 4900 },
    { keywords: ['marrocos', 'marrakech'], iata: 'RAK', label: 'Marrakech', fallbackBrl: 4700 },
    { keywords: ['africa do sul', 'cape town', 'cidade do cabo'], iata: 'CPT', label: 'Cidade do Cabo', fallbackBrl: 5100 },
    { keywords: ['brasil', 'brazil', 'rio de janeiro', 'rio', 'macae', 'macaé', 'sao paulo', 'são paulo'], iata: 'GIG', label: 'Rio de Janeiro', fallbackBrl: 650, domestic: true },
];

function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function resolveDestinationAirport(destino) {
    const normalized = normalizeText(destino);
    if (!normalized) return null;

    const parts = normalized.split(/[,;/|]+/).map((part) => part.trim()).filter(Boolean);
    const tokens = [...new Set([normalized, ...parts])];

    for (const token of tokens) {
        const match = DESTINATION_AIRPORTS.find((entry) =>
            entry.keywords.some((keyword) => {
                const normalizedKeyword = normalizeText(keyword);
                if (normalizedKeyword.length <= 2) {
                    const pattern = new RegExp(`(^|[\\s,])${normalizedKeyword}($|[\\s,])`);
                    return pattern.test(token);
                }
                return token.includes(normalizedKeyword);
            })
        );
        if (match) return match;
    }

    return null;
}

module.exports = {
    DEFAULT_ORIGIN,
    DESTINATION_AIRPORTS,
    resolveDestinationAirport,
};
