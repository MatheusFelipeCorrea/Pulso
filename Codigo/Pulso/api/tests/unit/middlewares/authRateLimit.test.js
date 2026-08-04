let rateLimitInstance = 0;

const mockRateLimit = jest.fn(() => {
    rateLimitInstance += 1;
    return { max: 5, instanceId: rateLimitInstance };
});

jest.mock('express-rate-limit', () => ({
    rateLimit: (...args) => mockRateLimit(...args),
}));

describe('authRateLimit middleware', () => {
    beforeEach(() => {
        rateLimitInstance = 0;
        mockRateLimit.mockReset();
        mockRateLimit.mockImplementation(() => {
            rateLimitInstance += 1;
            return { max: 5, instanceId: rateLimitInstance };
        });
    });

    it('cria limitadores independentes por rota sensível', () => {
        jest.isolateModules(() => {
            const limiters = require('../../../src/middlewares/authRateLimit');

            expect(mockRateLimit).toHaveBeenCalledTimes(9);
            expect(limiters.authLoginRateLimit.instanceId).not.toBe(
                limiters.authRegisterRateLimit.instanceId
            );
            expect(limiters.authForgotPasswordRateLimit.instanceId).not.toBe(
                limiters.authLoginRateLimit.instanceId
            );
            expect(limiters.authSensitiveRateLimit).toBe(limiters.authLoginRateLimit);
        });
    });

    it('configura 5 req/min com mensagem padronizada', () => {
        jest.isolateModules(() => {
            require('../../../src/middlewares/authRateLimit');
        });

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
    });
});
