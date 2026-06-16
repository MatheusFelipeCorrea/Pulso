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
        expect(result.onibus.disponivel).toBe(true);
        expect(result.onibus.valorConvencionalBrl).toBeGreaterThan(0);
        expect(result.onibus.buserDisponivel).toBe(false);
        expect(result.trem.disponivel).toBe(false);
    });

    it('retorna ônibus com Buser em destinos domésticos', async () => {
        const result = await obterMediaPassagem({
            destino: 'Rio de Janeiro',
            dataPrevista: '2026-08-01',
            origemId: 'GRU',
        });

        expect(result.onibus.buserDisponivel).toBe(true);
        expect(result.onibus.valorBuserBrl).toBeLessThan(result.onibus.valorConvencionalBrl);
    });

    it('ajusta estimativa em férias de julho', async () => {
        const july = await obterMediaPassagem({
            destino: 'Rio de Janeiro',
            dataPrevista: '2026-07-10',
            origemId: 'GRU',
        });
        const march = await obterMediaPassagem({
            destino: 'Rio de Janeiro',
            dataPrevista: '2026-03-10',
            origemId: 'GRU',
        });

        expect(july.ajusteSazonal?.periodo).toBe('Férias escolares de julho');
        expect(july.valorMedioBrl).toBeGreaterThan(march.valorMedioBrl);
        expect(july.onibus.valorConvencionalBrl).toBeGreaterThan(march.onibus.valorConvencionalBrl);
    });
    it('ajusta estimativas conforme a cidade de origem', async () => {
        const fromSp = await obterMediaPassagem({
            destino: 'Argentina',
            dataPrevista: '2026-08-01',
            origemId: 'GRU',
        });
        const fromRio = await obterMediaPassagem({
            destino: 'Argentina',
            dataPrevista: '2026-08-01',
            origemId: 'GIG',
        });

        expect(fromSp.origemId).toBe('GRU');
        expect(fromRio.origemId).toBe('GIG');
        expect(fromRio.valorMedioBrl).toBeGreaterThan(fromSp.valorMedioBrl);
        expect(fromRio.onibus.valorConvencionalBrl).toBeGreaterThan(fromSp.onibus.valorConvencionalBrl);
    });

    it('retorna indisponível para destino desconhecido', async () => {
        const result = await obterMediaPassagem({
            destino: 'Cidade Imaginaria XYZ',
        });

        expect(result.disponivel).toBe(false);
    });

    it('resolve Vitória (ES) sem confundir com Rio', async () => {
        const result = await obterMediaPassagem({
            destino: 'Vitória, Espírito Santo, Brasil',
            destinoMeta: {
                catalogId: 'BR-VIX-vitoria',
                iata: 'VIX',
                label: 'Vitória',
                countryCode: 'BR',
                countryName: 'Brasil',
                moedaSugerida: 'BRL',
                domestic: true,
            },
            dataPrevista: '2026-08-01',
            origemId: 'CNF',
        });

        expect(result.disponivel).toBe(true);
        expect(result.destino).toBe('Vitória');
        expect(result.valorMedioBrl).toBeGreaterThan(0);
        expect(result.onibus.disponivel).toBe(true);
        expect(result.onibus.buserDisponivel).toBe(true);
        expect(result.trem.disponivel).toBe(true);
        expect(result.trem.servico).toContain('Vitória-Minas');
    });
});
