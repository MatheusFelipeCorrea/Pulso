const { z } = require('zod');

const queryNotificacoesSchema = z.object({
    query: z.object({
        lida: z
            .enum(['true', 'false'])
            .optional()
            .transform((value) => {
                if (value === 'true') return true;
                if (value === 'false') return false;
                return undefined;
            }),
        limite: z.coerce.number().int().min(1).max(50).optional().default(10),
        pagina: z.coerce.number().int().min(1).optional().default(1),
    }),
});

const marcarLidaSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

module.exports = {
    queryNotificacoesSchema,
    marcarLidaSchema,
};
