const mockRateLimit = jest.fn((cfg) => cfg);

jest.mock('express-rate-limit', () => ({
    rateLimit: mockRateLimit,
}));

describe('authRateLimit middleware', () => {
    it('configura rate limit para rotas sensíveis', () => {
        mockRateLimit.mockImplementation((cfg) => cfg);
        jest.isolateModules(() => {
            const { authSensitiveRateLimit } = require('../../../src/middlewares/authRateLimit');
            expect(mockRateLimit).toHaveBeenCalledWith(
                expect.objectContaining({
                    windowMs: 60000,
                    max: 5,
                    standardHeaders: true,
                    legacyHeaders: false,
                    message: {
                        status: 'error',
                        message: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
                    },
                })
            );
            expect(authSensitiveRateLimit).toEqual(expect.objectContaining({ max: 5 }));
        });
    });
});
