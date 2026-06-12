const { mapDivida } = require('../../../src/utils/debtMapper');

describe('debtMapper', () => {
    it('mapDivida mapeia e formata campos corretamente', () => {
        const divida = {
            id: 'div-1',
            direcao: 'A_RECEBER',
            nomePessoa: 'Maria',
            valor: '150.5',
            dataEmprestimo: new Date('2026-01-10T12:00:00.000Z'),
            prazoDevolucao: new Date('2026-02-10T12:00:00.000Z'),
            observacao: 'Teste',
            quitada: 1,
            dataQuitacao: new Date('2026-02-01T12:00:00.000Z'),
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-02T12:00:00.000Z'),
        };

        expect(mapDivida(divida)).toEqual({
            id: 'div-1',
            direcao: 'A_RECEBER',
            nomePessoa: 'Maria',
            valor: '150.50',
            dataEmprestimo: '2026-01-10T12:00:00.000Z',
            prazoDevolucao: '2026-02-10T12:00:00.000Z',
            observacao: 'Teste',
            quitada: true,
            dataQuitacao: '2026-02-01T12:00:00.000Z',
            criadoEm: '2026-01-01T12:00:00.000Z',
            atualizadoEm: '2026-01-02T12:00:00.000Z',
        });
    });

    it('mapDivida mantém campos opcionais como null quando ausentes', () => {
        const divida = {
            id: 'div-2',
            direcao: 'A_PAGAR',
            nomePessoa: 'João',
            valor: 10,
            dataEmprestimo: new Date('2026-03-10T12:00:00.000Z'),
            prazoDevolucao: null,
            observacao: undefined,
            quitada: 0,
            dataQuitacao: null,
            criadoEm: new Date('2026-03-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-03-02T12:00:00.000Z'),
        };

        const result = mapDivida(divida);

        expect(result.prazoDevolucao).toBeNull();
        expect(result.observacao).toBeNull();
        expect(result.quitada).toBe(false);
        expect(result.dataQuitacao).toBeNull();
    });
});
