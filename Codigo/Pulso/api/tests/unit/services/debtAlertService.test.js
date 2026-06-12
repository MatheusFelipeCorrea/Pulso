jest.mock('../../../src/repositories/debtRepository');
jest.mock('../../../src/services/notificationService', () => ({
    verificarNotificacaoDuplicadaDivida: jest.fn(),
    criarNotificacao: jest.fn(),
}));
jest.mock('../../../src/utils/dateTimezone', () => ({
    formatDateOnly: jest.fn((d) => new Date(d).toISOString().slice(0, 10)),
    addDays: jest.fn((date, days) => {
        const d = new Date(`${date}T00:00:00.000Z`);
        d.setDate(d.getDate() + days);
        return d;
    }),
    todayInTimezone: jest.fn(() => '2026-01-10'),
}));

const debtRepository = require('../../../src/repositories/debtRepository');
const notificationService = require('../../../src/services/notificationService');
const dateTimezone = require('../../../src/utils/dateTimezone');
const debtAlertService = require('../../../src/services/debtAlertService');

describe('debtAlertService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        dateTimezone.todayInTimezone.mockReturnValue('2026-01-10');
        dateTimezone.formatDateOnly.mockImplementation((d) => new Date(d).toISOString().slice(0, 10));
        dateTimezone.addDays.mockImplementation((date, days) => {
            const base = new Date(`${date}T00:00:00.000Z`);
            base.setDate(base.getDate() + days);
            return base;
        });
    });

    it('notifica dívidas que vencem hoje ou em dois dias', async () => {
        debtRepository.buscarParaAlertas.mockResolvedValue([
            {
                id: 'd1',
                usuarioId: 'u1',
                nomePessoa: 'Ana',
                valor: 100,
                prazoDevolucao: '2026-01-10T12:00:00.000Z',
                direcao: 'ME_DEVEM',
            },
            {
                id: 'd2',
                usuarioId: 'u1',
                nomePessoa: 'Bia',
                valor: 80,
                prazoDevolucao: '2026-01-12T12:00:00.000Z',
                direcao: 'EU_DEVO',
            },
            {
                id: 'd3',
                usuarioId: 'u1',
                nomePessoa: 'Cara',
                valor: 30,
                prazoDevolucao: '2026-01-30T12:00:00.000Z',
                direcao: 'EU_DEVO',
            },
        ]);
        notificationService.verificarNotificacaoDuplicadaDivida.mockResolvedValue(false);
        notificationService.criarNotificacao.mockResolvedValue({ id: 'n1' });

        const result = await debtAlertService.verificarDividasENotificar();

        expect(notificationService.criarNotificacao).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ criadas: 2, verificadas: 3 });
    });

    it('não conta notificação duplicada', async () => {
        debtRepository.buscarParaAlertas.mockResolvedValue([
            {
                id: 'd1',
                usuarioId: 'u1',
                nomePessoa: 'Ana',
                valor: 100,
                prazoDevolucao: '2026-01-10T12:00:00.000Z',
                direcao: 'ME_DEVEM',
            },
        ]);
        notificationService.verificarNotificacaoDuplicadaDivida.mockResolvedValue(true);

        const result = await debtAlertService.verificarDividasENotificar();
        expect(result).toEqual({ criadas: 0, verificadas: 1 });
    });
});
