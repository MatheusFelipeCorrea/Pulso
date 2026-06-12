const {
    periodoAtual,
    intervaloDoPeriodo,
    startOfDay,
    addDays,
    calcularProximaRecarga,
} = require('../../../src/utils/periodUtils');

describe('periodUtils', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('periodoAtual retorna período atual em YYYY-MM', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-06-12T12:00:00.000Z'));

        expect(periodoAtual()).toBe('2026-06');
    });

    it('intervaloDoPeriodo retorna intervalo correto do período informado', () => {
        const { inicio, fim } = intervaloDoPeriodo('2026-02');

        expect(inicio).toEqual(new Date(2026, 1, 1));
        expect(fim).toEqual(new Date(2026, 1, 28, 23, 59, 59, 999));
    });

    it('intervaloDoPeriodo usa período atual quando não informado', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-11-05T12:00:00.000Z'));

        const { inicio, fim } = intervaloDoPeriodo();

        expect(inicio).toEqual(new Date(2026, 10, 1));
        expect(fim).toEqual(new Date(2026, 10, 30, 23, 59, 59, 999));
    });

    it('startOfDay normaliza horário para meia-noite', () => {
        const result = startOfDay(new Date('2026-06-12T19:45:00.000Z'));

        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it('addDays adiciona dias e retorna início do dia', () => {
        const result = addDays(new Date('2026-06-12T19:45:00.000Z'), 3);

        expect(result).toEqual(startOfDay(new Date('2026-06-15T19:45:00.000Z')));
    });

    it('calcularProximaRecarga retorna período encerrado para mês passado', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

        const result = calcularProximaRecarga('2026-05');

        expect(result).toEqual({
            isMesAtual: false,
            diasRestantes: 0,
            progresso: 100,
            dataReset: new Date(2026, 5, 1).toISOString(),
            status: 'Período encerrado',
        });
    });

    it('calcularProximaRecarga retorna período futuro para mês adiante', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-06-15T12:00:00.000Z'));

        const result = calcularProximaRecarga('2026-07');

        expect(result).toEqual({
            isMesAtual: false,
            diasRestantes: 0,
            progresso: 0,
            dataReset: new Date(2026, 6, 1).toISOString(),
            status: 'Período futuro',
        });
    });

    it('calcularProximaRecarga calcula countdown e progresso no mês atual', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-05-15T12:00:00.000Z'));

        const result = calcularProximaRecarga('2026-05');

        expect(result).toEqual({
            isMesAtual: true,
            diasRestantes: 17,
            progresso: 45,
            dataReset: new Date(2026, 5, 1).toISOString(),
            status: 'Recarga em 17 dias',
        });
    });

    it('calcularProximaRecarga usa status de recarga amanhã', () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-05-31T10:00:00.000Z'));

        const result = calcularProximaRecarga('2026-05');

        expect(result.isMesAtual).toBe(true);
        expect(result.diasRestantes).toBe(1);
        expect(result.status).toBe('Recarga amanhã');
    });
});
