const { getTrainRouteEstimate } = require('../../../src/constants/tripTransportRoutes');
const { resolveTripOrigin } = require('../../../src/constants/tripOrigins');

describe('tripTransportRoutes train estimates', () => {
    it('habilita trem Vitória-Minas entre BH e Vitória', () => {
        const origin = resolveTripOrigin('CNF');
        const estimate = getTrainRouteEstimate(origin, {
            iata: 'VIX',
            label: 'Vitória',
            domestic: true,
        });

        expect(estimate?.servico).toContain('Vitória-Minas');
        expect(estimate?.valor).toBeGreaterThan(0);
    });

    it('habilita Serra Verde saindo de Curitiba', () => {
        const origin = resolveTripOrigin('CWB');
        const estimate = getTrainRouteEstimate(origin, {
            iata: 'CWB',
            label: 'Morretes',
            domestic: true,
        });

        expect(estimate?.servico).toContain('Serra Verde');
    });

    it('não sugere trem internacional saindo do Brasil', () => {
        const origin = resolveTripOrigin('GRU');
        const estimate = getTrainRouteEstimate(origin, {
            iata: 'CDG',
            label: 'Paris',
            domestic: false,
        });

        expect(estimate).toBeNull();
    });

    it('não sugere trem em rotas sem ferrovia prática', () => {
        const origin = resolveTripOrigin('GRU');
        const estimate = getTrainRouteEstimate(origin, {
            iata: 'GIG',
            label: 'Rio de Janeiro',
            domestic: true,
        });

        expect(estimate).toBeNull();
    });
});
