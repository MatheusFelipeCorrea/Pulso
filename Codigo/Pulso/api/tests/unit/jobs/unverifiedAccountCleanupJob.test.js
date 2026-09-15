const { runUnverifiedAccountCleanup } = require('../../../src/jobs/unverifiedAccountCleanupJob');
const { authRepositoryMock } = require('../../helpers/authMocks');
const logger = require('../../../src/utils/logger');

describe('unverifiedAccountCleanupJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        authRepositoryMock.deleteUnverifiedEmailAccountsOlderThan = jest.fn();
    });

    it('remove contas email não verificadas com mais de 30 dias', async () => {
        authRepositoryMock.deleteUnverifiedEmailAccountsOlderThan.mockResolvedValue({ count: 2 });

        const result = await runUnverifiedAccountCleanup();

        expect(authRepositoryMock.deleteUnverifiedEmailAccountsOlderThan).toHaveBeenCalledWith(
            expect.any(Date)
        );
        expect(result).toEqual({ removidas: 2, maxAgeDays: 30 });
        expect(logger.info).toHaveBeenCalled();
    });

    it('não loga quando nada foi removido', async () => {
        authRepositoryMock.deleteUnverifiedEmailAccountsOlderThan.mockResolvedValue({ count: 0 });

        await runUnverifiedAccountCleanup();

        expect(logger.info).not.toHaveBeenCalled();
    });
});
