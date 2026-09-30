const validateMiddleware = require('../../../src/middlewares/validateMiddleware');

describe('validateMiddleware', () => {
    it('chama next com AppError quando schema falha', () => {
        const middleware = validateMiddleware({
            safeParse: jest.fn(() => ({
                success: false,
                error: { issues: [{ message: 'campo inválido' }] },
            })),
        });
        const next = jest.fn();

        middleware({ body: {}, params: {}, query: {} }, {}, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                isOperational: true,
                statusCode: 400,
                message: 'campo inválido',
            })
        );
    });

    it('normaliza body/params/query quando válido', () => {
        const middleware = validateMiddleware({
            safeParse: jest.fn(() => ({
                success: true,
                data: { body: { ok: 1 }, params: { id: '1' }, query: { p: '2' } },
            })),
        });
        const req = { body: {}, params: {}, query: {} };
        const next = jest.fn();

        middleware(req, {}, next);

        expect(req).toEqual({ body: { ok: 1 }, params: { id: '1' }, query: { p: '2' } });
        expect(next).toHaveBeenCalledWith();
    });

    it('usa mensagem padrão quando issue não informa texto', () => {
        const middleware = validateMiddleware({
            safeParse: jest.fn(() => ({
                success: false,
                error: { issues: [{}] },
            })),
        });
        const next = jest.fn();

        middleware({ body: {}, params: {}, query: {} }, {}, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Dados inválidos',
            })
        );
    });

    it('aplica apenas campos presentes no resultado parseado', () => {
        const middleware = validateMiddleware({
            safeParse: jest.fn(() => ({
                success: true,
                data: { body: { ok: true } },
            })),
        });
        const req = { body: {}, params: { id: '1' }, query: { p: '2' } };
        const next = jest.fn();

        middleware(req, {}, next);

        expect(req.body).toEqual({ ok: true });
        expect(req.params).toEqual({ id: '1' });
        expect(next).toHaveBeenCalledWith();
    });
});
