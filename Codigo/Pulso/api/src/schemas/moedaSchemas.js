const { z } = require('zod');

const currencyCodeSchema = z.string().trim().toUpperCase().length(3);

const converterQuerySchema = z.object({
    query: z.object({
        valor: z.coerce.number().nonnegative(),
        de: currencyCodeSchema.default('BRL'),
        para: currencyCodeSchema.default('USD'),
    }),
});

const historicoQuerySchema = z.object({
    query: z.object({
        codigo: currencyCodeSchema.default('USD'),
        dias: z.coerce.number().int().min(7).max(90).default(30),
    }),
});

const cotacoesQuerySchema = z.object({
    query: z.object({
        codigos: z
            .string()
            .optional()
            .transform((value) =>
                value
                    ? value
                          .split(',')
                          .map((item) => item.trim().toUpperCase())
                          .filter(Boolean)
                    : []
            ),
    }),
});

const favoritaBodySchema = z.object({
    body: z.object({
        codigo: currencyCodeSchema,
    }),
});

const favoritaParamSchema = z.object({
    params: z.object({
        codigo: currencyCodeSchema,
    }),
});

module.exports = {
    converterQuerySchema,
    historicoQuerySchema,
    cotacoesQuerySchema,
    favoritaBodySchema,
    favoritaParamSchema,
};
