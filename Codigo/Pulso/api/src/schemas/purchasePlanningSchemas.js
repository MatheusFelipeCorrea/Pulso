const { z } = require('zod');

const prioridadeSchema = z.enum(['ALTA', 'MEDIA', 'BAIXA']);
const categoriaSchema = z.enum(['TECNOLOGIA', 'ELETRONICOS', 'ACESSORIOS', 'OUTROS']);

const criarMetaInlineSchema = z.object({
    nome: z.string().trim().max(100).optional(),
    valorAlvo: z.coerce.number().positive().optional(),
    prazo: z.union([z.string().datetime(), z.coerce.date()]),
    tipo: z.enum(['CURTO_PRAZO', 'LONGO_PRAZO']).optional(),
});

const criarItemSchema = z.object({
    body: z.object({
        nome: z.string().trim().min(1).max(120),
        valorEstimado: z.coerce.number().positive(),
        prioridade: prioridadeSchema.optional().default('MEDIA'),
        categoria: categoriaSchema.optional(),
        observacoes: z.string().max(300).optional().nullable(),
        linkProduto: z
            .preprocess(
                (value) => (value === '' || value == null ? null : value),
                z.string().url().max(500).nullable().optional()
            ),
        imagemUrl: z
            .preprocess(
                (value) => (value === '' || value == null ? null : value),
                z.string().url().max(2048).nullable().optional()
            ),
        buscarImagemAuto: z.boolean().optional().default(true),
        simularParcelas: z.boolean().optional().default(true),
        parcelas: z.coerce.number().int().min(1).max(48).optional().default(12),
        vincularMeta: z.boolean().optional().default(false),
        metaId: z.string().min(1).optional(),
        criarMeta: criarMetaInlineSchema.optional(),
    }),
});

const editarItemSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            nome: z.string().trim().min(1).max(120).optional(),
            valorEstimado: z.coerce.number().positive().optional(),
            prioridade: prioridadeSchema.optional(),
            categoria: categoriaSchema.optional(),
            observacoes: z.string().max(300).optional().nullable(),
            linkProduto: z
            .preprocess(
                (value) => (value === '' || value == null ? null : value),
                z.string().url().max(500).nullable().optional()
            ),
            imagemUrl: z
                .preprocess(
                    (value) => (value === '' || value == null ? null : value),
                    z.string().url().max(2048).nullable().optional()
                ),
            buscarImagemAuto: z.boolean().optional(),
            simularParcelas: z.boolean().optional(),
            parcelas: z.coerce.number().int().min(1).max(48).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const itemIdParamSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

const vincularMetaSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        metaId: z.string().min(1).optional(),
        ajustarMetaValor: z.boolean().optional().default(false),
        criarMeta: criarMetaInlineSchema.optional(),
    }),
});

const comprarItemSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            categoriaId: z.string().min(1).optional(),
            recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT']).optional(),
        })
        .optional()
        .default({}),
});

const resolverImagemSchema = z.object({
    body: z.object({
        nome: z.string().trim().min(1).max(120).optional(),
        imagemUrl: z
            .preprocess(
                (value) => (value === '' || value == null ? null : value),
                z.string().url().max(2048).nullable().optional()
            ),
        linkProduto: z
            .preprocess(
                (value) => (value === '' || value == null ? null : value),
                z.string().url().max(500).nullable().optional()
            ),
        buscarNaInternet: z.boolean().optional().default(true),
    }),
});

module.exports = {
    criarItemSchema,
    editarItemSchema,
    itemIdParamSchema,
    vincularMetaSchema,
    comprarItemSchema,
    resolverImagemSchema,
};
