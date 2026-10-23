const { z } = require('zod');

const participanteInputSchema = z.object({
    nome: z.string().min(1, 'Nome do participante é obrigatório').max(120),
    valor: z.coerce.number().positive().optional(),
});

const dateInput = z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    z.coerce.date({ message: 'Data inválida' }),
]);

const criarDivisaoSchema = z.object({
    body: z
        .object({
            titulo: z.string().min(1, 'Título é obrigatório').max(120),
            valorTotal: z.coerce.number().positive('Valor total deve ser maior que zero'),
            tipo: z.enum(['IGUAL', 'PERSONALIZADA']).default('IGUAL'),
            data: dateInput,
            icone: z.string().max(40).optional().nullable(),
            cor: z.string().max(20).optional().nullable(),
            observacao: z.string().max(250).optional().nullable(),
            participantes: z.array(participanteInputSchema).min(1, 'Informe ao menos 1 participante além de você'),
            pagoPor: z.string().min(1, 'Informe quem pagou a conta'),
            valorOrganizador: z.coerce.number().positive().optional(),
        })
        .superRefine((data, ctx) => {
            if (data.tipo === 'PERSONALIZADA') {
                if (data.valorOrganizador === undefined) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Informe o valor da sua própria parte',
                        path: ['valorOrganizador'],
                    });
                }
                data.participantes.forEach((participante, index) => {
                    if (participante.valor === undefined) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Informe o valor de cada participante na divisão personalizada',
                            path: ['participantes', index, 'valor'],
                        });
                    }
                });
            }
        }),
});

const editarDivisaoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            titulo: z.string().min(1).max(120).optional(),
            valorTotal: z.coerce.number().positive().optional(),
            tipo: z.enum(['IGUAL', 'PERSONALIZADA']).optional(),
            data: dateInput.optional(),
            icone: z.string().max(40).optional().nullable(),
            cor: z.string().max(20).optional().nullable(),
            observacao: z.string().max(250).optional().nullable(),
            participantes: z.array(participanteInputSchema).min(1).optional(),
            pagoPor: z.string().min(1).optional(),
            valorOrganizador: z.coerce.number().positive().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const listarHistoricoQuerySchema = z.object({
    query: z.object({
        pagina: z.coerce.number().int().positive().optional().default(1),
        limite: z.coerce.number().int().positive().max(50).optional().default(10),
    }),
});

const divisaoIdParamSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

const participanteIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        participanteId: z.string().min(1),
    }),
});

const criarLembreteCobrancaSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z.object({
        participanteIds: z.array(z.string().min(1)).min(1, 'Selecione ao menos um participante'),
        titulo: z.string().max(120).optional(),
        valor: z.coerce.number().positive().optional(),
        dataVencimento: dateInput.optional(),
        horaLembrete: z.string().optional(),
        antecedencia: z.string().optional(),
        categoria: z.string().optional(),
        sincronizarGoogle: z.boolean().optional(),
        repetirCadaDias: z.coerce.number().int().positive().optional().nullable(),
    }),
});

module.exports = {
    criarDivisaoSchema,
    editarDivisaoSchema,
    listarHistoricoQuerySchema,
    divisaoIdParamSchema,
    participanteIdParamSchema,
    criarLembreteCobrancaSchema,
};
