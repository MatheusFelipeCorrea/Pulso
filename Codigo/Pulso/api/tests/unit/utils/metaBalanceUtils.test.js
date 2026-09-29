const {
    calcSugestaoReservaEmergencia,
    MESES_RESERVA_EMERGENCIA_PADRAO,
} = require('../../../src/utils/metaBalanceUtils');

describe('metaBalanceUtils#calcSugestaoReservaEmergencia', () => {
    it('multiplica o gasto médio mensal pela quantidade padrão de meses', () => {
        expect(calcSugestaoReservaEmergencia(1000)).toBe(1000 * MESES_RESERVA_EMERGENCIA_PADRAO);
    });

    it('aceita uma quantidade de meses customizada', () => {
        expect(calcSugestaoReservaEmergencia(1000, 3)).toBe(3000);
        expect(calcSugestaoReservaEmergencia(1000, 12)).toBe(12000);
    });

    it('nunca retorna um valor negativo mesmo com entradas inválidas', () => {
        expect(calcSugestaoReservaEmergencia(-500, 6)).toBe(0);
        expect(calcSugestaoReservaEmergencia(1000, -3)).toBe(1000);
        expect(calcSugestaoReservaEmergencia(null)).toBe(0);
    });
});
