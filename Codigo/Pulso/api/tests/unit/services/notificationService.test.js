jest.mock('../../../src/repositories/notificationRepository');

const notificationRepository = require('../../../src/repositories/notificationRepository');
const notificationService = require('../../../src/services/notificationService');

describe('notificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista notificações com itens mapeados', async () => {
        notificationRepository.listar.mockResolvedValue({
            items: [
                {
                    id: 'not-1',
                    tipo: 'ORCAMENTO',
                    titulo: 'Orçamento excedido',
                    mensagem: 'Categoria Mercado ultrapassou o limite',
                    lida: false,
                    linkAcao: '/budget',
                    metadados: { categoriaId: 'cat-1' },
                    criadoEm: new Date('2026-01-10T10:00:00.000Z'),
                },
            ],
            total: 1,
            paginas: 1,
            pagina: 1,
        });

        const result = await notificationService.listarNotificacoes('usr-1', {
            lida: false,
            limite: 5,
            pagina: 1,
        });

        expect(notificationRepository.listar).toHaveBeenCalledWith('usr-1', {
            lida: false,
            limite: 5,
            pagina: 1,
        });
        expect(result).toEqual({
            notificacoes: [
                {
                    id: 'not-1',
                    tipo: 'ORCAMENTO',
                    titulo: 'Orçamento excedido',
                    mensagem: 'Categoria Mercado ultrapassou o limite',
                    lida: false,
                    linkAcao: '/budget',
                    metadados: { categoriaId: 'cat-1' },
                    criadoEm: '2026-01-10T10:00:00.000Z',
                },
            ],
            total: 1,
            paginas: 1,
            pagina: 1,
        });
    });

    it('retorna quantidade de notificações não lidas', async () => {
        notificationRepository.contarNaoLidas.mockResolvedValue(3);

        const result = await notificationService.contarNaoLidas('usr-1');

        expect(notificationRepository.contarNaoLidas).toHaveBeenCalledWith('usr-1');
        expect(result).toEqual({ quantidade: 3 });
    });

    it('falha ao marcar como lida quando notificação não existe', async () => {
        notificationRepository.buscarPorId.mockResolvedValue(null);

        await expect(notificationService.marcarComoLida('usr-1', 'not-404')).rejects.toMatchObject({
            statusCode: 404,
            message: 'Notificação não encontrada',
        });
    });

    it('retorna notificação sem atualizar quando já está lida', async () => {
        notificationRepository.buscarPorId.mockResolvedValue({
            id: 'not-1',
            tipo: 'LEMBRETE',
            titulo: 'Lembrete',
            mensagem: 'Conta vence amanhã',
            lida: true,
            linkAcao: '/calendar',
            metadados: null,
            criadoEm: new Date('2026-01-10T08:00:00.000Z'),
        });

        const result = await notificationService.marcarComoLida('usr-1', 'not-1');

        expect(notificationRepository.marcarComoLida).not.toHaveBeenCalled();
        expect(result).toEqual({
            id: 'not-1',
            tipo: 'LEMBRETE',
            titulo: 'Lembrete',
            mensagem: 'Conta vence amanhã',
            lida: true,
            linkAcao: '/calendar',
            metadados: null,
            criadoEm: '2026-01-10T08:00:00.000Z',
        });
    });

    it('marca notificação como lida e retorna item mapeado', async () => {
        notificationRepository.buscarPorId.mockResolvedValue({
            id: 'not-2',
            lida: false,
        });
        notificationRepository.marcarComoLida.mockResolvedValue({
            id: 'not-2',
            tipo: 'DIVIDA',
            titulo: 'Cobrar dívida',
            mensagem: 'Prazo expirando',
            lida: true,
            linkAcao: '/debts',
            metadados: { dividaId: 'div-1' },
            criadoEm: new Date('2026-01-10T09:00:00.000Z'),
        });

        const result = await notificationService.marcarComoLida('usr-1', 'not-2');

        expect(notificationRepository.marcarComoLida).toHaveBeenCalledWith('not-2', 'usr-1');
        expect(result.lida).toBe(true);
        expect(result.criadoEm).toBe('2026-01-10T09:00:00.000Z');
    });

    it('marca todas as notificações como lidas', async () => {
        notificationRepository.marcarTodasLidas.mockResolvedValue({ count: 4 });

        const result = await notificationService.marcarTodasLidas('usr-1');

        expect(notificationRepository.marcarTodasLidas).toHaveBeenCalledWith('usr-1');
        expect(result).toEqual({ quantidadeMarcada: 4 });
    });

    it('cria notificação com link padrão', async () => {
        notificationRepository.criar.mockResolvedValue({ id: 'not-new' });

        await notificationService.criarNotificacao('usr-1', {
            tipo: 'ORCAMENTO',
            titulo: 'Atenção',
            mensagem: 'Você ultrapassou o orçamento',
        });

        expect(notificationRepository.criar).toHaveBeenCalledWith({
            usuarioId: 'usr-1',
            tipo: 'ORCAMENTO',
            titulo: 'Atenção',
            mensagem: 'Você ultrapassou o orçamento',
            linkAcao: '/budget',
            metadados: null,
        });
    });

    it('verifica duplicidade de orçamento apenas com metadados completos', async () => {
        notificationRepository.buscarDuplicadaOrcamento.mockResolvedValue({ id: 'dup-1' });

        const semMetadados = await notificationService.verificarNotificacaoDuplicada(
            'usr-1',
            'ORCAMENTO',
            {}
        );
        const comMetadados = await notificationService.verificarNotificacaoDuplicada(
            'usr-1',
            'ORCAMENTO',
            {
                categoriaId: 'cat-1',
                mesReferencia: '2026-01',
            }
        );

        expect(semMetadados).toBeNull();
        expect(notificationRepository.buscarDuplicadaOrcamento).toHaveBeenCalledWith(
            'usr-1',
            'ORCAMENTO',
            'cat-1',
            '2026-01'
        );
        expect(comMetadados).toEqual({ id: 'dup-1' });
    });

    it('verifica duplicidade de lembrete apenas com metadados completos', async () => {
        notificationRepository.buscarDuplicadaLembrete.mockResolvedValue({ id: 'dup-l' });

        const semMetadados = await notificationService.verificarNotificacaoDuplicadaLembrete(
            'usr-1',
            'LEMBRETE',
            { lembreteId: 'l1' }
        );
        const comMetadados = await notificationService.verificarNotificacaoDuplicadaLembrete(
            'usr-1',
            'LEMBRETE',
            { lembreteId: 'l1', dataAlerta: '2026-01-10' }
        );

        expect(semMetadados).toBeNull();
        expect(comMetadados).toEqual({ id: 'dup-l' });
    });

    it('verifica duplicidade de dívida apenas com metadados completos', async () => {
        notificationRepository.buscarDuplicadaDivida.mockResolvedValue({ id: 'dup-d' });

        const semMetadados = await notificationService.verificarNotificacaoDuplicadaDivida(
            'usr-1',
            'DIVIDA',
            {}
        );
        const comMetadados = await notificationService.verificarNotificacaoDuplicadaDivida(
            'usr-1',
            'DIVIDA',
            { dividaId: 'd1', dataAlerta: '2026-01-10' }
        );

        expect(semMetadados).toBeNull();
        expect(comMetadados).toEqual({ id: 'dup-d' });
    });

    it('falha ao marcar como lida quando update retorna nulo', async () => {
        notificationRepository.buscarPorId.mockResolvedValue({ id: 'not-1', lida: false });
        notificationRepository.marcarComoLida.mockResolvedValue(null);

        await expect(notificationService.marcarComoLida('usr-1', 'not-1')).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('cria notificação com link e metadados customizados', async () => {
        notificationRepository.criar.mockResolvedValue({ id: 'not-new' });

        await notificationService.criarNotificacao('usr-1', {
            tipo: 'DIVIDA',
            titulo: 'Prazo',
            mensagem: 'Vence amanhã',
            linkAcao: '/debts',
            metadados: { dividaId: 'd1' },
        });

        expect(notificationRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({
                linkAcao: '/debts',
                metadados: { dividaId: 'd1' },
            })
        );
    });
});
