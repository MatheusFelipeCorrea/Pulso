jest.mock('../../../src/config/database', () => ({
    transacao: { groupBy: jest.fn(), findMany: jest.fn() },
    configuracaoUsuario: { findUnique: jest.fn() },
}));
jest.mock('../../../src/repositories/reminderRepository');
jest.mock('../../../src/services/reminderService', () => ({
    startOfDay: jest.fn((d) => new Date(new Date(d).setHours(0, 0, 0, 0))),
    endOfDay: jest.fn((d) => new Date(new Date(d).setHours(23, 59, 59, 999))),
    diasAteVencimento: jest.fn(() => 3),
}));
jest.mock('../../../src/utils/fixedIncomeUtils', () => ({
    obterRecebimentosFixosConfig: jest.fn(() => [{ dia: 5, valor: 1000 }]),
    recebimentosFixosNoDia: jest.fn(() => [{ dia: 10, valor: 500 }]),
    aplicarMarcadoresRecebimentoFixo: jest.fn(),
}));

const prisma = require('../../../src/config/database');
const reminderRepository = require('../../../src/repositories/reminderRepository');
const calendarService = require('../../../src/services/calendarService');

describe('calendarService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('monta visão mensal com resumo e marcadores', async () => {
        prisma.transacao.groupBy
            .mockResolvedValueOnce([
                { tipo: 'RECEITA', _sum: { valor: 100 }, _count: { id: 1 } },
                { tipo: 'DESPESA', _sum: { valor: 60 }, _count: { id: 1 } },
            ])
            .mockResolvedValueOnce([{ tipo: 'RECEITA', _sum: { valor: 50 }, _count: { id: 1 } }]);
        prisma.transacao.findMany.mockResolvedValue([
            { data: new Date('2026-01-10T12:00:00.000Z'), tipo: 'DESPESA', valor: 20 },
        ]);
        reminderRepository.listarPorUsuario.mockResolvedValue([
            { dataVencimento: new Date('2026-01-11T12:00:00.000Z') },
        ]);
        reminderRepository.listarProximos.mockResolvedValue([
            {
                id: 'l1',
                titulo: 'Conta',
                dataVencimento: new Date('2026-01-15T12:00:00.000Z'),
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                valor: null,
                sincronizado: false,
                googleEventId: null,
                repetirMensal: false,
                diaRecorrencia: null,
                pago: false,
                criadoEm: new Date('2026-01-01T12:00:00.000Z'),
                atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
            },
        ]);
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({});

        const result = await calendarService.obterVisaoMes('u1', { mes: '2026-01' });

        expect(result).toEqual(
            expect.objectContaining({
                mes: '2026-01',
                resumo: expect.objectContaining({ receitasTotal: 100, despesasTotal: 60 }),
                dias: expect.any(Object),
                proximosVencimentos: expect.any(Array),
            })
        );
    });

    it('rejeita data inválida no detalhe do dia', async () => {
        await expect(calendarService.obterDetalheDia('u1', { data: '10-01-2026' })).rejects.toMatchObject(
            { statusCode: 400 }
        );
    });

    it('retorna detalhe do dia com totais', async () => {
        prisma.transacao.findMany.mockResolvedValue([
            {
                id: 'tx1',
                tipo: 'RECEITA',
                valor: 120,
                data: new Date('2026-01-10T12:00:00.000Z'),
                categoria: { id: 'c1', nome: 'Salário', icone: 'Wallet', cor: '#0f0', tipo: 'RECEITA' },
                tags: [],
            },
        ]);
        reminderRepository.listarPorUsuario.mockResolvedValue([
            {
                id: 'l1',
                titulo: 'Conta',
                dataVencimento: new Date('2026-01-10T12:00:00.000Z'),
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                valor: null,
                sincronizado: false,
                googleEventId: null,
                repetirMensal: false,
                diaRecorrencia: null,
                pago: false,
                criadoEm: new Date('2026-01-01T12:00:00.000Z'),
                atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
            },
        ]);
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({});

        const result = await calendarService.obterDetalheDia('u1', { data: '2026-01-10' });
        expect(result.totais).toEqual({ receitas: 120, despesas: 0, saldo: 120 });
        expect(result.data).toBe('2026-01-10');
    });

    it('não conta transferências como despesa nos marcadores do mês (RF-027)', async () => {
        prisma.transacao.groupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
        prisma.transacao.findMany.mockResolvedValue([
            { data: new Date('2026-01-12T12:00:00.000Z'), tipo: 'TRANSFERENCIA', valor: 300 },
        ]);
        reminderRepository.listarPorUsuario.mockResolvedValue([]);
        reminderRepository.listarProximos.mockResolvedValue([]);
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({});

        const result = await calendarService.obterVisaoMes('u1', { mes: '2026-01' });

        const dia = result.dias['2026-01-12'];
        expect(dia.despesas).toBe(0);
        expect(dia.temDespesa).toBe(false);
    });

    it('não conta transferência como despesa no detalhe do dia (RF-027)', async () => {
        prisma.transacao.findMany.mockResolvedValue([
            { id: 'tx1', tipo: 'TRANSFERENCIA', valor: 300, data: new Date('2026-01-10T12:00:00.000Z'), categoria: null, tags: [] },
        ]);
        reminderRepository.listarPorUsuario.mockResolvedValue([]);
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({});

        const result = await calendarService.obterDetalheDia('u1', { data: '2026-01-10' });
        expect(result.totais).toEqual({ receitas: 0, despesas: 0, saldo: 0 });
    });
});
