const errorMiddleware = require('../../../src/middlewares/errorMiddleware');
const AppError = require('../../../src/utils/appError');

describe('errorMiddleware', () => {
    const buildRes = () => {
        const res = {};
        res.status = jest.fn(() => res);
        res.json = jest.fn(() => res);
        return res;
    };

    it('retorna 400 para corpo inválido (SyntaxError)', () => {
        const res = buildRes();
        const err = Object.assign(new SyntaxError('json inválido'), { status: 400, body: '{}' });

        errorMiddleware(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Corpo da requisição inválido',
        });
    });

    it('retorna status de AppError operacional', () => {
        const res = buildRes();
        const err = new AppError('Falha conhecida', 422);

        errorMiddleware(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Falha conhecida' });
    });

    it('retorna 500 para erro inesperado', () => {
        const res = buildRes();
        const err = new Error('boom');

        errorMiddleware(err, {}, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Erro interno do servidor',
        });
    });
});
