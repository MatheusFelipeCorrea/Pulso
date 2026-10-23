const { splitEqual, validarSomaPersonalizada } = require('../../../src/utils/expenseSplitUtils');

describe('expenseSplitUtils', () => {
    describe('splitEqual', () => {
        it('divide um valor exato igualmente', () => {
            expect(splitEqual(10, 2)).toEqual([5, 5]);
        });

        it('distribui o resto de forma determinística (primeiros participantes recebem o centavo extra)', () => {
            expect(splitEqual(100, 3)).toEqual([33.34, 33.33, 33.33]);
        });

        it('retorna array vazio quando não há participantes', () => {
            expect(splitEqual(100, 0)).toEqual([]);
        });

        it('a soma das partes sempre bate com o valor total (sem perda de centavos)', () => {
            const partes = splitEqual(99.97, 7);
            const soma = partes.reduce((acc, v) => acc + Math.round(v * 100), 0);
            expect(soma).toBe(Math.round(99.97 * 100));
        });
    });

    describe('validarSomaPersonalizada', () => {
        it('aceita quando a soma bate exatamente com o total', () => {
            expect(validarSomaPersonalizada(100, [33.34, 33.33, 33.33])).toBe(true);
        });

        it('rejeita quando a soma não bate com o total', () => {
            expect(validarSomaPersonalizada(100, [50, 40])).toBe(false);
        });

        it('não é enganado por erros de ponto flutuante (0.1 + 0.2)', () => {
            expect(validarSomaPersonalizada(0.3, [0.1, 0.2])).toBe(true);
        });
    });
});
