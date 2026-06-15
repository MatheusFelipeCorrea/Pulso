const { z } = require('zod');

const dateInput = z.union([
    z.string().datetime({ message: 'Data inválida' }),
    z.coerce.date({ message: 'Data inválida' }),
]);

const criarMetaSchema = z.object({
    body: z.object({
        nome: z.string().min(1, 'Nome da meta é obrigatório').max(100),
        valorAlvo: z.coerce.number().positive('Valor alvo deve ser maior que zero'),
        prazo: dateInput,
        tipo: z.enum(['CURTO_PRAZO', 'LONGO_PRAZO']).optional(),
        descricao: z.string().max(500).optional().nullable(),
        prioridade: z.enum(['ALTA', 'MEDIA', 'BAIXA']).optional().nullable(),
    }),
});

const editarMetaSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            nome: z.string().min(1).max(100).optional(),
            valorAlvo: z.coerce.number().positive().optional(),
            prazo: dateInput.optional(),
            tipo: z.enum(['CURTO_PRAZO', 'LONGO_PRAZO']).optional(),
            status: z.enum(['ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA']).optional(),
            descricao: z.string().max(500).optional().nullable(),
            prioridade: z.enum(['ALTA', 'MEDIA', 'BAIXA']).optional().nullable(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const registrarAporteSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        valor: z.coerce.number().positive('Valor deve ser maior que zero'),
        data: dateInput,
    }),
});

const listarMetasQuerySchema = z.object({
    query: z.object({
        status: z.enum(['ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA']).optional(),
        tipo: z.enum(['CURTO_PRAZO', 'LONGO_PRAZO']).optional(),
        busca: z.string().optional(),
        prazoInicio: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .optional(),
        prazoFim: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .optional(),
        pagina: z.coerce.number().int().positive().optional(),
        limite: z.coerce.number().int().positive().optional(),
    }),
});

const metaIdParamSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

const aporteIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        aporteId: z.string().min(1),
    }),
});

module.exports = {
    criarMetaSchema,
    editarMetaSchema,
    registrarAporteSchema,
    listarMetasQuerySchema,
    metaIdParamSchema,
    aporteIdParamSchema,
};
