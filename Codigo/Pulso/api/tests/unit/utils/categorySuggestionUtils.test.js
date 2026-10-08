const { similaridade, sugerirCategoriaId } = require('../../../src/utils/categorySuggestionUtils');

describe('categorySuggestionUtils', () => {
    describe('similaridade', () => {
        it('retorna 1 para descrições idênticas', () => {
            expect(similaridade('Uber', 'Uber')).toBe(1);
        });

        it('ignora acentuação e caixa', () => {
            expect(similaridade('Padaria', 'PADARIA')).toBe(1);
            expect(similaridade('Ônibus', 'onibus')).toBe(1);
        });

        it('retorna score alto para pequenas variações', () => {
            expect(similaridade('Uber para casa', 'Uber pra casa')).toBeGreaterThan(0.7);
        });

        it('retorna 0 para strings vazias ou totalmente diferentes', () => {
            expect(similaridade('', 'Uber')).toBe(0);
            expect(similaridade('Uber', 'Supermercado')).toBeLessThan(0.35);
        });
    });

    describe('sugerirCategoriaId', () => {
        const historico = [
            { descricao: 'Uber para o trabalho', categoriaId: 'cat-transporte' },
            { descricao: 'Uber para casa', categoriaId: 'cat-transporte' },
            { descricao: 'iFood almoço', categoriaId: 'cat-alimentacao' },
        ];

        it('sugere a categoria mais frequente entre descrições semelhantes', () => {
            expect(sugerirCategoriaId('Uber pro trampo', historico)).toBe('cat-transporte');
        });

        it('retorna null quando a descrição é muito curta', () => {
            expect(sugerirCategoriaId('Ub', historico)).toBeNull();
        });

        it('retorna null quando não há histórico', () => {
            expect(sugerirCategoriaId('Uber para o trabalho', [])).toBeNull();
        });

        it('retorna null quando nada ultrapassa o limiar de similaridade', () => {
            expect(sugerirCategoriaId('Assinatura Netflix', historico)).toBeNull();
        });

        it('ignora itens do histórico sem descrição ou categoria', () => {
            const historicoComLacunas = [
                { descricao: null, categoriaId: 'cat-x' },
                { descricao: 'Uber para o trabalho', categoriaId: null },
                ...historico,
            ];
            expect(sugerirCategoriaId('Uber para o trabalho', historicoComLacunas)).toBe(
                'cat-transporte'
            );
        });
    });
});
