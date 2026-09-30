const {
    getSeasonalAdjustment,
    applySeasonalPrice,
    buildSeasonalMessage,
} = require('../../../src/constants/tripSeasonalPricing');

describe('tripSeasonalPricing', () => {
    it('aumenta estimativa em férias de julho', () => {
        const adjustment = getSeasonalAdjustment({
            departureDate: '2026-07-10',
            returnDate: '2026-07-17',
            mode: 'flight',
            domestic: true,
        });

        expect(adjustment.tendencia).toBe('alta');
        expect(adjustment.periodo).toBe('Férias escolares de julho');
        expect(adjustment.fator).toBeGreaterThan(1);
        expect(applySeasonalPrice(1000, adjustment)).toBeGreaterThan(1000);
    });

    it('reduz estimativa na black friday', () => {
        const adjustment = getSeasonalAdjustment({
            departureDate: '2026-11-27',
            returnDate: '2026-11-30',
            mode: 'flight',
            domestic: true,
        });

        expect(adjustment.tendencia).toBe('baixa');
        expect(adjustment.periodo).toBe('Black Friday');
        expect(adjustment.fator).toBeLessThan(1);
        expect(applySeasonalPrice(1000, adjustment)).toBeLessThan(1000);
    });

    it('mantém fator neutro fora de janelas sazonais', () => {
        const adjustment = getSeasonalAdjustment({
            departureDate: '2026-03-10',
            returnDate: '2026-03-17',
            mode: 'bus',
            domestic: true,
        });

        expect(adjustment.fator).toBe(1);
        expect(adjustment.periodo).toBeNull();
    });

    it('prioriza alta temporada sobre desconto', () => {
        const adjustment = getSeasonalAdjustment({
            departureDate: '2026-12-28',
            returnDate: '2027-01-03',
            mode: 'flight',
            domestic: true,
        });

        expect(adjustment.tendencia).toBe('alta');
        expect(adjustment.fator).toBeGreaterThan(1);
    });

    it('monta mensagem com contexto sazonal', () => {
        const message = buildSeasonalMessage('Estimativa base.', {
            fator: 1.2,
            periodo: 'Férias escolares de julho',
            tendencia: 'alta',
        });

        expect(message).toContain('Férias escolares de julho');
        expect(message).toContain('20%');
    });
});
