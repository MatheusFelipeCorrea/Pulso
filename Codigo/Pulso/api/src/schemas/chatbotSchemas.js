const { z } = require('zod');

const historicoItemSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(4000),
});

const enviarMensagemSchema = z.object({
    body: z.object({
        mensagem: z
            .string()
            .trim()
            .min(1, 'Mensagem obrigatória')
            .max(2000, 'Mensagem muito longa'),
        historico: z.array(historicoItemSchema).max(20).optional().default([]),
        modo: z.enum(['chat', 'quick_add']).optional().default('chat'),
        conversaId: z.string().min(1).optional().nullable(),
    }),
});

const confirmarTransacaoSchema = z.object({
    body: z.object({
        tipo: z.enum(['DESPESA', 'RECEITA']),
        valor: z.number().positive('Valor deve ser maior que zero'),
        descricao: z.string().trim().max(255).optional(),
        data: z.union([z.string().datetime(), z.coerce.date()]).optional(),
        recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT', 'POUPANCA']).optional().default('DINHEIRO'),
        categoriaId: z.string().min(1).optional(),
        categoriaNome: z.string().trim().max(80).optional(),
    }),
});

const conversaIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'ID da conversa obrigatório'),
    }),
});

const criarConversaSchema = z.object({
    body: z
        .object({
            titulo: z.string().trim().max(120).optional(),
        })
        .optional()
        .default({}),
});

module.exports = {
    enviarMensagemSchema,
    confirmarTransacaoSchema,
    conversaIdParamSchema,
    criarConversaSchema,
};
