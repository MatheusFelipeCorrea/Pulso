const { calcularValorRollover } = require('../../../src/utils/budgetRolloverUtils');

describe('budgetRolloverUtils', () => {
    it('retorna 0 quando não há orçamento anterior', () => {
        expect(calcularValorRollover(null, 100)).toBe(0);
    });

    it('retorna 0 quando o rollover estava desativado no mês anterior', () => {
        const anterior = { rolloverAtivo: false, limiteValor: 500 };
        expect(calcularValorRollover(anterior, 100)).toBe(0);
    });

    it('retorna a sobra quando houve gasto menor que o limite', () => {
        const anterior = { rolloverAtivo: true, limiteValor: 500 };
        expect(calcularValorRollover(anterior, 300)).toBe(200);
    });

    it('retorna 0 quando o mês anterior estourou o limite (sobra negativa)', () => {
        const anterior = { rolloverAtivo: true, limiteValor: 500 };
        expect(calcularValorRollover(anterior, 600)).toBe(0);
    });

    it('retorna o limite cheio quando não houve gasto', () => {
        const anterior = { rolloverAtivo: true, limiteValor: 500 };
        expect(calcularValorRollover(anterior, 0)).toBe(500);
    });
});
