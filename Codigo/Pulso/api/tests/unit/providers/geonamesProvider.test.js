const geonamesProvider = require('../../../src/providers/geonamesProvider');
const { listTripDestinations } = require('../../../src/constants/tripDestinationsCatalog');

describe('geonamesProvider', () => {
    const originalUsername = process.env.GEONAMES_USERNAME;

    afterEach(() => {
        if (originalUsername) {
            process.env.GEONAMES_USERNAME = originalUsername;
        } else {
            delete process.env.GEONAMES_USERNAME;
        }
    });

    it('carrega o módulo sem erro', () => {
        expect(typeof geonamesProvider.searchPlaces).toBe('function');
    });

    it('usa catálogo interno quando não há credencial GeoNames', async () => {
        delete process.env.GEONAMES_USERNAME;

        const results = await geonamesProvider.searchPlaces('gramado', { limit: 5 });

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].source).toBe('catalog');
        expect(results.some((item) => item.name === 'Gramado')).toBe(true);
    });

    it('retorna sugestões iniciais sem termo de busca', async () => {
        delete process.env.GEONAMES_USERNAME;

        const results = await geonamesProvider.searchPlaces('', { limit: 10 });

        expect(results.length).toBeGreaterThan(0);
        expect(results.length).toBeLessThanOrEqual(10);
    });

    it('expõe total do catálogo legado para fallback', () => {
        expect(listTripDestinations().length).toBeGreaterThan(200);
    });
});
