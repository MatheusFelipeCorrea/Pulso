const {
    isOrigemComSaldoExtrato,
    isOrigemBeneficio,
    isAjusteSaldoImportacao,
    encontrarCategoriaAjusteSaldo,
    encontrarCategoriaBeneficio,
    categoriaCompativelImportacao,
    AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
} = require('../../../src/utils/importBeneficioUtils');

describe('importBeneficioUtils', () => {
    const categorias = [
        { id: 1, nome: 'Salário', tipo: 'RECEITA' },
        { id: 2, nome: 'Outros', tipo: 'DESPESA' },
        { id: 3, nome: 'Alimentação', tipo: 'DESPESA', grupoBeneficio: 'ALIMENTACAO' },
        { id: 4, nome: 'Compras', tipo: 'DESPESA', grupoBeneficio: 'COMPRAS' },
        { id: 5, nome: 'Transporte', tipo: 'DESPESA', grupoBeneficio: 'TRANSPORTE' },
    ];

    describe('isOrigemComSaldoExtrato / isOrigemBeneficio', () => {
        it('inclui CONTA e benefícios', () => {
            expect(isOrigemComSaldoExtrato('CONTA')).toBe(true);
            expect(isOrigemComSaldoExtrato('VR')).toBe(true);
            expect(isOrigemComSaldoExtrato('VA')).toBe(true);
            expect(isOrigemComSaldoExtrato('VT')).toBe(true);
            expect(isOrigemComSaldoExtrato('OFX')).toBe(false);
            expect(isOrigemBeneficio('CONTA')).toBe(false);
            expect(isOrigemBeneficio('VT')).toBe(true);
        });
    });

    describe('isAjusteSaldoImportacao', () => {
        it('reconhece a descrição canônica', () => {
            expect(isAjusteSaldoImportacao(AJUSTE_SALDO_IMPORTACAO_DESCRICAO)).toBe(true);
            expect(isAjusteSaldoImportacao('outra')).toBe(false);
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

        it('usa categoria de benefício para VR / VA / VT', () => {
            expect(encontrarCategoriaAjusteSaldo(categorias, 'VR', 'DESPESA').nome).toBe('Alimentação');
            expect(encontrarCategoriaAjusteSaldo(categorias, 'VA', 'DESPESA').nome).toBe('Alimentação');
            expect(encontrarCategoriaAjusteSaldo(categorias, 'VT', 'DESPESA').nome).toBe('Transporte');
        });

        it('retorna null para origem benefício desconhecida', () => {
            expect(encontrarCategoriaBeneficio(categorias, 'XYZ', 'DESPESA')).toBeNull();
        });
    });

    describe('categoriaCompativelImportacao', () => {
        it('rejeita Outros em VR despesa', () => {
            expect(categoriaCompativelImportacao(categorias[1], 'VR', 'DESPESA')).toBe(false);
        });

        it('aceita Alimentação em VR despesa', () => {
            expect(categoriaCompativelImportacao(categorias[2], 'VR', 'DESPESA')).toBe(true);
        });

        it('aceita Compras em VA e rejeita em VR', () => {
            expect(categoriaCompativelImportacao(categorias[3], 'VA', 'DESPESA')).toBe(true);
            expect(categoriaCompativelImportacao(categorias[3], 'VR', 'DESPESA')).toBe(false);
        });

        it('aceita Transporte em VT', () => {
            expect(categoriaCompativelImportacao(categorias[4], 'VT', 'DESPESA')).toBe(true);
            expect(categoriaCompativelImportacao(categorias[2], 'VT', 'DESPESA')).toBe(false);
        });

        it('aceita qualquer receita em benefício e rejeita tipo errado', () => {
            expect(categoriaCompativelImportacao(categorias[0], 'VR', 'RECEITA')).toBe(true);
            expect(categoriaCompativelImportacao(categorias[0], 'VR', 'DESPESA')).toBe(false);
            expect(categoriaCompativelImportacao(null, 'VR', 'DESPESA')).toBe(false);
        });

        it('aceita qualquer categoria em origem não-benefício', () => {
            expect(categoriaCompativelImportacao(categorias[1], 'CONTA', 'DESPESA')).toBe(true);
        });
    });
});
