jest.mock('../../../src/config/database', () => ({
    transacao: { groupBy: jest.fn() },
    configuracaoUsuario: { findUnique: jest.fn() },
}));
jest.mock('../../../src/repositories/purchasePlanningRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/repositories/metaRepository');
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/services/purchaseItemImageService', () => ({
    resolvePurchaseItemImage: jest.fn(),
}));
jest.mock('../../../src/services/purchaseItemImageStorageService', () => ({
    storePurchaseItemImage: jest.fn(),
}));

const prisma = require('../../../src/config/database');
const purchasePlanningRepository = require('../../../src/repositories/purchasePlanningRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const metaRepository = require('../../../src/repositories/metaRepository');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const purchasePlanningService = require('../../../src/services/purchasePlanningService');

const itemBase = (overrides = {}) => ({
    id: 'item-1',
    usuarioId: 'u1',
    nome: 'Notebook',
    valorEstimado: 3000,
    prioridade: 'ALTA',
    categoria: 'TECNOLOGIA',
    status: 'DESEJADO',
    metaId: null,
    simularParcelas: true,
    parcelas: 12,
    ...overrides,
});

describe('purchasePlanningService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({ rendaMensalPlanejada: 5000 });
        prisma.transacao.groupBy.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 5000 } },
            { tipo: 'DESPESA', _sum: { valor: 3000 } },
        ]);
    });

    it('calcula sobra mensal como média dos últimos 3 meses (RN-088)', async () => {
        prisma.transacao.groupBy
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', _sum: { valor: 5000 } },
                { tipo: 'DESPESA', _sum: { valor: 4000 } },
            ])
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', _sum: { valor: 5000 } },
                { tipo: 'DESPESA', _sum: { valor: 3000 } },
            ])
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', _sum: { valor: 5000 } },
                { tipo: 'DESPESA', _sum: { valor: 2000 } },
            ]);

        const contexto = await purchasePlanningService.montarContexto('u1');

        expect(contexto.sobraMensal).toBe(2000);
        expect(prisma.transacao.groupBy).toHaveBeenCalledTimes(3);
    });

    it('conclui meta vinculada ao marcar item como comprado (RN-093)', async () => {
        purchasePlanningRepository.buscarPorId.mockResolvedValue(
            itemBase({ metaId: 'meta-1' })
        );
        categoryRepository.listarPorUsuario.mockResolvedValue([
            { id: 'cat-compras', nome: 'Compras', tipo: 'DESPESA' },
        ]);
        transactionRepository.criar.mockResolvedValue({ id: 'tx-1' });
        metaRepository.buscarPorId.mockResolvedValue({
            id: 'meta-1',
            usuarioId: 'u1',
            status: 'ATIVA',
        });
        metaRepository.atualizar.mockResolvedValue({
            id: 'meta-1',
            status: 'CONCLUIDA',
        });
        purchasePlanningRepository.atualizar.mockResolvedValue(
            itemBase({ status: 'COMPRADO', metaId: 'meta-1', transacaoId: 'tx-1' })
        );

        await purchasePlanningService.marcarComprado('u1', 'item-1', {});

        expect(metaRepository.atualizar).toHaveBeenCalledWith(
            'meta-1',
            'u1',
            expect.objectContaining({ status: 'CONCLUIDA' })
        );
    });
});
