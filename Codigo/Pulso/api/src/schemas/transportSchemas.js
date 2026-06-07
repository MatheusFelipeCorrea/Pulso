const { z } = require('zod');

const periodoQuery = z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Período deve estar no formato YYYY-MM')
    .optional();

const obterSaldoQuerySchema = z.object({
    query: z.object({
        periodo: periodoQuery,
    }),
});

const registrarVendaSchema = z.object({
    body: z.object({
        nomeComprador: z.string().min(1, 'Comprador é obrigatório').max(120),
        dataVenda: z.union([z.string().datetime(), z.coerce.date()]),
        valorNominal: z.number().positive('Valor nominal deve ser maior que zero'),
        valorRecebido: z.number().positive('Valor recebido deve ser maior que zero'),
    }),
});

const listarVendasQuerySchema = z.object({
    query: z.object({
        periodo: periodoQuery,
        pagina: z.coerce.number().int().positive().optional().default(1),
        limite: z.coerce.number().int().positive().max(100).optional().default(10),
    }),
});

const registrarUsoSchema = z.object({
    body: z.object({
        quantidade: z
            .number()
            .int()
            .min(1, 'Quantidade de passagens deve ser pelo menos 1'),
        valorPorPassagem: z.number().positive('Valor por passagem deve ser maior que zero'),
        data: z.union([z.string().datetime(), z.coerce.date()]),
        salvarValorPadrao: z.boolean().optional().default(false),
    }),
});

const listarUsosQuerySchema = z.object({
    query: z.object({
        periodo: periodoQuery,
        pagina: z.coerce.number().int().positive().optional().default(1),
        limite: z.coerce.number().int().positive().max(100).optional().default(10),
    }),
});

const atualizarVtHabilitadoSchema = z.object({
    body: z.object({
        vtHabilitado: z.boolean(),
    }),
});

module.exports = {
    obterSaldoQuerySchema,
    registrarVendaSchema,
    listarVendasQuerySchema,
    registrarUsoSchema,
    listarUsosQuerySchema,
    atualizarVtHabilitadoSchema,
};
