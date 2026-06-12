jest.mock('../../../src/config/database', () => ({
    configuracaoUsuario: { findUnique: jest.fn() },
    categoria: { findMany: jest.fn() },
}));
jest.mock('../../../src/repositories/budgetRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/services/notificationService', () => ({
    verificarNotificacaoDuplicada: jest.fn(),
    criarNotificacao: jest.fn(),
}));

const prisma = require('../../../src/config/database');
const budgetRepository = require('../../../src/repositories/budgetRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const notificationService = require('../../../src/services/notificationService');
const budgetService = require('../../../src/services/budgetService');

describe('budgetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista orçamentos mapeados', async () => {
        budgetRepository.buscarPorUsuarioEMes.mockResolvedValue([
            {
                id: 'o1',
                categoriaId: 'c1',
                limiteValor: 100,
                categoria: { nome: 'Mercado', icone: 'Cart', cor: '#000' },
                mesReferencia: new Date('2026-02-01T00:00:00.000Z'),
            },
        ]);

        const result = await budgetService.listarOrcamentos('u1', { mes: '2026-02' });
        expect(result[0]).toEqual(
            expect.objectContaining({
                id: 'o1',
                categoriaId: 'c1',
                limiteValor: 100,
            })
        );
    });

    it('obtém status do orçamento com totais', async () => {
        budgetRepository.buscarPorUsuarioEMes.mockResolvedValue([
            {
                id: 'o1',
                categoriaId: 'c1',
                limiteValor: 100,
                categoria: { nome: 'Mercado', icone: 'Cart', cor: '#000' },
                mesReferencia: new Date('2026-02-01T00:00:00.000Z'),
            },
        ]);
        budgetRepository.calcularGastosPorCategoria.mockResolvedValue({ c1: 85 });
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({ rendaMensalPlanejada: 5000 });
        categoryRepository.listarPorUsuario.mockResolvedValue([
            { id: 'c1', nome: 'Mercado', icone: 'Cart', cor: '#000' },
            { id: 'c2', nome: 'Lazer', icone: 'Smile', cor: '#111' },
        ]);

        const result = await budgetService.obterStatusOrcamento('u1', { mes: '2026-02' });
        expect(result.resumo).toEqual(
            expect.objectContaining({
                orcamentoTotal: 100,
                gastoTotal: 85,
                percentualUsado: 85,
            })
        );
        expect(result.categoriasSemOrcamento).toEqual([
            { id: 'c2', nome: 'Lazer', icone: 'Smile', cor: '#111' },
        ]);
    });

    it('salva vazio removendo orçamentos fora da lista', async () => {
        budgetRepository.deletarForaDaLista.mockResolvedValue(undefined);

        const result = await budgetService.salvarOrcamentos('u1', {
            mesReferencia: '2026-02-01',
            limites: [],
        });

        expect(budgetRepository.deletarForaDaLista).toHaveBeenCalled();
        expect(result.orcamentos).toEqual([]);
    });

    it('rejeita salvar quando categoria não pertence ao usuário', async () => {
        prisma.categoria.findMany.mockResolvedValue([{ id: 'c1' }]);

        await expect(
            budgetService.salvarOrcamentos('u1', {
                mesReferencia: '2026-02-01',
                limites: [
                    { categoriaId: 'c1', limiteValor: 100 },
                    { categoriaId: 'c2', limiteValor: 200 },
                ],
            })
        ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('rejeita cópia quando destino já possui orçamento', async () => {
        budgetRepository.contarPorUsuarioEMes.mockResolvedValueOnce(1);

        await expect(
            budgetService.copiarOrcamento('u1', { mesOrigem: '2026-01-01', mesDestino: '2026-02-01' })
        ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('verifica limites e cria notificações', async () => {
        budgetRepository.buscarUsuariosComOrcamentoNoMes.mockResolvedValue(['u1']);
        budgetRepository.buscarPorUsuarioEMes.mockResolvedValue([
            {
                categoriaId: 'c1',
                limiteValor: 100,
                categoria: { nome: 'Mercado', icone: 'Cart', cor: '#111' },
            },
            {
                categoriaId: 'c2',
                limiteValor: 100,
                categoria: { nome: 'Lazer', icone: 'Smile', cor: '#222' },
            },
        ]);
        budgetRepository.calcularGastosPorCategoria.mockResolvedValue({ c1: 100, c2: 80 });
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({ rendaMensalPlanejada: 5000 });
        categoryRepository.listarPorUsuario.mockResolvedValue([]);
        notificationService.verificarNotificacaoDuplicada.mockResolvedValue(false);
        notificationService.criarNotificacao.mockResolvedValue({ id: 'n1' });

        const result = await budgetService.verificarLimitesENotificar();
        expect(result).toEqual({ criadas: 2, usuariosVerificados: 1 });
    });

    it('salva orçamentos válidos e remove fora da lista', async () => {
        prisma.categoria.findMany.mockResolvedValue([{ id: 'c1' }, { id: 'c2' }]);
        budgetRepository.upsert
            .mockResolvedValueOnce({
                id: 'o1',
                categoriaId: 'c1',
                limiteValor: 100,
                mesReferencia: new Date('2026-02-01T00:00:00.000Z'),
            })
            .mockResolvedValueOnce({
                id: 'o2',
                categoriaId: 'c2',
                limiteValor: 200,
                mesReferencia: new Date('2026-02-01T00:00:00.000Z'),
            });
        budgetRepository.deletarForaDaLista.mockResolvedValue(undefined);

        const result = await budgetService.salvarOrcamentos('u1', {
            mesReferencia: '2026-02-01',
            limites: [
                { categoriaId: 'c1', limiteValor: 100 },
                { categoriaId: 'c2', limiteValor: 200 },
            ],
        });

        expect(result.orcamentos).toHaveLength(2);
        expect(budgetRepository.deletarForaDaLista).toHaveBeenCalledWith(
            'u1',
            expect.any(Date),
            ['c1', 'c2']
        );
    });

    it('remove orçamento existente', async () => {
        budgetRepository.buscarPorId.mockResolvedValue({ id: 'o1' });
        budgetRepository.deletar.mockResolvedValue(undefined);

        await budgetService.removerOrcamento('u1', 'o1');
        expect(budgetRepository.deletar).toHaveBeenCalledWith('o1');
    });

    it('rejeita remover orçamento inexistente', async () => {
        budgetRepository.buscarPorId.mockResolvedValue(null);

        await expect(budgetService.removerOrcamento('u1', 'o404')).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('copia orçamento quando origem possui limites e destino está vazio', async () => {
        budgetRepository.contarPorUsuarioEMes
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(2);
        budgetRepository.copiarParaMes.mockResolvedValue([
            {
                id: 'o1',
                categoriaId: 'c1',
                limiteValor: 100,
                mesReferencia: new Date('2026-02-01T00:00:00.000Z'),
            },
        ]);

        const result = await budgetService.copiarOrcamento('u1', {
            mesOrigem: '2026-01-01',
            mesDestino: '2026-02-01',
        });

        expect(result.quantidadeCopiada).toBe(1);
    });

    it('rejeita cópia quando origem não possui orçamento', async () => {
        budgetRepository.contarPorUsuarioEMes.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

        await expect(
            budgetService.copiarOrcamento('u1', { mesOrigem: '2026-01-01', mesDestino: '2026-02-01' })
        ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('não cria notificação duplicada ao verificar limites', async () => {
        budgetRepository.buscarUsuariosComOrcamentoNoMes.mockResolvedValue(['u1']);
        budgetRepository.buscarPorUsuarioEMes.mockResolvedValue([
            {
                categoriaId: 'c1',
                limiteValor: 100,
                categoria: { nome: 'Mercado', icone: 'Cart', cor: '#111' },
            },
        ]);
        budgetRepository.calcularGastosPorCategoria.mockResolvedValue({ c1: 85 });
        prisma.configuracaoUsuario.findUnique.mockResolvedValue(null);
        categoryRepository.listarPorUsuario.mockResolvedValue([]);
        notificationService.verificarNotificacaoDuplicada.mockResolvedValue({ id: 'dup' });

        const result = await budgetService.verificarLimitesENotificar();
        expect(result.criadas).toBe(0);
        expect(notificationService.criarNotificacao).not.toHaveBeenCalled();
    });
});
