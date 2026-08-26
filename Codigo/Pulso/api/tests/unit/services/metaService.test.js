jest.mock('../../../src/repositories/metaRepository');
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/services/notificationService', () => ({
    criarNotificacao: jest.fn(),
}));

const metaRepository = require('../../../src/repositories/metaRepository');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const metaService = require('../../../src/services/metaService');

const metaBase = (overrides = {}) => ({
    id: 'meta-1',
    usuarioId: 'usr-1',
    nome: 'Viagem',
    valorAlvo: 2000,
    valorAtual: 0,
    prazo: new Date('2026-12-15T12:00:00.000Z'),
    tipo: 'LONGO_PRAZO',
    status: 'ATIVA',
    prioridade: null,
    descricao: null,
    concluidaEm: null,
    criadoEm: new Date('2026-01-10T12:00:00.000Z'),
    atualizadoEm: new Date('2026-01-10T12:00:00.000Z'),
    aportes: [],
    ...overrides,
});

describe('metaService', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-06-10T12:00:00.000Z'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rejeita meta com prazo no passado', async () => {
        await expect(
            metaService.criarMeta('usr-1', {
                nome: 'Reserva',
                valorAlvo: 500,
                prazo: '2026-01-01',
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Prazo da meta deve ser uma data futura',
        });
    });

    it('cria meta com tipo inferido', async () => {
        metaRepository.criar.mockResolvedValue(
            metaBase({ nome: 'Curso', valorAlvo: 300, prazo: new Date('2026-09-10T12:00:00.000Z'), tipo: 'CURTO_PRAZO' })
        );

        const result = await metaService.criarMeta('usr-1', {
            nome: 'Curso',
            valorAlvo: 300,
            prazo: '2026-09-10',
        });

        expect(metaRepository.criar).toHaveBeenCalled();
        expect(result.nome).toBe('Curso');
        expect(result.valorAlvo).toBe('300.00');
    });

    it('registra aporte parcial sem concluir meta', async () => {
        metaRepository.buscarPorId.mockResolvedValue(metaBase({ valorAlvo: 200, valorAtual: 0 }));
        metaRepository.criarAporte.mockResolvedValue({
            id: 'ap-1',
            valor: 50,
            data: new Date('2026-06-10T12:00:00.000Z'),
            criadoEm: new Date('2026-06-10T12:00:00.000Z'),
        });
        metaRepository.atualizar.mockResolvedValue(metaBase({ valorAlvo: 200, valorAtual: 50 }));

        const result = await metaService.registrarAporte('usr-1', 'meta-1', {
            valor: 50,
            data: '2026-06-10',
        });

        expect(result.meta.status).toBe('ATIVA');
        expect(result.meta.valorAtual).toBe('50.00');
        expect(result.meta.valorRestante).toBe('150.00');
    });

    it('conclui meta quando aporte atinge valor alvo', async () => {
        metaRepository.buscarPorId.mockResolvedValue(metaBase({ valorAlvo: 100, valorAtual: 80 }));
        metaRepository.criarAporte.mockResolvedValue({
            id: 'ap-2',
            valor: 20,
            data: new Date('2026-06-10T12:00:00.000Z'),
            criadoEm: new Date('2026-06-10T12:00:00.000Z'),
        });
        metaRepository.atualizar
            .mockResolvedValueOnce(metaBase({ valorAlvo: 100, valorAtual: 100 }))
            .mockResolvedValueOnce(
                metaBase({
                    valorAlvo: 100,
                    valorAtual: 100,
                    status: 'CONCLUIDA',
                    concluidaEm: new Date('2026-06-10T12:00:00.000Z'),
                })
            );

        const result = await metaService.registrarAporte('usr-1', 'meta-1', {
            valor: 20,
            data: '2026-06-10',
        });

        expect(result.meta.status).toBe('CONCLUIDA');
        expect(result.meta.valorRestante).toBe('0.00');
    });

    it('sugere valor de reserva de emergência com base no gasto médio mensal', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'DESPESA', _sum: { valor: 3000 }, _count: { id: 10 } },
        ]);

        const result = await metaService.sugerirReservaEmergencia('usr-1', {});

        expect(transactionRepository.calcularAgregados).toHaveBeenCalledWith('usr-1', {
            dataInicio: new Date(2026, 2, 1),
            dataFim: new Date(2026, 5, 0, 23, 59, 59, 999),
            tipo: 'DESPESA',
        });
        expect(result.mediaGastoMensal).toBe('1000.00');
        expect(result.meses).toBe(6);
        expect(result.valorSugerido).toBe('6000.00');
        expect(result.mesesHistoricoAnalisado).toBe(3);
    });

    it('sugere reserva de emergência com quantidade de meses customizada', async () => {
        transactionRepository.calcularAgregados.mockResolvedValue([
            { tipo: 'DESPESA', _sum: { valor: 1500 }, _count: { id: 4 } },
        ]);

        const result = await metaService.sugerirReservaEmergencia('usr-1', { meses: 3 });

        expect(result.mediaGastoMensal).toBe('500.00');
        expect(result.meses).toBe(3);
        expect(result.valorSugerido).toBe('1500.00');
    });

    it('bloqueia aporte acima do saldo restante', async () => {
        metaRepository.buscarPorId.mockResolvedValue(metaBase({ valorAlvo: 200, valorAtual: 150 }));

        await expect(
            metaService.registrarAporte('usr-1', 'meta-1', {
                valor: 100,
                data: '2026-06-10',
            })
        ).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('exclui aporte de meta concluída e reabre a meta', async () => {
        metaRepository.buscarPorId.mockResolvedValue(
            metaBase({
                valorAlvo: 100,
                valorAtual: 100,
                status: 'CONCLUIDA',
                concluidaEm: new Date('2026-06-10T12:00:00.000Z'),
                aportes: [
                    {
                        id: 'ap-1',
                        valor: 80,
                        data: new Date('2026-05-10T12:00:00.000Z'),
                        criadoEm: new Date('2026-05-10T12:00:00.000Z'),
                    },
                    {
                        id: 'ap-2',
                        valor: 20,
                        data: new Date('2026-06-10T12:00:00.000Z'),
                        criadoEm: new Date('2026-06-10T12:00:00.000Z'),
                    },
                ],
            })
        );
        metaRepository.buscarAporte.mockResolvedValue({
            id: 'ap-2',
            valor: 20,
            data: new Date('2026-06-10T12:00:00.000Z'),
        });
        metaRepository.excluirAporte.mockResolvedValue(undefined);
        metaRepository.atualizar.mockResolvedValue(
            metaBase({
                valorAlvo: 100,
                valorAtual: 80,
                status: 'ATIVA',
                concluidaEm: null,
                aportes: [
                    {
                        id: 'ap-1',
                        valor: 80,
                        data: new Date('2026-05-10T12:00:00.000Z'),
                        criadoEm: new Date('2026-05-10T12:00:00.000Z'),
                    },
                ],
            })
        );

        const result = await metaService.excluirAporte('usr-1', 'meta-1', 'ap-2');

        expect(metaRepository.excluirAporte).toHaveBeenCalledWith('ap-2');
        expect(metaRepository.atualizar).toHaveBeenCalledWith('meta-1', 'usr-1', {
            valorAtual: 80,
            status: 'ATIVA',
            concluidaEm: null,
        });
        expect(result.status).toBe('ATIVA');
        expect(result.valorAtual).toBe('80.00');
        expect(result.valorRestante).toBe('20.00');
    });

    it('exclui aporte de meta ativa sem alterar status', async () => {
        metaRepository.buscarPorId.mockResolvedValue(
            metaBase({
                valorAlvo: 200,
                valorAtual: 50,
                status: 'ATIVA',
                aportes: [
                    {
                        id: 'ap-1',
                        valor: 50,
                        data: new Date('2026-06-01T12:00:00.000Z'),
                        criadoEm: new Date('2026-06-01T12:00:00.000Z'),
                    },
                ],
            })
        );
        metaRepository.buscarAporte.mockResolvedValue({
            id: 'ap-1',
            valor: 50,
            data: new Date('2026-06-01T12:00:00.000Z'),
        });
        metaRepository.excluirAporte.mockResolvedValue(undefined);
        metaRepository.atualizar.mockResolvedValue(
            metaBase({ valorAlvo: 200, valorAtual: 0, status: 'ATIVA', aportes: [] })
        );

        const result = await metaService.excluirAporte('usr-1', 'meta-1', 'ap-1');

        expect(metaRepository.atualizar).toHaveBeenCalledWith('meta-1', 'usr-1', {
            valorAtual: 0,
            status: 'ATIVA',
            concluidaEm: null,
        });
        expect(result.status).toBe('ATIVA');
    });

    it('rejeita excluir aporte inexistente', async () => {
        metaRepository.buscarPorId.mockResolvedValue(metaBase());
        metaRepository.buscarAporte.mockResolvedValue(null);

        await expect(metaService.excluirAporte('usr-1', 'meta-1', 'ap-404')).rejects.toMatchObject({
            statusCode: 404,
            message: 'Aporte não encontrado',
        });
    });
});
