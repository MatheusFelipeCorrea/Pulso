const cronAuthMiddleware = require('../../../src/middlewares/cronAuthMiddleware');
const env = require('../../../src/config/env');

describe('cronAuthMiddleware', () => {
    const buildRes = () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
        return res;
    };

    afterEach(() => {
        env.CRON_SECRET = process.env.CRON_SECRET;
    });

    it('retorna 503 quando segredo não está configurado', () => {
        env.CRON_SECRET = '';
        const res = buildRes();

        cronAuthMiddleware({ headers: {} }, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(503);
    });

    it('retorna 401 quando bearer token está incorreto', () => {
        env.CRON_SECRET = 'abc';
        const res = buildRes();

        cronAuthMiddleware({ headers: { authorization: 'Bearer errado' } }, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('chama next quando token confere', () => {
        env.CRON_SECRET = 'abc';
        const next = jest.fn();

        cronAuthMiddleware({ headers: { authorization: 'Bearer abc' } }, buildRes(), next);
        expect(next).toHaveBeenCalledWith();
    });
});
