const { mapDivisao, mapParticipante } = require('../../../src/utils/expenseSplitMapper');

describe('expenseSplitMapper', () => {
    describe('mapParticipante', () => {
        it('formata o nome de um participante comum', () => {
            const participante = {
                id: 'p1',
                nome: 'joão',
                valor: '40.00',
                ehOrganizador: false,
                pagouAConta: false,
                status: 'PENDENTE',
                dataPagamento: null,
            };

            expect(mapParticipante(participante)).toEqual({
                id: 'p1',
                nome: 'João',
                valor: 40,
                ehOrganizador: false,
                pagouAConta: false,
                status: 'PENDENTE',
                dataPagamento: null,
            });
        });

        it('sempre exibe "Você" para o participante organizador, ignorando o nome salvo', () => {
            const participante = {
                id: 'p2',
                nome: 'qualquer coisa',
                valor: '30.00',
                ehOrganizador: true,
                pagouAConta: true,
                status: 'PAGO',
                dataPagamento: new Date('2026-07-14T12:00:00.000Z'),
            };

            expect(mapParticipante(participante).nome).toBe('Você');
        });
    });

    describe('mapDivisao', () => {
        it('mapeia campos e identifica o pagador entre os participantes', () => {
            const divisao = {
                id: 'd1',
                titulo: 'Jantar no Outback',
                valorTotal: '120.00',
                tipo: 'IGUAL',
                status: 'ATIVA',
                data: new Date('2026-04-20T00:00:00.000Z'),
                icone: 'Utensils',
                cor: '#7C3AED',
                observacao: null,
                quitadaEm: null,
                criadoEm: new Date('2026-04-20T10:00:00.000Z'),
                atualizadoEm: new Date('2026-04-20T10:00:00.000Z'),
                participantes: [
                    {
                        id: 'p1',
                        nome: 'joão',
                        valor: '40.00',
                        ehOrganizador: false,
                        pagouAConta: false,
                        status: 'PENDENTE',
                        dataPagamento: null,
                    },
                    {
                        id: 'p2',
                        nome: 'Você',
                        valor: '40.00',
                        ehOrganizador: true,
                        pagouAConta: true,
                        status: 'PAGO',
                        dataPagamento: null,
                    },
                ],
            };

            const resultado = mapDivisao(divisao);

            expect(resultado.titulo).toBe('Jantar no Outback');
            expect(resultado.valorTotal).toBe(120);
            expect(resultado.participantes).toHaveLength(2);
            expect(resultado.pagador).toEqual(
                expect.objectContaining({ id: 'p2', ehOrganizador: true })
            );
        });

        it('pagador é null quando nenhum participante pagou a conta ainda', () => {
            const divisao = {
                id: 'd2',
                titulo: 'Sem pagador',
                valorTotal: '10.00',
                tipo: 'IGUAL',
                status: 'ATIVA',
                data: new Date('2026-04-20T00:00:00.000Z'),
                icone: null,
                cor: null,
                observacao: null,
                quitadaEm: null,
                criadoEm: new Date('2026-04-20T10:00:00.000Z'),
                atualizadoEm: new Date('2026-04-20T10:00:00.000Z'),
                participantes: [],
            };

            expect(mapDivisao(divisao).pagador).toBeNull();
        });
    });
});
