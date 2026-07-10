const { z } = require('zod');

const TIPOS_TRANSACAO = ['RECEITA', 'DESPESA', 'TRANSFERENCIA'];
const RECURSOS_TRANSACAO = ['DINHEIRO', 'VA', 'VR', 'VT', 'POUPANCA'];

const criarTransacaoSchema = z.object({
    body: z
        .object({
            tipo: z.enum(TIPOS_TRANSACAO),
            categoriaId: z.string().min(1).optional(),
            recurso: z.enum(RECURSOS_TRANSACAO),
            recursoDestino: z.enum(RECURSOS_TRANSACAO).optional(),
            valor: z.number().positive('Valor deve ser maior que zero'),
            descricao: z.string().max(255).optional(),
            data: z.union([z.string().datetime(), z.coerce.date()]),
            tags: z.array(z.string().min(1)).optional().default([]),
            recorrente: z.boolean().optional().default(false),
            regraRecorrencia: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (data.tipo === 'TRANSFERENCIA') {
                if (!data.recursoDestino) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['recursoDestino'],
                        message: 'Recurso de destino é obrigatório para transferências',
                    });
                } else if (data.recursoDestino === data.recurso) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['recursoDestino'],
                        message: 'Recurso de destino deve ser diferente do recurso de origem',
                    });
                }
            } else if (!data.categoriaId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['categoriaId'],
                    message: 'Categoria é obrigatória',
                });
            }
        }),
});

const editarTransacaoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z
        .object({
            tipo: z.enum(TIPOS_TRANSACAO).optional(),
            categoriaId: z.string().min(1).optional(),
            recurso: z.enum(RECURSOS_TRANSACAO).optional(),
            recursoDestino: z.enum(RECURSOS_TRANSACAO).optional(),
            valor: z.number().positive().optional(),
            descricao: z.string().max(255).optional(),
            data: z.union([z.string().datetime(), z.coerce.date()]).optional(),
            tags: z.array(z.string().min(1)).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const sugerirCategoriaQuerySchema = z.object({
    query: z.object({
        tipo: z.enum(['RECEITA', 'DESPESA']),
        descricao: z.string().min(1),
    }),
});

const listarTransacoesQuerySchema = z.object({
    query: z.object({
        periodo: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Período deve estar no formato YYYY-MM')
            .optional(),
        dataInicio: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataInicio deve estar no formato YYYY-MM-DD')
            .optional(),
        dataFim: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataFim deve estar no formato YYYY-MM-DD')
            .optional(),
        categoria: z.string().optional(),
        categoriaNome: z.string().max(60).optional(),
        tipo: z.enum(['RECEITA', 'DESPESA', 'TRANSFERENCIA', 'TODOS']).optional().default('TODOS'),
        recurso: z.enum([...RECURSOS_TRANSACAO, 'TODOS']).optional().default('TODOS'),
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
    sugerirCategoriaQuerySchema,
};
