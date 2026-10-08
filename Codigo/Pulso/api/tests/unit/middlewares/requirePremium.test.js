jest.mock('../../../src/config/database', () => ({
    configuracaoUsuario: { findUnique: jest.fn() },
}));

const prisma = require('../../../src/config/database');
const requirePremium = require('../../../src/middlewares/requirePremium');

describe('requirePremium', () => {
    it('401 sem usuário', async () => {
        const next = jest.fn();
        await requirePremium({ user: null }, {}, next);
        expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it('403 para plano FREE', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValueOnce({ plano: 'FREE' });
        const next = jest.fn();
        const req = { user: { id: 'u1' } };
        await requirePremium(req, {}, next);
        expect(next.mock.calls[0][0].code).toBe('PREMIUM_REQUIRED');
        expect(req.user.plano).toBe('FREE');
    });

    it('libera PREMIUM', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValueOnce({ plano: 'PREMIUM' });
        const next = jest.fn();
        await requirePremium({ user: { id: 'u1' } }, {}, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('trata config ausente como FREE', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValueOnce(null);
        const next = jest.fn();
        await requirePremium({ user: { id: 'u1' } }, {}, next);
        expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
});
