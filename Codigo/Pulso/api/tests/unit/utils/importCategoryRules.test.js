const {
    encontrarCategoriaPorRegra,
    matchesGroup,
} = require('../../../src/utils/importCategoryRules');
const { KEYWORD_GROUPS } = require('../../../src/utils/importCategoryKeywordGroups');

describe('importCategoryRules', () => {
    const categorias = [
        { id: 'salario', nome: 'Salário', tipo: 'RECEITA' },
        { id: 'compras', nome: 'Compras', tipo: 'DESPESA', grupoBeneficio: 'COMPRAS' },
        { id: 'alimentacao', nome: 'Alimentação', tipo: 'DESPESA', grupoBeneficio: 'ALIMENTACAO' },
        { id: 'transporte', nome: 'Transporte', tipo: 'DESPESA', grupoBeneficio: 'TRANSPORTE' },
        { id: 'saude', nome: 'Saúde', tipo: 'DESPESA' },
        { id: 'beleza', nome: 'Beleza', tipo: 'DESPESA' },
        { id: 'lazer', nome: 'Lazer', tipo: 'DESPESA' },
        { id: 'outros-d', nome: 'Outros', tipo: 'DESPESA' },
        { id: 'outros-r', nome: 'Outros', tipo: 'RECEITA' },
    ];

    it('mapeia SUPERMERCADO para Compras', () => {
        expect(
            encontrarCategoriaPorRegra('PGTO SUPERMERCADO EXTRA', categorias, 'DESPESA')
        ).toBe('compras');
    });

    it('mapeia supermercado sem word boundary quebrado', () => {
        expect(
            encontrarCategoriaPorRegra('COMPRA SUPERMERCADO DIA', categorias, 'DESPESA')
        ).toBe('compras');
    });

    it('mapeia sorveteria para Alimentação', () => {
        expect(encontrarCategoriaPorRegra('PGTO SORVETERIA BANDEIRANTES', categorias, 'DESPESA')).toBe(
            'alimentacao'
        );
    });

    it('mapeia panificadora para Alimentação', () => {
        expect(
            encontrarCategoriaPorRegra('DEBITO PANIFICADORA SAO JOSE', categorias, 'DESPESA')
        ).toBe('alimentacao');
    });

    it('mapeia confeitaria e padaria para Alimentação', () => {
        expect(encontrarCategoriaPorRegra('CONFEITARIA DOCE SABOR', categorias, 'DESPESA')).toBe(
            'alimentacao'
        );
        expect(encontrarCategoriaPorRegra('PADARIA CENTRAL', categorias, 'DESPESA')).toBe('alimentacao');
    });

    it('mapeia ifood para Alimentação', () => {
        expect(encontrarCategoriaPorRegra('IFOOD *RESTAURANTE', categorias, 'DESPESA')).toBe(
            'alimentacao'
        );
    });

    it('mapeia uber (sem eats) para Transporte', () => {
        expect(encontrarCategoriaPorRegra('UBER TRIP SAO PAULO', categorias, 'DESPESA')).toBe(
            'transporte'
        );
    });

    it('mapeia uber eats para Alimentação', () => {
        expect(encontrarCategoriaPorRegra('UBER EATS PEDIDO', categorias, 'DESPESA')).toBe(
            'alimentacao'
        );
        expect(encontrarCategoriaPorRegra('UBEREATS*RESTAURANT', categorias, 'DESPESA')).toBe(
            'alimentacao'
        );
    });

    it('mapeia barbearia para Beleza, não Alimentação', () => {
        expect(encontrarCategoriaPorRegra('BARBEARIA DO JOAO', categorias, 'DESPESA')).toBe('beleza');
    });

    it('mapeia pix recebido para Salário', () => {
        expect(encontrarCategoriaPorRegra('PIX RECEBIDO JOAO', categorias, 'RECEITA')).toBe(
            'salario'
        );
    });

    it('respeita tipo da transação', () => {
        expect(encontrarCategoriaPorRegra('PIX RECEBIDO', categorias, 'DESPESA')).toBeNull();
    });

    it('retorna null quando não há match', () => {
        expect(encontrarCategoriaPorRegra('XYZ DESCONHECIDO 999', categorias, 'DESPESA')).toBeNull();
    });

    it('possui grupos extensos de keywords', () => {
        const alimentacao = KEYWORD_GROUPS.find((group) => group.id === 'alimentacao');
        expect(alimentacao.keywords.length + alimentacao.suffixes.length).toBeGreaterThan(80);
    });

    it('detecta sufixos de estabelecimento alimentício', () => {
        const alimentacao = KEYWORD_GROUPS.find((group) => group.id === 'alimentacao');
        expect(matchesGroup('deb auto sorveteria central', alimentacao)).toBe(true);
        expect(matchesGroup('deb auto panificadora real', alimentacao)).toBe(true);
    });
});
