const {
    mapTransacao,
    mapCategoria,
} = require('../../../src/utils/transactionMapper');

describe('transactionMapper', () => {
    it('mapCategoria mapeia categoria corretamente', () => {
        const categoria = {
            id: 'cat-1',
            nome: 'Transporte',
            icone: 'bus',
            cor: '#123456',
            tipo: 'DESPESA',
        };

        expect(mapCategoria(categoria)).toEqual(categoria);
    });

    it('mapTransacao mapeia categoria e tags', () => {
        const transacao = {
            id: 'trx-1',
            tipo: 'DESPESA',
            recurso: 'DINHEIRO',
            valor: '100',
            descricao: 'Corrida',
            data: new Date('2026-06-01T12:00:00.000Z'),
            recorrente: false,
            regraRecorrencia: null,
            paiId: null,
            categoria: {
                id: 'cat-1',
                nome: 'Transporte',
                icone: 'bus',
                cor: '#123456',
                tipo: 'DESPESA',
            },
            tags: [
                {
                    tag: {
                        id: 'tag-1',
                        nome: 'Uber',
                        icone: 'car',
                        cor: '#ABCDEF',
                    },
                },
            ],
        };

        expect(mapTransacao(transacao)).toEqual({
            id: 'trx-1',
            tipo: 'DESPESA',
            recurso: 'DINHEIRO',
            recursoDestino: null,
            valor: '100.00',
            descricao: 'Corrida',
            data: '2026-06-01T12:00:00.000Z',
            recorrente: false,
            regraRecorrencia: null,
            paiId: null,
            categoria: {
                id: 'cat-1',
                nome: 'Transporte',
                icone: 'bus',
                cor: '#123456',
                tipo: 'DESPESA',
            },
            tags: [
                {
                    id: 'tag-1',
                    nome: 'Uber',
                    icone: 'car',
                    cor: '#ABCDEF',
                },
            ],
        });
    });

    it('mapTransacao usa defaults para categoria e tags ausentes', () => {
        const result = mapTransacao({
            id: 'trx-2',
            tipo: 'RECEITA',
            recurso: 'DINHEIRO',
            valor: 50,
            descricao: 'Venda',
            data: new Date('2026-06-03T12:00:00.000Z'),
            recorrente: true,
            regraRecorrencia: 'MENSAL',
            paiId: 'trx-1',
            categoria: null,
            tags: undefined,
        });

        expect(result.categoria).toBeUndefined();
        expect(result.tags).toEqual([]);
    });

    it('mapTransacao mapeia transferência sem categoria com recurso de destino (RF-140)', () => {
        const result = mapTransacao({
            id: 'trx-3',
            tipo: 'TRANSFERENCIA',
            recurso: 'DINHEIRO',
            recursoDestino: 'POUPANCA',
            valor: '200',
            descricao: null,
            data: new Date('2026-06-05T12:00:00.000Z'),
            recorrente: false,
            regraRecorrencia: null,
            paiId: null,
            categoria: null,
            tags: [],
        });

        expect(result.recursoDestino).toBe('POUPANCA');
        expect(result.categoria).toBeUndefined();
    });
});
