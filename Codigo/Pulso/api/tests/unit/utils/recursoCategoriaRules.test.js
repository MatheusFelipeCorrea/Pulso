const AppError = require('../../../src/utils/appError');
const {
    validarRecursoCategoria,
    normalize,
} = require('../../../src/utils/recursoCategoriaRules');

describe('recursoCategoriaRules', () => {
    it('normalize remove acentos, aplica lowercase e trim', () => {
        expect(normalize('  ALIMENTAÇÃO  ')).toBe('alimentacao');
    });

    it('não valida quando tipo não é DESPESA', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Transporte' }, 'RECEITA')
        ).not.toThrow();
    });

    it('não valida quando recurso é DINHEIRO', () => {
        expect(() =>
            validarRecursoCategoria('DINHEIRO', { nome: 'Qualquer' }, 'DESPESA')
        ).not.toThrow();
    });

    it('aceita VA para Alimentação e Compras', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Alimentação' }, 'DESPESA')
        ).not.toThrow();
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Compras' }, 'DESPESA')
        ).not.toThrow();
    });

    it('rejeita VA em categoria diferente', () => {
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Transporte' }, 'DESPESA')
        ).toThrow(AppError);
        expect(() =>
            validarRecursoCategoria('VA', { nome: 'Transporte' }, 'DESPESA')
        ).toThrow('VA só pode ser usado em despesas de Alimentação ou Compras');
    });

    it('rejeita VR fora de Alimentação', () => {
        expect(() =>
            validarRecursoCategoria('VR', { nome: 'Compras' }, 'DESPESA')
        ).toThrow('VR só pode ser usado em despesas de Alimentação');
    });

    it('rejeita VT em Alimentação', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Alimentação' }, 'DESPESA')
        ).toThrow('Não é possível usar VT para despesas de alimentação');
    });

    it('rejeita VT fora de Transporte', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Compras' }, 'DESPESA')
        ).toThrow('VT só pode ser usado em despesas de Transporte');
    });

    it('aceita VT para Transporte', () => {
        expect(() =>
            validarRecursoCategoria('VT', { nome: 'Transporte' }, 'DESPESA')
        ).not.toThrow();
    });
});
