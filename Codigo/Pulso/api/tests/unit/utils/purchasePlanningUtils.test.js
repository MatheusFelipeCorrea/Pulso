const {
    calcComprometimento,
    calcMesesParaComprar,
    nivelComprometimento,
    inferirCategoria,
} = require('../../../src/utils/purchasePlanningUtils');

describe('purchasePlanningUtils', () => {
    it('calcula comprometimento da parcela', () => {
        const result = calcComprometimento(4000, 12, 5000);
        expect(result.parcela).toBeCloseTo(333.33, 1);
        expect(result.percentual).toBe(6.7);
        expect(result.nivel).toBe('saudavel');
    });

    it('marca nível arriscado acima de 30%', () => {
        expect(nivelComprometimento(35)).toBe('arriscado');
        expect(nivelComprometimento(25)).toBe('atencao');
    });

    it('calcula meses para comprar', () => {
        expect(calcMesesParaComprar(4000, 500)).toBe(8);
        expect(calcMesesParaComprar(4000, 0)).toBeNull();
    });

    it('infere categoria pelo nome', () => {
        expect(inferirCategoria('Notebook Gamer')).toBe('TECNOLOGIA');
        expect(inferirCategoria('iPhone 15')).toBe('ELETRONICOS');
    });
});
