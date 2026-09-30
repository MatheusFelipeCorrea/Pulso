const AppError = require('../../../src/utils/appError');

describe('appError', () => {
    it('cria AppError com propriedades padrão', () => {
        const error = new AppError('Falha de teste', 400);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Falha de teste');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('error');
        expect(error.isOperational).toBe(true);
        expect(error.stack).toContain('Falha de teste');
    });
});
