const { confirmarImportacaoSchema } = require('../../../src/schemas/importSchemas');

describe('confirmarImportacaoSchema', () => {
    const linhaValida = {
        data: '2026-01-15T12:00:00.000Z',
        valor: '42.50',
        tipo: 'DESPESA',
        categoriaId: 'cat-1',
    };

    it('aceita origem VR quando enviada em req.body', () => {
        const result = confirmarImportacaoSchema.safeParse({
            body: {
                origem: 'VR',
                linhas: [linhaValida],
            },
            params: {},
            query: {},
        });

        expect(result.success).toBe(true);
        expect(result.data.body.origem).toBe('VR');
    });

    it('rejeita payload sem wrapper body (regressão do validateMiddleware)', () => {
        const result = confirmarImportacaoSchema.safeParse({
            origem: 'VR',
            linhas: [linhaValida],
        });

        expect(result.success).toBe(false);
    });
});
