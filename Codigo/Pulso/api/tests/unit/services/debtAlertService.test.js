jest.mock('../../../src/repositories/debtRepository');
jest.mock('../../../src/services/notificationService', () => ({
    verificarNotificacaoDuplicadaDivida: jest.fn(),
    criarNotificacao: jest.fn(),
}));
jest.mock('../../../src/utils/dateTimezone', () => ({
    formatDateOnly: jest.fn((d) => new Date(d).toISOString().slice(0, 10)),
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
    });

    it('notifica dívidas que vencem em 7, 2 ou 0 dias com saldo restante', async () => {
        debtRepository.buscarParaAlertas.mockResolvedValue([
            {
                id: 'd1',
                usuarioId: 'u1',
                nomePessoa: 'Ana',
                valor: 100,
                prazoDevolucao: '2026-01-10T12:00:00.000Z',
                direcao: 'ME_DEVEM',
                pagamentos: [],
            },
            {
                id: 'd2',
                usuarioId: 'u1',
                nomePessoa: 'Bia',
                valor: 80,
                prazoDevolucao: '2026-01-12T12:00:00.000Z',
                direcao: 'EU_DEVO',
                pagamentos: [{ valor: 30 }],
            },
            {
                id: 'd3',
                usuarioId: 'u1',
                nomePessoa: 'Cara',
                valor: 30,
                prazoDevolucao: '2026-01-17T12:00:00.000Z',
                direcao: 'EU_DEVO',
                pagamentos: [],
            },
            {
                id: 'd4',
                usuarioId: 'u1',
                nomePessoa: 'Dani',
                valor: 50,
                prazoDevolucao: '2026-01-10T12:00:00.000Z',
                direcao: 'ME_DEVEM',
                pagamentos: [{ valor: 50 }],
            },
        ]);
        notificationService.verificarNotificacaoDuplicadaDivida.mockResolvedValue(false);
        notificationService.criarNotificacao.mockResolvedValue({ id: 'n1' });

        const result = await debtAlertService.verificarDividasENotificar();

        expect(notificationService.criarNotificacao).toHaveBeenCalledTimes(3);
        expect(result).toEqual({ criadas: 3, verificadas: 4 });

        const mensagens = notificationService.criarNotificacao.mock.calls.map((call) => call[1].mensagem);
        expect(mensagens.some((msg) => msg.includes('Saldo restante:'))).toBe(true);
        expect(mensagens.some((msg) => msg.includes('50,00'))).toBe(true);
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
                pagamentos: [],
            },
        ]);
        notificationService.verificarNotificacaoDuplicadaDivida.mockResolvedValue(true);

        const result = await debtAlertService.verificarDividasENotificar();
        expect(result).toEqual({ criadas: 0, verificadas: 1 });
    });
});
