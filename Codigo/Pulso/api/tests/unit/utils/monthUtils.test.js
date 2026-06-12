const AppError = require('../../../src/utils/appError');
const {
    mesAtualString,
    mesReferenciaFromQuery,
    mesReferenciaFromBody,
    mesReferenciaToQuery,
    intervaloDoMes,
    mesAnterior,
    mesReferenciaIso,
} = require('../../../src/utils/monthUtils');

describe('monthUtils', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('mesAtualString retorna mês atual em YYYY-MM', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-08-15T12:00:00.000Z'));

        expect(mesAtualString()).toBe('2026-08');
    });

    it('mesReferenciaFromQuery converte query válida', () => {
        const result = mesReferenciaFromQuery('2026-02');

        expect(result).toEqual(new Date(2026, 1, 1));
    });

    it('mesReferenciaFromQuery usa mês atual quando vazio', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-10-01T15:00:00.000Z'));

        const result = mesReferenciaFromQuery();

        expect(result).toEqual(new Date(2026, 9, 1));
    });

    it('mesReferenciaFromQuery lança AppError para formato inválido', () => {
        expect(() => mesReferenciaFromQuery('2026/01')).toThrow(AppError);
        expect(() => mesReferenciaFromQuery('2026/01')).toThrow(
            'Formato de mês inválido. Use YYYY-MM'
        );
    });

    it('mesReferenciaFromBody converte valor válido YYYY-MM-01', () => {
        const result = mesReferenciaFromBody('2026-03-01');

        expect(result).toEqual(new Date(2026, 2, 1));
    });

    it('mesReferenciaFromBody lança AppError para formato inválido', () => {
        expect(() => mesReferenciaFromBody('2026-03-15')).toThrow(AppError);
        expect(() => mesReferenciaFromBody()).toThrow('Formato de mês inválido. Use YYYY-MM-01');
    });

    it('mesReferenciaToQuery converte Date para YYYY-MM', () => {
        expect(mesReferenciaToQuery(new Date(2026, 6, 1))).toBe('2026-07');
    });

    it('intervaloDoMes retorna início e fim do mês com horário final', () => {
        const { inicio, fim } = intervaloDoMes(new Date(2026, 1, 10));

        expect(inicio).toEqual(new Date(2026, 1, 1));
        expect(fim).toEqual(new Date(2026, 1, 28, 23, 59, 59, 999));
    });

    it('mesAnterior retorna primeiro dia do mês anterior', () => {
        expect(mesAnterior(new Date(2026, 0, 5))).toEqual(new Date(2025, 11, 1));
    });

    it('mesReferenciaIso converte Date para YYYY-MM-01', () => {
        expect(mesReferenciaIso(new Date(2026, 10, 20))).toBe('2026-11-01');
    });
});
