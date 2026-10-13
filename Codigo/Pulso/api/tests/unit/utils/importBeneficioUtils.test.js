const {
    AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
    categoriaCompativelImportacao,
    encontrarCategoriaAjusteSaldo,
    encontrarCategoriaBeneficio,
    isAjusteSaldoImportacao,
    isOrigemBeneficio,
    isOrigemComSaldoExtrato,
} = require('../../../src/utils/importBeneficioUtils');

const cats = [
    { tipo: 'RECEITA', nome: 'Salário', grupoBeneficio: null },
    { tipo: 'DESPESA', nome: 'Alimentação', grupoBeneficio: 'ALIMENTACAO' },
    { tipo: 'DESPESA', nome: 'Compras', grupoBeneficio: 'COMPRAS' },
    { tipo: 'DESPESA', nome: 'Transporte', grupoBeneficio: 'TRANSPORTE' },
    { tipo: 'DESPESA', nome: 'Outros' },
];

describe('importBeneficioUtils', () => {
    it('origens e ajuste', () => {
        expect(isAjusteSaldoImportacao(AJUSTE_SALDO_IMPORTACAO_DESCRICAO)).toBe(true);
        expect(isOrigemBeneficio('VA')).toBe(true);
        expect(isOrigemComSaldoExtrato('CONTA')).toBe(true);
        expect(isOrigemComSaldoExtrato('DINHEIRO')).toBe(false);
    });

    it('compatibilidade de categoria', () => {
        expect(categoriaCompativelImportacao(null, 'VA', 'DESPESA')).toBe(false);
        expect(categoriaCompativelImportacao(cats[1], 'DINHEIRO', 'DESPESA')).toBe(true);
        expect(categoriaCompativelImportacao(cats[0], 'VA', 'RECEITA')).toBe(true);
        expect(categoriaCompativelImportacao(cats[1], 'VR', 'DESPESA')).toBe(true);
        expect(categoriaCompativelImportacao(cats[2], 'VR', 'DESPESA')).toBe(false);
        expect(categoriaCompativelImportacao(cats[2], 'VA', 'DESPESA')).toBe(true);
        expect(categoriaCompativelImportacao(cats[3], 'VT', 'DESPESA')).toBe(true);
    });

    it('encontra categoria de benefício e ajuste', () => {
        expect(encontrarCategoriaBeneficio(cats, 'X', 'DESPESA')).toBeNull();
        expect(encontrarCategoriaBeneficio(cats, 'VR', 'RECEITA').nome).toBe('Salário');
        expect(encontrarCategoriaBeneficio(cats, 'VR', 'DESPESA').nome).toBe('Alimentação');
        expect(encontrarCategoriaBeneficio(cats, 'VA', 'DESPESA').nome).toBe('Alimentação');
        expect(encontrarCategoriaBeneficio(cats, 'VT', 'DESPESA').nome).toBe('Transporte');
        expect(encontrarCategoriaAjusteSaldo(cats, 'CONTA', 'RECEITA').nome).toBe('Salário');
        expect(encontrarCategoriaAjusteSaldo(cats, 'CONTA', 'DESPESA').nome).toBe('Outros');
        expect(encontrarCategoriaAjusteSaldo(cats, 'VA', 'DESPESA').nome).toBe('Alimentação');
    });

    it('usa fallbacks por nome e receita genérica', () => {
        const soNomes = [
            { tipo: 'RECEITA', nome: 'Freelance' },
            { tipo: 'DESPESA', nome: 'Alimentacao' },
            { tipo: 'DESPESA', nome: 'Transporte' },
        ];
        expect(encontrarCategoriaBeneficio(soNomes, 'VR', 'DESPESA').nome).toBe('Alimentacao');
        expect(encontrarCategoriaBeneficio(soNomes, 'VA', 'DESPESA').nome).toBe('Alimentacao');
        expect(encontrarCategoriaBeneficio(soNomes, 'VT', 'DESPESA').nome).toBe('Transporte');
        expect(
            encontrarCategoriaBeneficio([{ tipo: 'RECEITA', nome: 'Outros' }], 'VA', 'RECEITA').nome
        ).toBe('Outros');
        expect(
            encontrarCategoriaAjusteSaldo([{ tipo: 'RECEITA', nome: 'Renda' }], 'CONTA', 'RECEITA')
                .nome
        ).toBe('Renda');
        expect(
            encontrarCategoriaAjusteSaldo([{ tipo: 'DESPESA', nome: 'Lazer' }], 'CONTA', 'DESPESA')
                .nome
        ).toBe('Lazer');
        expect(categoriaCompativelImportacao(cats[1], 'VA', 'DESPESA')).toBe(true);
        expect(categoriaCompativelImportacao({ tipo: 'DESPESA', nome: 'X' }, 'VT', 'DESPESA')).toBe(
            false
        );
    });
});
