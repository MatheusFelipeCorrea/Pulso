const {
    calcComprometimento,
    calcMesesParaComprar,
    nivelComprometimento,
    inferirCategoria,
    DICAS,
    selecionarDicasDoDia,
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
        expect(inferirCategoria('Notebook Gamer')).toBe('ELETRONICOS');
        expect(inferirCategoria('iPhone 15')).toBe('ELETRONICOS');
        expect(inferirCategoria('Geladeira Frost Free')).toBe('CASA_ELETRODOMESTICOS');
        expect(inferirCategoria('Tênis de corrida')).toBe('VESTUARIO');
        expect(inferirCategoria('Bicicleta aro 29')).toBe('VEICULO');
        expect(inferirCategoria('Fone de ouvido bluetooth')).toBe('ACESSORIOS');
        expect(inferirCategoria('Presente misterioso')).toBe('OUTROS');
    });

    it('seleciona sempre a quantidade pedida de dicas', () => {
        const resultado = selecionarDicasDoDia(DICAS, 4, '2026-07-10');
        expect(resultado).toHaveLength(4);
        resultado.forEach((dica) => expect(DICAS).toContainEqual(dica));
    });

    it('roda as dicas de forma diferente em dias diferentes', () => {
        const dia1 = selecionarDicasDoDia(DICAS, 4, '2026-01-01');
        const dia2 = selecionarDicasDoDia(DICAS, 4, '2026-01-02');
        expect(dia1).not.toEqual(dia2);
    });

    it('é determinístico para a mesma data', () => {
        const a = selecionarDicasDoDia(DICAS, 4, '2026-03-15');
        const b = selecionarDicasDoDia(DICAS, 4, '2026-03-15');
        expect(a).toEqual(b);
    });

    it('nunca retorna mais dicas do que as disponíveis', () => {
        expect(selecionarDicasDoDia(DICAS, 100, '2026-05-05')).toHaveLength(DICAS.length);
        expect(selecionarDicasDoDia([], 4, '2026-05-05')).toEqual([]);
    });
});
