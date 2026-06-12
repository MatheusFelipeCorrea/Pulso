jest.mock('../../../src/config/database', () => ({
    lembrete: { findMany: jest.fn() },
}));
jest.mock('../../../src/services/notificationService', () => ({
    verificarNotificacaoDuplicadaLembrete: jest.fn(),
    criarNotificacao: jest.fn(),
}));
jest.mock('../../../src/utils/dateTimezone', () => ({
    formatDateOnly: jest.fn((d) => new Date(d).toISOString().slice(0, 10)),
    addDays: jest.fn((date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }),
    todayInTimezone: jest.fn(() => '2026-01-10'),
}));

const prisma = require('../../../src/config/database');
const notificationService = require('../../../src/services/notificationService');
const dateTimezone = require('../../../src/utils/dateTimezone');
const reminderAlertService = require('../../../src/services/reminderAlertService');

describe('reminderAlertService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        dateTimezone.todayInTimezone.mockReturnValue('2026-01-10');
        dateTimezone.formatDateOnly.mockImplementation((d) => new Date(d).toISOString().slice(0, 10));
        dateTimezone.addDays.mockImplementation((date, days) => {
            const base = new Date(date);
            base.setDate(base.getDate() + days);
            return base;
        });
    });

    it('calcula data de alerta por antecedência', () => {
        const result = reminderAlertService.obterDataAlerta(
            new Date('2026-01-10T12:00:00.000Z'),
            'DOIS_DIAS'
        );
        expect(result).toBe('2026-01-09');
    });

    it('cria notificações só para lembretes da data de alerta', async () => {
        prisma.lembrete.findMany.mockResolvedValue([
            {
                id: 'l1',
                usuarioId: 'u1',
                titulo: 'Conta 1',
                valor: 100,
                dataVencimento: '2026-01-11T12:00:00.000Z',
                antecedencia: 'UM_DIA',
                pago: false,
            },
            {
                id: 'l2',
                usuarioId: 'u1',
                titulo: 'Conta 2',
                valor: 50,
                dataVencimento: '2026-01-20T12:00:00.000Z',
                antecedencia: 'UM_DIA',
                pago: false,
            },
        ]);
        notificationService.verificarNotificacaoDuplicadaLembrete.mockResolvedValue(false);
        notificationService.criarNotificacao.mockResolvedValue({ id: 'n1' });

        const result = await reminderAlertService.verificarLembretesENotificar();

        expect(notificationService.criarNotificacao).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ criadas: 1, verificados: 2, dataReferencia: '2026-01-10' });
    });
});
