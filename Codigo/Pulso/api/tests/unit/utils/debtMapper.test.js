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

            pagamentos: [],

        };



        expect(mapDivida(divida)).toEqual({

            id: 'div-1',

            direcao: 'A_RECEBER',

            nomePessoa: 'Maria',

            valor: '150.50',

            valorPago: '150.50',

            valorRestante: '0.00',

            dataEmprestimo: '2026-01-10T12:00:00.000Z',

            prazoDevolucao: '2026-02-10T12:00:00.000Z',

            observacao: 'Teste',

            quitada: true,

            dataQuitacao: '2026-02-01T12:00:00.000Z',

            criadoEm: '2026-01-01T12:00:00.000Z',

            atualizadoEm: '2026-01-02T12:00:00.000Z',

            pagamentos: [],

            quantidadePagamentos: 0,

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

        expect(result.valorRestante).toBe('10.00');

    });



    it('mapDivida normaliza nome da pessoa com capitalização', () => {

        const result = mapDivida({

            id: 'div-3',

            direcao: 'ME_DEVEM',

            nomePessoa: 'carol',

            valor: 200,

            dataEmprestimo: new Date('2026-06-12T12:00:00.000Z'),

            prazoDevolucao: null,

            observacao: null,

            quitada: false,

            dataQuitacao: null,

            criadoEm: new Date('2026-06-12T12:00:00.000Z'),

            atualizadoEm: new Date('2026-06-12T12:00:00.000Z'),

        });



        expect(result.nomePessoa).toBe('Carol');

    });



    it('mapDivida calcula saldo com pagamentos parciais', () => {

        const result = mapDivida({

            id: 'div-4',

            direcao: 'ME_DEVEM',

            nomePessoa: 'Lia',

            valor: 100,

            dataEmprestimo: new Date('2026-06-12T12:00:00.000Z'),

            prazoDevolucao: null,

            observacao: null,

            quitada: false,

            dataQuitacao: null,

            criadoEm: new Date('2026-06-12T12:00:00.000Z'),

            atualizadoEm: new Date('2026-06-12T12:00:00.000Z'),

            pagamentos: [

                {

                    id: 'p1',

                    valor: 30,

                    dataPagamento: new Date('2026-06-13T12:00:00.000Z'),

                    observacao: null,

                    criadoEm: new Date('2026-06-13T12:00:00.000Z'),

                },

            ],

        });



        expect(result.valorPago).toBe('30.00');

        expect(result.valorRestante).toBe('70.00');

        expect(result.quantidadePagamentos).toBe(1);

    });

});

