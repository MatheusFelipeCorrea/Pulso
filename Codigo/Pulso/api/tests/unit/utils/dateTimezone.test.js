const {
    TIMEZONE,
    HORA_PADRAO_LEMBRETE,
    formatDateOnly,
    parseVencimentoDate,
    addDays,
    startOfDayInTimezone,
    endOfDayInTimezone,
    todayInTimezone,
} = require('../../../src/utils/dateTimezone');

describe('dateTimezone', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('expõe constantes esperadas', () => {
        expect(TIMEZONE).toBe('America/Sao_Paulo');
        expect(HORA_PADRAO_LEMBRETE).toBe(10);
    });

    it('formatDateOnly retorna data no padrão YYYY-MM-DD', () => {
        const result = formatDateOnly('2026-01-02T12:00:00.000Z');
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(result).toBe('2026-01-02');
    });

    it('parseVencimentoDate fixa horário em 12:00:00.000Z', () => {
        const result = parseVencimentoDate('2026-01-02T12:00:00.000Z');
        expect(result.toISOString()).toBe('2026-01-02T12:00:00.000Z');
    });

    it('addDays adiciona dias mantendo referência de meio-dia UTC', () => {
        const result = addDays('2026-01-02T12:00:00.000Z', 2);
        expect(result.toISOString()).toBe('2026-01-04T12:00:00.000Z');
    });

    it('startOfDayInTimezone retorna início do dia em America/Sao_Paulo', () => {
        const result = startOfDayInTimezone('2026-01-02T12:00:00.000Z');
        expect(result.toISOString()).toBe('2026-01-02T03:00:00.000Z');
    });

    it('endOfDayInTimezone retorna fim do dia em America/Sao_Paulo', () => {
        const result = endOfDayInTimezone('2026-01-02T12:00:00.000Z');
        expect(result.toISOString()).toMatch(/^2026-01-0[23]T02:59:59\.999Z$/);
    });

    it('todayInTimezone acompanha relógio atual', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-09-10T12:00:00.000Z'));
        expect(todayInTimezone()).toBe(formatDateOnly(new Date()));
    });
});
