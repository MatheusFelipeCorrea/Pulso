const {
    isOrigemComSaldoExtrato,
    encontrarCategoriaAjusteSaldo,
    categoriaCompativelImportacao,
} = require('../../../src/utils/importBeneficioUtils');

describe('importBeneficioUtils', () => {
    const categorias = [
        { id: 1, nome: 'Salário', tipo: 'RECEITA' },
        { id: 2, nome: 'Outros', tipo: 'DESPESA' },
        { id: 3, nome: 'Alimentação', tipo: 'DESPESA', grupoBeneficio: 'ALIMENTACAO' },
    ];

    describe('isOrigemComSaldoExtrato', () => {
        it('inclui CONTA e benefícios', () => {
            expect(isOrigemComSaldoExtrato('CONTA')).toBe(true);
            expect(isOrigemComSaldoExtrato('VR')).toBe(true);
            expect(isOrigemComSaldoExtrato('OFX')).toBe(false);
        });
    });

    describe('encontrarCategoriaAjusteSaldo', () => {
        it('usa categoria de receita genérica para CONTA', () => {
            const cat = encontrarCategoriaAjusteSaldo(categorias, 'CONTA', 'RECEITA');
            expect(cat.nome).toBe('Salário');
        });

        it('usa categoria de despesa genérica para CONTA', () => {
            const cat = encontrarCategoriaAjusteSaldo(categorias, 'CONTA', 'DESPESA');
            expect(cat.nome).toBe('Outros');
        });

        it('usa categoria de benefício para VR', () => {
            const cat = encontrarCategoriaAjusteSaldo(categorias, 'VR', 'DESPESA');
            expect(cat.nome).toBe('Alimentação');
        });
    });

    describe('categoriaCompativelImportacao', () => {
        it('rejeita Outros em VR despesa', () => {
            expect(categoriaCompativelImportacao(categorias[1], 'VR', 'DESPESA')).toBe(false);
        });

        it('aceita Alimentação em VR despesa', () => {
            expect(categoriaCompativelImportacao(categorias[2], 'VR', 'DESPESA')).toBe(true);
        });

        it('aceita qualquer receita em VR', () => {
            expect(categoriaCompativelImportacao(categorias[0], 'VR', 'RECEITA')).toBe(true);
        });
    });
});
