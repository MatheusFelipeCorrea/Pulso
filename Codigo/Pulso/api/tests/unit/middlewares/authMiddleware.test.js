jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../src/middlewares/authMiddleware');

describe('authMiddleware', () => {
    it('rejeita quando header não existe', async () => {
        const next = jest.fn();

        await authMiddleware({ headers: {} }, {}, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401, message: 'Token não fornecido ou inválido.' })
        );
    });

    it('rejeita token expirado', async () => {
        jwt.verify.mockImplementation(() => {
            const err = new Error('expired');
            err.name = 'TokenExpiredError';
            throw err;
        });
        const next = jest.fn();

        await authMiddleware({ headers: { authorization: 'Bearer token' } }, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401, message: 'Token expirado.' })
        );
    });

    it('injeta req.user quando token é válido', async () => {
        jwt.verify.mockReturnValue({
            sub: 'u1',
            email: 'u1@pulso.dev',
            nome: 'User',
        });
        const next = jest.fn();
        const req = { headers: { authorization: 'Bearer token' } };

        await authMiddleware(req, {}, next);

        expect(req.user).toEqual({ id: 'u1', email: 'u1@pulso.dev', nome: 'User' });
        expect(next).toHaveBeenCalledWith();
    });

    it('rejeita token malformado', async () => {
        jwt.verify.mockImplementation(() => {
            const err = new Error('invalid');
            err.name = 'JsonWebTokenError';
            throw err;
        });
        const next = jest.fn();

        await authMiddleware({ headers: { authorization: 'Bearer token' } }, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401, message: 'Token inválido.' })
        );
    });

    it('rejeita token sem subject', async () => {
        jwt.verify.mockReturnValue({ email: 'a@b.c' });
        const next = jest.fn();

        await authMiddleware({ headers: { authorization: 'Bearer token' } }, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 401, message: 'Token inválido.' })
        );
    });
});
