const {
    calcularScore,
    calcularProjecoes,
    calcularAlertas,
    resumoFallback,
} = require('../../../src/services/insightEngines');

describe('insightEngines', () => {
    const ctxBase = {
        mesReferencia: '2026-11',
        fluxoMes: { receitas: 5000, despesas: 3000 },
        orcamentoStatus: [
            { categoria: 'Alimentação', percentualUsado: 40, limite: 1000, gasto: 400 },
        ],
        metas: [{ id: 'm1', nome: 'Viagem', progresso: 50, prazo: '2027-01-15' }],
        variacaoCategorias: [
            { categoria: 'Alimentação', percentual: 12, atual: 800, anterior: 700 },
        ],
        mesesRecent: [
            { mes: '2026-09', receitas: 4800, despesas: 3100 },
            { mes: '2026-10', receitas: 5000, despesas: 2900 },
            { mes: '2026-11', receitas: 5000, despesas: 3000 },
        ],
        recursosMes: { VA: 200 },
        config: { vaValor: 600 },
    };

    it('calcula score Bom com fluxo saudável', () => {
        const score = calcularScore(ctxBase);
        expect(score.valor).toBeGreaterThanOrEqual(61);
        expect(score.label).toBe('Bom');
        expect(score.checklist.length).toBeGreaterThan(2);
    });

    it('monta projeções nos 3 cenários', () => {
        const { projecoes, diasAteNegativo } = calcularProjecoes(ctxBase);
        expect(projecoes).toHaveLength(3);
        expect(projecoes.map((p) => p.id)).toEqual(['otimista', 'atual', 'pessimista']);
        expect(projecoes[0].acumulado['12']).toBeGreaterThan(projecoes[2].acumulado['12']);
        expect(diasAteNegativo).toBeNull();
    });

    it('gera alertas de variação e VA', () => {
        const alertas = calcularAlertas({
            ...ctxBase,
            variacaoCategorias: [{ categoria: 'Lazer', percentual: 40, atual: 400, anterior: 280 }],
            recursosMes: { VA: 400 },
            config: { vaValor: 500 },
        });
        expect(alertas.some((a) => a.tipo === 'variacao')).toBe(true);
    });

    it('monta resumo fallback sem inventar', () => {
        const texto = resumoFallback(ctxBase);
        expect(texto).toContain('2026-11');
        expect(texto).toContain('Alimentação');
    });
});
