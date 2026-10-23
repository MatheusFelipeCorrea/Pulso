const { formatDateKey, buildImportHash } = require('../../../src/utils/importHashUtils');

describe('importHashUtils', () => {
    describe('formatDateKey', () => {
        it('formata Date em YYYY-MM-DD', () => {
            expect(formatDateKey(new Date(2026, 7, 5))).toBe('2026-08-05');
        });

        it('aceita string parseável', () => {
            expect(formatDateKey('2026-01-15T12:00:00.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('retorna string vazia para data inválida', () => {
            expect(formatDateKey('não-é-data')).toBe('');
        });
    });

    describe('buildImportHash', () => {
        it('gera hash estável para a mesma combinação', () => {
            const a = buildImportHash(new Date(2026, 0, 10), 12.5, 'Uber Centro');
            const b = buildImportHash(new Date(2026, 0, 10), 12.5, 'Uber Centro');
            expect(a).toBe(b);
            expect(a).toHaveLength(64);
        });

        it('usa valor absoluto e normaliza descrição', () => {
            const positivo = buildImportHash(new Date(2026, 0, 10), 10, 'Café');
            const negativo = buildImportHash(new Date(2026, 0, 10), -10, 'café');
            expect(positivo).toBe(negativo);
        });

        it('trata descrição nula', () => {
            const hash = buildImportHash(new Date(2026, 0, 10), 1, null);
            expect(hash).toHaveLength(64);
        });

        it('muda o hash quando data ou valor mudam', () => {
            const base = buildImportHash(new Date(2026, 0, 10), 10, 'X');
            const outraData = buildImportHash(new Date(2026, 0, 11), 10, 'X');
            const outroValor = buildImportHash(new Date(2026, 0, 10), 11, 'X');
            expect(outraData).not.toBe(base);
            expect(outroValor).not.toBe(base);
        });
    });
});
