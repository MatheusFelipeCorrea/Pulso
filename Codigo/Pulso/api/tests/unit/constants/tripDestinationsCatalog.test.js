const { listTripDestinations, searchTripDestinations, countTripDestinations, getCatalogEntry, buildDestinoMetaFromCatalog } = require('../../../src/constants/tripDestinationsCatalog');

describe('tripDestinationsCatalog', () => {
    it('lista centenas de destinos estruturados', () => {
        const destinos = listTripDestinations();
        const total = countTripDestinations();

        expect(total).toBeGreaterThan(180);
        expect(destinos.length).toBe(total);
    });

    it('resolve Vitória (ES) com metadados corretos', () => {
        const vitoria = listTripDestinations().find((item) => item.label === 'Vitória');
        expect(vitoria).toMatchObject({
            iata: 'VIX',
            countryCode: 'BR',
            moedaSugerida: 'BRL',
            destino: 'Vitória, Espírito Santo, Brasil',
        });
    });

    it('busca destinos turísticos brasileiros', () => {
        const results = searchTripDestinations('gramado', { limit: 5 });
        expect(results.some((item) => item.label === 'Gramado')).toBe(true);
    });

    it('busca destinos internacionais', () => {
        const results = searchTripDestinations('barcelona', { limit: 5 });
        expect(results.some((item) => item.label === 'Barcelona')).toBe(true);
    });

    it('monta destinoMeta a partir do catalogId', () => {
        const vitoria = listTripDestinations().find((item) => item.label === 'Vitória');
        const meta = buildDestinoMetaFromCatalog(vitoria.id);

        expect(meta).toMatchObject({
            catalogId: vitoria.id,
            iata: 'VIX',
            label: 'Vitória',
            domestic: true,
        });
        expect(getCatalogEntry(meta.catalogId)?.destino).toBe('Vitória, Espírito Santo, Brasil');
    });
});
