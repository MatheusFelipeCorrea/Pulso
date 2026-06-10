const { z } = require('zod');

const queryMesSchema = z.object({
    query: z.object({
        mes: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Formato inválido. Use YYYY-MM')
            .optional(),
    }),
});

const salvarOrcamentosSchema = z.object({
    body: z.object({
        mesReferencia: z
            .string()
            .regex(/^\d{4}-\d{2}-01$/, 'Formato inválido. Use YYYY-MM-01'),
        limites: z
            .array(
                z.object({
                    categoriaId: z.string().min(1),
                    limiteValor: z.number().positive('Limite deve ser maior que zero'),
                })
            )
            .default([]),
    }),
});

const copiarOrcamentoSchema = z.object({
    body: z.object({
        mesOrigem: z.string().regex(/^\d{4}-\d{2}-01$/),
        mesDestino: z.string().regex(/^\d{4}-\d{2}-01$/),
    }),
});

const removerOrcamentoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

module.exports = {
    queryMesSchema,
    salvarOrcamentosSchema,
    copiarOrcamentoSchema,
    removerOrcamentoSchema,
};
