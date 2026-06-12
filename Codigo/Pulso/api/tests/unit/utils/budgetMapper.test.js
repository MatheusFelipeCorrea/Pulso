const {
    mapOrcamento,
    calcularStatusCategoria,
} = require('../../../src/utils/budgetMapper');

describe('budgetMapper', () => {
    it('mapOrcamento mapeia campos e converte limiteValor para número', () => {
        const entrada = {
            id: 'orc-1',
            categoriaId: 'cat-1',
            categoria: {
                nome: 'Alimentação',
                icone: 'utensils',
                cor: '#FFFFFF',
            },
            mesReferencia: '2026-06-01',
            limiteValor: '123.45',
            criadoEm: new Date('2026-06-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-06-02T12:00:00.000Z'),
        };

        expect(mapOrcamento(entrada)).toEqual({
            id: 'orc-1',
            categoriaId: 'cat-1',
            categoriaNome: 'Alimentação',
            categoriaIcone: 'utensils',
            categoriaCor: '#FFFFFF',
            mesReferencia: '2026-06-01',
            limiteValor: 123.45,
            criadoEm: entrada.criadoEm,
            atualizadoEm: entrada.atualizadoEm,
        });
    });

    it('mapOrcamento suporta categoria ausente', () => {
        const saida = mapOrcamento({
            id: 'orc-2',
            categoriaId: 'cat-2',
            mesReferencia: '2026-06-01',
            limiteValor: 0,
            criadoEm: null,
            atualizadoEm: null,
        });

        expect(saida.categoriaNome).toBeUndefined();
        expect(saida.categoriaIcone).toBeUndefined();
        expect(saida.categoriaCor).toBeUndefined();
        expect(saida.limiteValor).toBe(0);
    });

    it('calcularStatusCategoria retorna estourado quando >= 100', () => {
        expect(calcularStatusCategoria(100)).toBe('estourado');
        expect(calcularStatusCategoria(150)).toBe('estourado');
    });

    it('calcularStatusCategoria retorna alerta entre 80 e 99', () => {
        expect(calcularStatusCategoria(80)).toBe('alerta');
        expect(calcularStatusCategoria(99.9)).toBe('alerta');
    });

    it('calcularStatusCategoria retorna normal abaixo de 80', () => {
        expect(calcularStatusCategoria(79.9)).toBe('normal');
    });
});
