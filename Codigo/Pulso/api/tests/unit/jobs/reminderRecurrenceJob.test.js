jest.mock('../../../src/config/database', () => ({
    lembrete: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const prisma = require('../../../src/config/database');
const { gerarInstanciasMensais, runReminderRecurrenceJob } = require('../../../src/jobs/reminderRecurrenceJob');

describe('reminderRecurrenceJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gera instância para template sem ocorrência no mês', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-01-05T12:00:00.000Z'));
        prisma.lembrete.findMany.mockResolvedValue([
            {
                id: 'tpl-1',
                usuarioId: 'u1',
                titulo: 'Conta',
                valor: 100,
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                diaRecorrencia: 10,
            },
        ]);
        prisma.lembrete.findFirst.mockResolvedValue(null);
        prisma.lembrete.create.mockResolvedValue({});

        const result = await gerarInstanciasMensais();
        expect(result).toEqual({ criadas: 1, templates: 1 });
        expect(prisma.lembrete.create).toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('executa job recorrente com retorno agregado', async () => {
        jest.spyOn(require('../../../src/jobs/reminderRecurrenceJob'), 'gerarInstanciasMensais');
        prisma.lembrete.findMany.mockResolvedValue([]);

        await expect(runReminderRecurrenceJob()).resolves.toEqual({ criadas: 0, templates: 0 });
    });

    it('pula template quando instância já existe no mês', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-01-05T12:00:00.000Z'));
        prisma.lembrete.findMany.mockResolvedValue([
            {
                id: 'tpl-1',
                usuarioId: 'u1',
                titulo: 'Conta',
                valor: 100,
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                diaRecorrencia: 10,
            },
        ]);
        prisma.lembrete.findFirst.mockResolvedValue({ id: 'existing' });

        const result = await gerarInstanciasMensais();
        expect(result.criadas).toBe(0);
        expect(prisma.lembrete.create).not.toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('usa dia 1 quando diaRecorrencia não informado', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-01-02T12:00:00.000Z'));
        prisma.lembrete.findMany.mockResolvedValue([
            {
                id: 'tpl-2',
                usuarioId: 'u1',
                titulo: 'Aluguel',
                valor: 1200,
                antecedencia: 'UM_DIA',
                categoria: 'ALUGUEL',
                diaRecorrencia: null,
            },
        ]);
        prisma.lembrete.findFirst.mockResolvedValue(null);
        prisma.lembrete.create.mockResolvedValue({});

        await gerarInstanciasMensais();
        expect(prisma.lembrete.create).toHaveBeenCalled();
        jest.useRealTimers();
    });
});
