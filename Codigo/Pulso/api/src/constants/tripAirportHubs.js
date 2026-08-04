const { getHubFallbackBrl } = require('./tripDestinationMeta');

/**
 * Hubs aéreos com coordenadas para mapeamento GeoNames → IATA.
 * fallbackBrl: referência ida/volta saindo de GRU.
 */
const TRIP_AIRPORT_HUBS = [
    { iata: 'GRU', label: 'São Paulo', countryCode: 'BR', lat: -23.4356, lng: -46.4731 },
    { iata: 'GIG', label: 'Rio de Janeiro', countryCode: 'BR', lat: -22.8099, lng: -43.2506 },
    { iata: 'CNF', label: 'Belo Horizonte', countryCode: 'BR', lat: -19.6244, lng: -43.9719 },
    { iata: 'VIX', label: 'Vitória', countryCode: 'BR', lat: -20.2581, lng: -40.2864 },
    { iata: 'BSB', label: 'Brasília', countryCode: 'BR', lat: -15.8711, lng: -47.9186 },
    { iata: 'SSA', label: 'Salvador', countryCode: 'BR', lat: -12.9086, lng: -38.3225 },
    { iata: 'REC', label: 'Recife', countryCode: 'BR', lat: -8.1264, lng: -34.9236 },
    { iata: 'FOR', label: 'Fortaleza', countryCode: 'BR', lat: -3.7763, lng: -38.5326 },
    { iata: 'CWB', label: 'Curitiba', countryCode: 'BR', lat: -25.5285, lng: -49.1758 },
    { iata: 'POA', label: 'Porto Alegre', countryCode: 'BR', lat: -29.9939, lng: -51.1711 },
    { iata: 'FLN', label: 'Florianópolis', countryCode: 'BR', lat: -27.6705, lng: -48.5477 },
    { iata: 'MAO', label: 'Manaus', countryCode: 'BR', lat: -3.0386, lng: -60.0497 },
    { iata: 'NAT', label: 'Natal', countryCode: 'BR', lat: -5.9114, lng: -35.2478 },
    { iata: 'GYN', label: 'Goiânia', countryCode: 'BR', lat: -16.632, lng: -49.2207 },
    { iata: 'VCP', label: 'Campinas', countryCode: 'BR', lat: -23.0074, lng: -47.1345 },
    { iata: 'BEL', label: 'Belém', countryCode: 'BR', lat: -1.3891, lng: -48.4763 },
    { iata: 'MCZ', label: 'Maceió', countryCode: 'BR', lat: -9.5108, lng: -35.7917 },
    { iata: 'JPA', label: 'João Pessoa', countryCode: 'BR', lat: -7.1481, lng: -34.9506 },
    { iata: 'AJU', label: 'Aracaju', countryCode: 'BR', lat: -10.984, lng: -37.0703 },
    { iata: 'UDI', label: 'Uberlândia', countryCode: 'BR', lat: -18.8828, lng: -48.2256 },
    { iata: 'RAO', label: 'Ribeirão Preto', countryCode: 'BR', lat: -21.1364, lng: -47.7767 },
    { iata: 'CGB', label: 'Cuiabá', countryCode: 'BR', lat: -15.6529, lng: -56.1167 },
    { iata: 'CGR', label: 'Campo Grande', countryCode: 'BR', lat: -20.4687, lng: -54.6725 },
    { iata: 'IGU', label: 'Foz do Iguaçu', countryCode: 'BR', lat: -25.6003, lng: -54.485 },
    { iata: 'LDB', label: 'Londrina', countryCode: 'BR', lat: -23.3336, lng: -51.1301 },
    { iata: 'JOI', label: 'Joinville', countryCode: 'BR', lat: -26.2244, lng: -48.7964 },
    { iata: 'NVT', label: 'Navegantes', countryCode: 'BR', lat: -26.8799, lng: -48.6518 },
    { iata: 'THE', label: 'Teresina', countryCode: 'BR', lat: -5.0599, lng: -42.8235 },
    { iata: 'SLZ', label: 'São Luís', countryCode: 'BR', lat: -2.5854, lng: -44.2341 },
    { iata: 'IMP', label: 'Imperatriz', countryCode: 'BR', lat: -5.5313, lng: -47.4598 },
    { iata: 'PMW', label: 'Palmas', countryCode: 'BR', lat: -10.2915, lng: -48.3569 },
    { iata: 'PVH', label: 'Porto Velho', countryCode: 'BR', lat: -8.7093, lng: -63.9023 },
    { iata: 'JJD', label: 'Jericoacoara', countryCode: 'BR', lat: -2.9068, lng: -40.3581 },
    { iata: 'IOS', label: 'Ilhéus', countryCode: 'BR', lat: -14.8158, lng: -39.0332 },
    { iata: 'EZE', label: 'Buenos Aires', countryCode: 'AR', lat: -34.8222, lng: -58.5358 },
    { iata: 'MVD', label: 'Montevidéu', countryCode: 'UY', lat: -34.8384, lng: -56.0308 },
    { iata: 'SCL', label: 'Santiago', countryCode: 'CL', lat: -33.393, lng: -70.7858 },
    { iata: 'LIM', label: 'Lima', countryCode: 'PE', lat: -12.0219, lng: -77.1143 },
    { iata: 'BOG', label: 'Bogotá', countryCode: 'CO', lat: 4.7016, lng: -74.1469 },
    { iata: 'MEX', label: 'Cidade do México', countryCode: 'MX', lat: 19.4363, lng: -99.0721 },
    { iata: 'CUN', label: 'Cancún', countryCode: 'MX', lat: 21.0365, lng: -86.8771 },
    { iata: 'MIA', label: 'Miami', countryCode: 'US', lat: 25.7959, lng: -80.287 },
    { iata: 'JFK', label: 'Nova York', countryCode: 'US', lat: 40.6413, lng: -73.7781 },
    { iata: 'LAX', label: 'Los Angeles', countryCode: 'US', lat: 33.9416, lng: -118.4085 },
    { iata: 'LIS', label: 'Lisboa', countryCode: 'PT', lat: 38.7813, lng: -9.1359 },
    { iata: 'MAD', label: 'Madri', countryCode: 'ES', lat: 40.4983, lng: -3.5676 },
    { iata: 'BCN', label: 'Barcelona', countryCode: 'ES', lat: 41.2971, lng: 2.0785 },
    { iata: 'CDG', label: 'Paris', countryCode: 'FR', lat: 49.0097, lng: 2.5479 },
    { iata: 'FCO', label: 'Roma', countryCode: 'IT', lat: 41.8003, lng: 12.2389 },
    { iata: 'LHR', label: 'Londres', countryCode: 'GB', lat: 51.47, lng: -0.4543 },
    { iata: 'FRA', label: 'Frankfurt', countryCode: 'DE', lat: 50.0379, lng: 8.5622 },
    { iata: 'AMS', label: 'Amsterdã', countryCode: 'NL', lat: 52.3105, lng: 4.7683 },
    { iata: 'NRT', label: 'Tóquio', countryCode: 'JP', lat: 35.772, lng: 140.3929 },
    { iata: 'ICN', label: 'Seul', countryCode: 'KR', lat: 37.4602, lng: 126.4407 },
    { iata: 'PVG', label: 'Xangai', countryCode: 'CN', lat: 31.1443, lng: 121.8083 },
    { iata: 'BKK', label: 'Bangkok', countryCode: 'TH', lat: 13.69, lng: 100.7501 },
    { iata: 'DEL', label: 'Nova Delhi', countryCode: 'IN', lat: 28.5562, lng: 77.1 },
    { iata: 'SYD', label: 'Sydney', countryCode: 'AU', lat: -33.9399, lng: 151.1753 },
    { iata: 'DXB', label: 'Dubai', countryCode: 'AE', lat: 25.2532, lng: 55.3657 },
    { iata: 'SIN', label: 'Singapura', countryCode: 'SG', lat: 1.3644, lng: 103.9915 },
    { iata: 'DPS', label: 'Bali', countryCode: 'ID', lat: -8.7482, lng: 115.1672 },
];

const HUB_BY_IATA = new Map(
    TRIP_AIRPORT_HUBS.map((hub) => [
        hub.iata,
        { ...hub, fallbackBrl: getHubFallbackBrl(hub.iata, { international: hub.countryCode !== 'BR' }) },
    ])
);

function toRadians(value) {
    return (value * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestAirportHub({ lat, lng, countryCode }) {
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }

    let bestHub = null;
    let bestScore = Infinity;

    for (const hub of TRIP_AIRPORT_HUBS) {
        const distanceKm = haversineKm(latitude, longitude, hub.lat, hub.lng);
        const sameCountry = hub.countryCode === String(countryCode ?? '').toUpperCase();
        const score = sameCountry ? distanceKm * 0.65 : distanceKm;

        if (score < bestScore) {
            bestScore = score;
            bestHub = hub;
        }
    }

    if (!bestHub) return null;

    return {
        ...bestHub,
        fallbackBrl: getHubFallbackBrl(bestHub.iata, { international: bestHub.countryCode !== 'BR' }),
        distanceKm: Math.round(haversineKm(latitude, longitude, bestHub.lat, bestHub.lng)),
    };
}

function getHubByIata(iata) {
    return HUB_BY_IATA.get(String(iata ?? '').toUpperCase()) ?? null;
}

module.exports = {
    TRIP_AIRPORT_HUBS,
    findNearestAirportHub,
    getHubByIata,
};
