const { obterMediaPassagem } = require('../../../src/services/tripFlightPriceService');

describe('tripFlightPriceService', () => {
    it('retorna estimativa para destinos conhecidos', async () => {
        const result = await obterMediaPassagem({
            destino: 'Argentina',
            dataPrevista: '2026-08-01',
        });

        expect(result.disponivel).toBe(true);
        expect(result.destino).toBe('Buenos Aires');
        expect(result.valorMedioBrl).toBeGreaterThan(0);
        expect(result.fonte).toBe('estimativa');
    });

    it('retorna indisponível para destino desconhecido', async () => {
        const result = await obterMediaPassagem({
            destino: 'Cidade Imaginaria XYZ',
        });

        expect(result.disponivel).toBe(false);
    });
});
