jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/repositories/tagRepository');
jest.mock('../../../src/config/database', () => ({}));
jest.mock('../../../src/utils/recursoCategoriaRules', () => ({
    validarRecursoCategoria: jest.fn(),
}));
jest.mock('../../../src/utils/transactionMapper', () => ({
    mapTransacao: jest.fn((tx) => ({ ...tx, mapped: true })),
}));
jest.mock('../../../src/services/notificationService', () => ({
    criarNotificacao: jest.fn(),
}));
jest.mock('../../../src/services/insightService', () => ({
    tentarGerarInsightAposTransacao: jest.fn(),
}));

const transactionRepository = require('../../../src/repositories/transactionRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const tagRepository = require('../../../src/repositories/tagRepository');
const notificationService = require('../../../src/services/notificationService');
const transactionService = require('../../../src/services/transactionService');

describe('transactionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        transactionRepository.listarRecursosDistintos.mockResolvedValue([]);
        transactionRepository.listarTransacoesRecurso.mockResolvedValue([]);
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
            modo: 'fluxo',
        });
    });

    it('calcula resumo em modo carteira para VR', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 798.34 }, _count: { id: 1 } },
            { tipo: 'DESPESA', _sum: { valor: 99.8 }, _count: { id: 3 } },
        ]);
        transactionRepository.listarTransacoesRecurso.mockResolvedValue([
            { tipo: 'RECEITA', recurso: 'VR', valor: 712.23 },
        ]);

        const result = await transactionService.calcularResumo('u1', { recurso: 'VR' });

        expect(result.modo).toBe('beneficio');
        expect(result.recursoCarteira).toBe('VR');
        expect(result.saldo).toBe('712.23');
        expect(result.saldoInicialPeriodo).toBe('0.00');
        expect(result.receitas.total).toBe('798.34');
        expect(result.despesas.total).toBe('99.80');
    });

    it('detecta modo carteira quando só há VR no período', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 798.34 }, _count: { id: 1 } },
            { tipo: 'DESPESA', _sum: { valor: 99.8 }, _count: { id: 3 } },
        ]);
        transactionRepository.listarRecursosDistintos.mockResolvedValue(['VR']);
        transactionRepository.listarTransacoesRecurso
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', recurso: 'VR', valor: 798.34 },
                { tipo: 'RECEITA', recurso: 'VR', valor: 421.47 },
                { tipo: 'DESPESA', recurso: 'VR', valor: 507.58 },
            ])
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', recurso: 'VR', valor: 127 },
                { tipo: 'DESPESA', recurso: 'VR', valor: 113.3 },
            ]);

        const result = await transactionService.calcularResumo('u1', {
            recurso: 'TODOS',
            dataInicio: '2026-08-01',
            dataFim: '2026-08-31',
        });

        expect(result.modo).toBe('beneficio');
        expect(result.recursoCarteira).toBe('VR');
        expect(result.saldo).toBe('712.23');
        expect(result.saldoInicialPeriodo).toBe('13.70');
        expect(result.receitas.total).toBe('798.34');
        expect(result.despesas.total).toBe('99.80');
    });

    it('calcula resumo em modo conta para Dinheiro', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 3000 }, _count: { id: 1 } },
            { tipo: 'DESPESA', _sum: { valor: 1200 }, _count: { id: 4 } },
        ]);
        transactionRepository.listarTransacoesRecurso.mockResolvedValue([
            { tipo: 'RECEITA', recurso: 'DINHEIRO', valor: 5000 },
            { tipo: 'DESPESA', recurso: 'DINHEIRO', valor: 800 },
        ]);

        const result = await transactionService.calcularResumo('u1', {
            recurso: 'DINHEIRO',
            dataInicio: '2026-08-01',
            dataFim: '2026-08-31',
        });

        expect(result.modo).toBe('conta');
        expect(result.recursoCarteira).toBe('DINHEIRO');
        expect(result.saldo).toBe('4200.00');
        expect(result.receitas.total).toBe('3000.00');
        expect(result.despesas.total).toBe('1200.00');
    });

    it('soma saldos acumulados quando TODOS tem VR e Dinheiro no período', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 773.02 }, _count: { id: 3 } },
            { tipo: 'DESPESA', _sum: { valor: 315.09 }, _count: { id: 4 } },
        ]);
        transactionRepository.listarRecursosDistintos.mockResolvedValue(['VR', 'DINHEIRO']);
        transactionRepository.listarTransacoesRecurso.mockImplementation((_usuarioId, recurso, filtros = {}) => {
            if (filtros.antesDe) {
                return Promise.resolve([]);
            }
            if (recurso === 'VR') {
                return Promise.resolve([{ tipo: 'RECEITA', recurso: 'VR', valor: 871.93 }]);
            }
            if (recurso === 'DINHEIRO') {
                return Promise.resolve([{ tipo: 'RECEITA', recurso: 'DINHEIRO', valor: 1484.96 }]);
            }
            return Promise.resolve([]);
        });

        const result = await transactionService.calcularResumo('u1', {
            recurso: 'TODOS',
            dataInicio: '2026-08-01',
            dataFim: '2026-08-31',
        });

        expect(result.modo).toBe('carteira');
        expect(result.recursoCarteira).toBeNull();
        expect(result.saldo).toBe('2356.89');
        expect(result.saldoInicialPeriodo).toBe('0.00');
        expect(result.receitas.total).toBe('773.02');
        expect(result.despesas.total).toBe('315.09');
    });

    it('cria transação e vincula tags', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'RECEITA' });
        tagRepository.buscarPorIds.mockResolvedValue([{ id: 'tag1' }]);
        transactionRepository.criar.mockResolvedValue({ id: 'tx1' });
        transactionRepository.buscarPorId.mockResolvedValue({ id: 'tx1' });

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

    it('encerra série recorrente preservando histórico quando excluirFuturas na mãe', async () => {
        transactionRepository.buscarPorId.mockResolvedValue({
            id: 'mae',
            recorrente: true,
            paiId: null,
            regraRecorrencia: 'FREQ=MONTHLY',
            data: new Date('2026-01-01'),
        });
        transactionRepository.excluirRecorrentesFilhasAPartirDe.mockResolvedValue(undefined);
        transactionRepository.encerrarRecorrencia.mockResolvedValue(undefined);

        await transactionService.excluirTransacao('u1', 'mae', true);

        expect(transactionRepository.excluirRecorrentesFilhasAPartirDe).toHaveBeenCalledWith(
            'mae',
            expect.any(Date)
        );
        expect(transactionRepository.encerrarRecorrencia).toHaveBeenCalledWith(
            'mae',
            expect.stringContaining('UNTIL=')
        );
        expect(transactionRepository.excluir).not.toHaveBeenCalled();
    });

    it('encerra série a partir da data da filha quando excluirFuturas', async () => {
        const dataCorte = '2026-03-15T03:00:00.000Z';
        transactionRepository.buscarPorId
            .mockResolvedValueOnce({
                id: 'filha',
                recorrente: false,
                paiId: 'mae',
                data: new Date(dataCorte),
            })
            .mockResolvedValueOnce({
                id: 'mae',
                recorrente: true,
                paiId: null,
                regraRecorrencia: 'FREQ=MONTHLY',
                data: new Date('2026-01-01'),
            });
        transactionRepository.excluirRecorrentesFilhasAPartirDe.mockResolvedValue(undefined);
        transactionRepository.encerrarRecorrencia.mockResolvedValue(undefined);

        await transactionService.excluirTransacao('u1', 'filha', true, dataCorte);

        expect(transactionRepository.excluirRecorrentesFilhasAPartirDe).toHaveBeenCalledWith(
            'mae',
            expect.any(Date)
        );
        expect(transactionRepository.encerrarRecorrencia).toHaveBeenCalledWith(
            'mae',
            expect.stringContaining('UNTIL=20260314')
        );
        expect(transactionRepository.excluir).not.toHaveBeenCalled();
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

    it('resumo ignora transferências (RF-140)', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'RECEITA', _sum: { valor: 100 }, _count: { id: 1 } },
            { tipo: 'DESPESA', _sum: { valor: 40 }, _count: { id: 1 } },
            { tipo: 'TRANSFERENCIA', _sum: { valor: 500 }, _count: { id: 1 } },
        ]);

        const result = await transactionService.calcularResumo('u1', {});
        expect(result).toEqual({
            receitas: { total: '100.00', quantidade: 1 },
            despesas: { total: '40.00', quantidade: 1 },
            saldo: '60.00',
            modo: 'fluxo',
        });
    });

    it('cria transferência entre recursos sem categoria (RF-140)', async () => {
        transactionRepository.criar.mockResolvedValue({ id: 'tx1' });
        transactionRepository.buscarPorId.mockResolvedValue({
            id: 'tx1',
            tipo: 'TRANSFERENCIA',
            recurso: 'DINHEIRO',
            recursoDestino: 'POUPANCA',
            valor: 200,
        });
        tagRepository.buscarPorIds.mockResolvedValue([]);

        const result = await transactionService.criarTransacao('u1', {
            tipo: 'TRANSFERENCIA',
            recurso: 'DINHEIRO',
            recursoDestino: 'POUPANCA',
            valor: 200,
            data: '2026-01-10',
            recorrente: false,
        });

        expect(categoryRepository.buscarPorId).not.toHaveBeenCalled();
        expect(transactionRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({
                categoriaId: null,
                tipo: 'TRANSFERENCIA',
                recurso: 'DINHEIRO',
                recursoDestino: 'POUPANCA',
            })
        );
        expect(notificationService.criarNotificacao).toHaveBeenCalledWith(
            'u1',
            expect.objectContaining({ tipo: 'TRANSFERENCIA_REGISTRADA' })
        );
        expect(result).toMatchObject({ id: 'tx1', mapped: true });
    });

    it('rejeita transferência com recurso de destino igual ao de origem', async () => {
        await expect(
            transactionService.criarTransacao('u1', {
                tipo: 'TRANSFERENCIA',
                recurso: 'DINHEIRO',
                recursoDestino: 'DINHEIRO',
                valor: 200,
                data: '2026-01-10',
                recorrente: false,
            })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('edita transação para transferência e limpa a categoria', async () => {
        transactionRepository.buscarPorId
            .mockResolvedValueOnce({
                id: 'tx1',
                tipo: 'DESPESA',
                categoriaId: 'c1',
                recurso: 'DINHEIRO',
                recursoDestino: null,
                recorrente: false,
            })
            .mockResolvedValueOnce({ id: 'tx1' });
        transactionRepository.atualizar.mockResolvedValue(undefined);

        await transactionService.editarTransacao('u1', 'tx1', {
            tipo: 'TRANSFERENCIA',
            recursoDestino: 'POUPANCA',
        });

        expect(categoryRepository.buscarPorId).not.toHaveBeenCalled();
        expect(transactionRepository.atualizar).toHaveBeenCalledWith('tx1', {
            tipo: 'TRANSFERENCIA',
            recursoDestino: 'POUPANCA',
            categoriaId: null,
        });
    });

    it('edita transferência de volta para despesa e limpa o recurso de destino', async () => {
        transactionRepository.buscarPorId
            .mockResolvedValueOnce({
                id: 'tx1',
                tipo: 'TRANSFERENCIA',
                categoriaId: null,
                recurso: 'DINHEIRO',
                recursoDestino: 'POUPANCA',
                recorrente: false,
            })
            .mockResolvedValueOnce({ id: 'tx1' });
        categoryRepository.buscarPorId.mockResolvedValue({ id: 'c1', tipo: 'DESPESA' });
        transactionRepository.atualizar.mockResolvedValue(undefined);

        await transactionService.editarTransacao('u1', 'tx1', {
            tipo: 'DESPESA',
            categoriaId: 'c1',
        });

        expect(transactionRepository.atualizar).toHaveBeenCalledWith('tx1', {
            tipo: 'DESPESA',
            categoriaId: 'c1',
            recursoDestino: null,
        });
    });
});
