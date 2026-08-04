const AppError = require('../../../src/utils/appError');
const {
    validarRecursoCategoria,
    normalize,
    inferirGrupoBeneficioPorNome,
    resolverGrupoBeneficio,
} = require('../../../src/utils/recursoCategoriaRules');

describe('recursoCategoriaRules', () => {
    it('normalize remove acentos, aplica lowercase e trim', () => {
        expect(normalize('  ALIMENTAÇÃO  ')).toBe('alimentacao');
    });

    it('inferirGrupoBeneficioPorNome reconhece só aliases exatos óbvios', () => {
        expect(inferirGrupoBeneficioPorNome('Mercado')).toBe('COMPRAS');
        expect(inferirGrupoBeneficioPorNome('supermercado')).toBe('COMPRAS');
        expect(inferirGrupoBeneficioPorNome('iFood')).toBe('ALIMENTACAO');
        expect(inferirGrupoBeneficioPorNome('Uber')).toBe('TRANSPORTE');
        expect(inferirGrupoBeneficioPorNome('Shopping')).toBeNull();
        expect(inferirGrupoBeneficioPorNome('Meu Mercado')).toBeNull();
    });

    it('resolverGrupoBeneficio prioriza campo estrutural', () => {
        expect(
            resolverGrupoBeneficio({ nome: 'Shopping', grupoBeneficio: 'COMPRAS' })
        ).toBe('COMPRAS');
    });

    it('não valida quando tipo não é DESPESA', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Transporte' }, 'RECEITA')
        ).not.toThrow();
    });

    it('não valida transferências (RF-140, sem categoria)', () => {
        expect(() => validarRecursoCategoria('VT', null, 'TRANSFERENCIA')).not.toThrow();
    });

    it('não valida quando recurso é DINHEIRO', () => {
        expect(() =>
            validarRecursoCategoria('DINHEIRO', { nome: 'Qualquer' }, 'DESPESA')
        ).not.toThrow();
    });

    it('aceita VA para Alimentação e Compras padrão', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Alimentação' }, 'DESPESA')
        ).not.toThrow();
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Compras' }, 'DESPESA')
        ).not.toThrow();
    });

    it('aceita VA para categoria custom com grupoBeneficio', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Relógio', grupoBeneficio: 'COMPRAS' }, 'DESPESA')
        ).not.toThrow();
    });

    it('aceita VA para alias exato Mercado sem grupo explícito', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Mercado' }, 'DESPESA')
        ).not.toThrow();
    });

    it('rejeita VA em Shopping sem preset', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Shopping' }, 'DESPESA')
        ).toThrow(/não aceita Vale Alimentação/);
    });

    it('rejeita VA em categoria diferente', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Transporte' }, 'DESPESA')
        ).toThrow(AppError);
    });

    it('rejeita VR fora de Alimentação', () => {
        expect(() =>
            validarRecursoCategoria('VR', { nome: 'Compras' }, 'DESPESA')
        ).toThrow(/não aceita Vale Refeição/);
    });

    it('rejeita VT em Alimentação', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Alimentação' }, 'DESPESA')
        ).toThrow(/VT não vale para alimentação/);
    });

    it('rejeita VT fora de Transporte', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Compras' }, 'DESPESA')
        ).toThrow(/não aceita Vale Transporte/);
    });

    it('aceita VT para Transporte', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Transporte' }, 'DESPESA')
        ).not.toThrow();
    });
});
