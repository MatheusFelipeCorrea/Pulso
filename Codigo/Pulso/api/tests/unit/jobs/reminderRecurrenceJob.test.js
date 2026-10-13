jest.mock('../../../src/config/database', () => ({
    lembrete: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const prisma = require('../../../src/config/database');
const {
    gerarInstanciasMensais,
    runReminderRecurrenceJob,
    avancarRepeticaoPorDias,
} = require('../../../src/jobs/reminderRecurrenceJob');

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

        await expect(runReminderRecurrenceJob()).resolves.toEqual({
            criadas: 0,
            templates: 0,
            repeticaoPorDias: { avancados: 0, candidatos: 0 },
        });
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

    describe('avancarRepeticaoPorDias', () => {
        it('avança a dataVencimento de um lembrete vencido e não pago até ultrapassar hoje', async () => {
            jest.useFakeTimers().setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
            prisma.lembrete.findMany.mockResolvedValue([
                {
                    id: 'l1',
                    repetirCadaDias: 3,
                    pago: false,
                    dataVencimento: new Date('2026-07-08T12:00:00.000Z'),
                },
            ]);
            prisma.lembrete.update.mockResolvedValue({});

            const result = await avancarRepeticaoPorDias();

            expect(result).toEqual({ avancados: 1, candidatos: 1 });
            expect(prisma.lembrete.update).toHaveBeenCalledWith({
                where: { id: 'l1' },
                data: { dataVencimento: new Date('2026-07-17T12:00:00.000Z') },
            });
            jest.useRealTimers();
        });

        it('não mexe em nada quando não há lembretes com repetição vencidos', async () => {
            prisma.lembrete.findMany.mockResolvedValue([]);

            const result = await avancarRepeticaoPorDias();

            expect(result).toEqual({ avancados: 0, candidatos: 0 });
            expect(prisma.lembrete.update).not.toHaveBeenCalled();
        });

        it('ignora lembrete com repetirCadaDias <= 0 em vez de travar em loop infinito', async () => {
            jest.useFakeTimers().setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
            prisma.lembrete.findMany.mockResolvedValue([
                {
                    id: 'l-zero',
                    repetirCadaDias: 0,
                    pago: false,
                    dataVencimento: new Date('2026-07-08T12:00:00.000Z'),
                },
                {
                    id: 'l-negativo',
                    repetirCadaDias: -3,
                    pago: false,
                    dataVencimento: new Date('2026-07-08T12:00:00.000Z'),
                },
            ]);

            const result = await avancarRepeticaoPorDias();

            expect(result).toEqual({ avancados: 0, candidatos: 2 });
            expect(prisma.lembrete.update).not.toHaveBeenCalled();
            jest.useRealTimers();
        });

        it('para de avançar ao atingir o teto de iterações em vez de rodar indefinidamente', async () => {
            jest.useFakeTimers().setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
            prisma.lembrete.findMany.mockResolvedValue([
                {
                    id: 'l-antigo',
                    repetirCadaDias: 1,
                    pago: false,
                    // Vencido há muito mais dias que o teto de iterações (10_000), então o
                    // avanço nunca alcançaria "hoje" dentro do limite de segurança.
                    dataVencimento: new Date('1990-01-01T12:00:00.000Z'),
                },
            ]);

            const result = await avancarRepeticaoPorDias();

            expect(result).toEqual({ avancados: 0, candidatos: 1 });
            expect(prisma.lembrete.update).not.toHaveBeenCalled();
            jest.useRealTimers();
        });
    });
});
