jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/repositories/tagRepository');
jest.mock('../../../src/config/database', () => ({
    sequencia: { findUnique: jest.fn(), update: jest.fn() },
}));
jest.mock('../../../src/utils/recursoCategoriaRules', () => ({
    validarRecursoCategoria: jest.fn(),
}));
jest.mock('../../../src/utils/transactionMapper', () => ({
    mapTransacao: jest.fn((tx) => ({ ...tx, mapped: true })),
}));

const transactionRepository = require('../../../src/repositories/transactionRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const tagRepository = require('../../../src/repositories/tagRepository');
const prisma = require('../../../src/config/database');
const transactionService = require('../../../src/services/transactionService');

describe('transactionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        require('../../../src/utils/transactionMapper').mapTransacao.mockImplementation((tx) => ({
            ...tx,
            mapped: true,
        }));
    });

    it('lista transações com paginação', async () => {
        transactionRepository.listarPorUsuario.mockResolvedValue({
            transacoes: [{ id: 't1' }],
            total: 15,
        });

        const result = await transactionService.listarTransacoes('u1', { pagina: '2', limite: '10' });

        expect(result).toEqual({
            transacoes: [{ id: 't1', mapped: true }],
            total: 15,
            paginas: 2,
            pagina: 2,
        });
    });

    it('calcula resumo por agregados', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 100 }, _count: { id: 1 } },
            { tipo: 'DESPESA', _sum: { valor: 40 }, _count: { id: 2 } },
        ]);

        const result = await transactionService.calcularResumo('u1', {});
        expect(result).toEqual({
            receitas: { total: '100.00', quantidade: 1 },
            despesas: { total: '40.00', quantidade: 2 },
            saldo: '60.00',
        });
    });

    it('cria transação, vincula tags e incrementa streak', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'RECEITA' });
        tagRepository.buscarPorIds.mockResolvedValue([{ id: 'tag1' }]);
        transactionRepository.criar.mockResolvedValue({ id: 'tx1' });
        transactionRepository.buscarPorId.mockResolvedValue({ id: 'tx1' });
        prisma.sequencia.findUnique.mockResolvedValue({
            usuarioId: 'u1',
            sequenciaAtual: 2,
            maiorSequencia: 4,
            ultimaAtividade: new Date(Date.now() - 24 * 60 * 60 * 1000),
        });
        prisma.sequencia.update.mockResolvedValue({});

        const result = await transactionService.criarTransacao('u1', {
            categoriaId: 'c1',
            tipo: 'RECEITA',
            recurso: 'DINHEIRO',
            valor: 10,
            data: '2026-01-10',
            recorrente: false,
            tags: ['tag1'],
        });

        expect(transactionRepository.vincularTags).toHaveBeenCalledWith('tx1', ['tag1']);
        expect(prisma.sequencia.update).toHaveBeenCalled();
        expect(result).toEqual({ id: 'tx1', mapped: true });
    });

    it('rejeita recorrente sem regra', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'DESPESA' });
        tagRepository.buscarPorIds.mockResolvedValue([]);

        await expect(
            transactionService.criarTransacao('u1', {
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 10,
                data: '2026-01-10',
                recorrente: true,
            })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('editar retorna 404 quando não encontra transação', async () => {
        transactionRepository.buscarPorId.mockResolvedValue(null);

        await expect(transactionService.editarTransacao('u1', 'tx404', {})).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('exclui mãe recorrente com futuras quando solicitado', async () => {
        transactionRepository.buscarPorId.mockResolvedValue({ id: 'mae', recorrente: true, paiId: null });
        transactionRepository.excluirRecorrentesFilhas.mockResolvedValue(undefined);
        transactionRepository.excluir.mockResolvedValue(undefined);

        await transactionService.excluirTransacao('u1', 'mae', true);

        expect(transactionRepository.excluirRecorrentesFilhas).toHaveBeenCalledWith('mae');
        expect(transactionRepository.excluir).toHaveBeenCalledWith('mae');
    });

    it('edita transação e atualiza tags quando informado', async () => {
        transactionRepository.buscarPorId
            .mockResolvedValueOnce({
                id: 'tx1',
                tipo: 'DESPESA',
                categoriaId: 'c1',
                recurso: 'DINHEIRO',
                recorrente: false,
            })
            .mockResolvedValueOnce({ id: 'tx1' });
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'DESPESA' });
        tagRepository.buscarPorIds.mockResolvedValue([{ id: 'tag1' }, { id: 'tag2' }]);
        transactionRepository.atualizar.mockResolvedValue(undefined);
        transactionRepository.desvincularTags.mockResolvedValue(undefined);
        transactionRepository.vincularTags.mockResolvedValue(undefined);

        const result = await transactionService.editarTransacao('u1', 'tx1', {
            valor: 55,
            tags: ['tag1', 'tag2'],
        });

        expect(transactionRepository.atualizar).toHaveBeenCalledWith('tx1', { valor: 55 });
        expect(transactionRepository.desvincularTags).toHaveBeenCalledWith('tx1');
        expect(transactionRepository.vincularTags).toHaveBeenCalledWith('tx1', ['tag1', 'tag2']);
        expect(result).toEqual({ id: 'tx1', mapped: true });
    });

    it('rejeita criação com categoria incompatível', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'RECEITA' });

        await expect(
            transactionService.criarTransacao('u1', {
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 20,
                data: '2026-01-10',
                recorrente: false,
            })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('rejeita excluir quando transação não existe', async () => {
        transactionRepository.buscarPorId.mockResolvedValue(null);
        await expect(transactionService.excluirTransacao('u1', 'tx404')).rejects.toMatchObject({
            statusCode: 404,
        });
    });
});
