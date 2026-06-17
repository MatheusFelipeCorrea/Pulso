jest.mock('../../../src/repositories/notificationRepository', () => ({
    excluirLidasAntigas: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const notificationRepository = require('../../../src/repositories/notificationRepository');
const { runNotificationCleanup } = require('../../../src/jobs/notificationCleanupJob');

describe('notificationCleanupJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('remove notificações lidas com mais de 30 dias', async () => {
        notificationRepository.excluirLidasAntigas.mockResolvedValueOnce({ count: 3 });

        const summary = await runNotificationCleanup();

        expect(notificationRepository.excluirLidasAntigas).toHaveBeenCalledWith(30);
        expect(summary.removidas).toBe(3);
        expect(summary.diasRetencao).toBe(30);
    });
});
