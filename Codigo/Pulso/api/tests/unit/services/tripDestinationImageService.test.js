const {
    buildWikiTitles,
    buildCommonsQueries,
    resolveTripCoverImage,
} = require('../../../src/services/tripDestinationImageService');

describe('tripDestinationImageService', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('monta títulos geográficos a partir do destinoMeta', () => {
        const titles = buildWikiTitles(
            {
                label: 'Macaé',
                region: 'Rio de Janeiro',
                countryName: 'Brasil',
            },
            'Macaé, Rio de Janeiro, Brasil'
        );

        expect(titles).toContain('Macaé, Rio de Janeiro');
        expect(titles).toContain('Macaé (Rio de Janeiro)');
    });

    it('monta buscas no commons com cidade e país', () => {
        const queries = buildCommonsQueries(
            {
                label: 'Vitória',
                region: 'Espírito Santo',
                countryName: 'Brasil',
            },
            'Vitória, Espírito Santo, Brasil'
        );

        expect(queries[0]).toContain('Vitória');
        expect(queries[0]).toContain('Brasil');
    });

    it('prioriza wikipedia e ignora clube', async () => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    type: 'standard',
                    title: 'Club de Regatas Vasco da Gama',
                    description: 'clube de futebol brasileiro',
                    thumbnail: { source: 'https://upload.wikimedia.org/vasco.jpg' },
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    type: 'standard',
                    title: 'Macaé',
                    description: 'município do estado do Rio de Janeiro',
                    thumbnail: { source: 'https://upload.wikimedia.org/320px-macae.jpg' },
                }),
            });

        const image = await resolveTripCoverImage({
            destino: 'Macaé, Rio de Janeiro, Brasil',
            destinoMeta: {
                label: 'Macaé',
                region: 'Rio de Janeiro',
                countryName: 'Brasil',
            },
        });

        expect(image).toBe('https://upload.wikimedia.org/420px-macae.jpg');
    });
});
