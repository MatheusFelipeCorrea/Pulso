const { mapLembrete } = require('../../../src/utils/reminderMapper');

describe('reminderMapper', () => {
    it('mapLembrete mapeia campos com labels de antecedência e categoria', () => {
        const lembrete = {
            id: 'lem-1',
            titulo: 'Pagar aluguel',
            valor: '1200',
            dataVencimento: new Date('2026-06-10T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'ALUGUEL',
            pago: 0,
            googleEventId: 'g-1',
            sincronizado: true,
            repetirMensal: 1,
            diaRecorrencia: 10,
            lembreteTemplateId: 'tpl-1',
            criadoEm: new Date('2026-06-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-06-02T12:00:00.000Z'),
        };

        expect(mapLembrete(lembrete)).toEqual({
            id: 'lem-1',
            titulo: 'Pagar aluguel',
            valor: '1200.00',
            dataVencimento: '2026-06-10T12:00:00.000Z',
            antecedencia: 'UM_DIA',
            antecedenciaLabel: '1 dia antes',
            categoria: 'ALUGUEL',
            categoriaLabel: 'Aluguel',
            pago: false,
            googleEventId: 'g-1',
            sincronizado: true,
            repetirMensal: true,
            diaRecorrencia: 10,
            lembreteTemplateId: 'tpl-1',
            criadoEm: '2026-06-01T12:00:00.000Z',
            atualizadoEm: '2026-06-02T12:00:00.000Z',
        });
    });

    it('mapLembrete usa tipo quando categoria não existe e aplica fallback de labels', () => {
        const lembrete = {
            id: 'lem-2',
            titulo: 'Item qualquer',
            valor: null,
            dataVencimento: new Date('2026-07-10T12:00:00.000Z'),
            antecedencia: 'PERSONALIZADO',
            tipo: 'NAO_EXISTE',
            pago: true,
            googleEventId: null,
            sincronizado: false,
            repetirMensal: 0,
            criadoEm: new Date('2026-07-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-07-02T12:00:00.000Z'),
        };

        const result = mapLembrete(lembrete);

        expect(result.valor).toBeNull();
        expect(result.antecedenciaLabel).toBe('PERSONALIZADO');
        expect(result.categoria).toBe('OUTRO');
        expect(result.categoriaLabel).toBe('Outro');
        expect(result.diaRecorrencia).toBeNull();
        expect(result.lembreteTemplateId).toBeNull();
        expect(result.repetirMensal).toBe(false);
    });
});
