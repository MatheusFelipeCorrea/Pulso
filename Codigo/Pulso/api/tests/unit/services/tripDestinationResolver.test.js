const { resolveFromGeoNamesPlace, formatDestinoLabel } = require('../../../src/services/tripDestinationResolver');
const { findNearestAirportHub } = require('../../../src/constants/tripAirportHubs');

describe('tripDestinationResolver', () => {
    it('padroniza destino brasileiro com região', () => {
        const resolved = resolveFromGeoNamesPlace({
            geonameId: 1,
            name: 'Gramado',
            countryCode: 'BR',
            countryName: 'Brazil',
            adminName1: 'Rio Grande do Sul',
            lat: -29.3789,
            lng: -50.8756,
            source: 'geonames',
        });

        expect(resolved.destino).toBe('Gramado, Rio Grande do Sul, Brasil');
        expect(resolved.moedaSugerida).toBe('BRL');
        expect(resolved.domestic).toBe(true);
        expect(resolved.iata).toBe('POA');
        expect(resolved.destinoMeta.geonameId).toBe(1);
        expect(resolved.destinoMeta.source).toBe('geonames');
    });

    it('padroniza destino internacional', () => {
        const label = formatDestinoLabel({
            name: 'Barcelona',
            region: 'Catalonia',
            countryCode: 'ES',
            countryName: 'Spain',
        });

        expect(label).toContain('Barcelona');
        expect(label).toContain('Espanha');
    });

    it('evita repetir cidade como região (ex.: Tóquio)', () => {
        const resolved = resolveFromGeoNamesPlace({
            geonameId: 1850147,
            name: 'Tóquio',
            countryCode: 'JP',
            countryName: 'Japão',
            adminName1: 'Tóquio',
            lat: 35.6895,
            lng: 139.6917,
            source: 'geonames',
        });

        expect(resolved.destino).toBe('Tóquio, Japão');
        expect(resolved.subtitle).toBe('Japão');
    });

    it('mapeia aeroporto hub mais próximo', () => {
        const hub = findNearestAirportHub({
            lat: -29.3789,
            lng: -50.8756,
            countryCode: 'BR',
        });

        expect(hub?.iata).toBe('POA');
    });
});
