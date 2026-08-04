jest.mock('../../../src/repositories/notificationRepository', () => ({
    excluirAntigas: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const notificationRepository = require('../../../src/repositories/notificationRepository');
const { runNotificationCleanup } = require('../../../src/jobs/notificationCleanupJob');

describe('notificationCleanupJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('remove notificações com mais de 30 dias, lidas ou não', async () => {
        notificationRepository.excluirAntigas.mockResolvedValueOnce({ count: 3 });

        const summary = await runNotificationCleanup();

        expect(notificationRepository.excluirAntigas).toHaveBeenCalledWith(30);
        expect(summary.removidas).toBe(3);
        expect(summary.diasRetencao).toBe(30);
    });
});
