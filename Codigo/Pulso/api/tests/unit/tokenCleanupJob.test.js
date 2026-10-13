const { runTokenCleanup } = require('../../src/jobs/tokenCleanupJob');
const { authRepositoryMock } = require('../helpers/authMocks');

describe('tokenCleanupJob', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('executa limpeza nos três repositórios em paralelo', async () => {
        authRepositoryMock.deleteExpiredRefreshTokens.mockResolvedValue({ count: 2 });
        authRepositoryMock.clearExpiredVerificationTokens.mockResolvedValue({ count: 1 });
        authRepositoryMock.clearExpiredResetTokens.mockResolvedValue({ count: 3 });

        const result = await runTokenCleanup();

        expect(authRepositoryMock.deleteExpiredRefreshTokens).toHaveBeenCalledTimes(1);
        expect(authRepositoryMock.clearExpiredVerificationTokens).toHaveBeenCalledTimes(1);
        expect(authRepositoryMock.clearExpiredResetTokens).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            refreshTokensRemoved: 2,
            verificationTokensCleared: 1,
            resetTokensCleared: 3,
        });
    });

    it('retorna zeros quando não há tokens para limpar', async () => {
        authRepositoryMock.deleteExpiredRefreshTokens.mockResolvedValue({ count: 0 });
        authRepositoryMock.clearExpiredVerificationTokens.mockResolvedValue({ count: 0 });
        authRepositoryMock.clearExpiredResetTokens.mockResolvedValue({ count: 0 });

        const result = await runTokenCleanup();

        expect(result).toEqual({
            refreshTokensRemoved: 0,
            verificationTokensCleared: 0,
            resetTokensCleared: 0,
        });
    });
});
