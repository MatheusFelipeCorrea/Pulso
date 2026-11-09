const { z } = require('zod');

const mesQuerySchema = z.object({
    query: z.object({
        mes: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Mês deve estar no formato YYYY-MM')
            .optional(),
    }),
});

const regenerarSchema = z.object({
    body: z
        .object({
            mes: z
                .string()
                .regex(/^\d{4}-\d{2}$/, 'Mês deve estar no formato YYYY-MM')
                .optional(),
        })
        .optional()
        .default({}),
    query: z
        .object({
            mes: z
                .string()
                .regex(/^\d{4}-\d{2}$/, 'Mês deve estar no formato YYYY-MM')
                .optional(),
        })
        .optional()
        .default({}),
});

module.exports = {
    mesQuerySchema,
    regenerarSchema,
};
