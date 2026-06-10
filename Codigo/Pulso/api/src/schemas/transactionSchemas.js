const { z } = require('zod');

const criarTransacaoSchema = z.object({
    body: z.object({
        tipo: z.enum(['RECEITA', 'DESPESA']),
        categoriaId: z.string().min(1, 'Categoria é obrigatória'),
        recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT']),
        valor: z.number().positive('Valor deve ser maior que zero'),
        descricao: z.string().max(255).optional(),
        data: z.union([z.string().datetime(), z.coerce.date()]),
        tags: z.array(z.string().min(1)).optional().default([]),
        recorrente: z.boolean().optional().default(false),
        regraRecorrencia: z.string().optional(),
    }),
});

const editarTransacaoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z
        .object({
            tipo: z.enum(['RECEITA', 'DESPESA']).optional(),
            categoriaId: z.string().min(1).optional(),
            recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT']).optional(),
            valor: z.number().positive().optional(),
            descricao: z.string().max(255).optional(),
            data: z.union([z.string().datetime(), z.coerce.date()]).optional(),
            tags: z.array(z.string().min(1)).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const listarTransacoesQuerySchema = z.object({
    query: z.object({
        periodo: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Período deve estar no formato YYYY-MM')
            .optional(),
        categoria: z.string().optional(),
        categoriaNome: z.string().max(60).optional(),
        tipo: z.enum(['RECEITA', 'DESPESA', 'TODOS']).optional().default('TODOS'),
        recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT', 'TODOS']).optional().default('TODOS'),
        busca: z.string().optional(),
        pagina: z.coerce.number().int().positive().optional().default(1),
        limite: z.coerce.number().int().positive().max(100).optional().default(10),
    }),
});

const excluirTransacaoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    query: z.object({
        excluirFuturas: z
            .enum(['true', 'false'])
            .optional()
            .default('false')
            .transform((v) => v === 'true'),
    }),
});

const transacaoIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

module.exports = {
    criarTransacaoSchema,
    editarTransacaoSchema,
    listarTransacoesQuerySchema,
    excluirTransacaoSchema,
    transacaoIdParamSchema,
};
