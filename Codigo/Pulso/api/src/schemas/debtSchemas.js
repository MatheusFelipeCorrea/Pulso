const { z } = require('zod');
const { formatPersonName } = require('../utils/personName');

const personNameField = z
    .string()
    .min(1, 'Nome da pessoa é obrigatório')
    .max(120, 'Nome da pessoa deve ter no máximo 120 caracteres')
    .transform(formatPersonName);

const personNameFieldOptional = z
    .string()
    .min(1)
    .max(120)
    .transform(formatPersonName)
    .optional();

const dateInput = z.union([
    z.string().datetime({ message: 'Data inválida' }),
    z.coerce.date({ message: 'Data inválida' }),
]);

const criarDividaSchema = z.object({
    body: z.object({
        direcao: z.enum(['ME_DEVEM', 'EU_DEVO'], { message: 'Direção inválida' }),
        nomePessoa: personNameField,
        valor: z.coerce.number().positive('Valor deve ser maior que zero'),
        dataEmprestimo: dateInput,
        prazoDevolucao: dateInput.optional().nullable(),
        observacao: z.string().max(250, 'Observação deve ter no máximo 250 caracteres').optional().nullable(),
    }),
});

const editarDividaSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            direcao: z.enum(['ME_DEVEM', 'EU_DEVO']).optional(),
            nomePessoa: personNameFieldOptional,
            valor: z.coerce.number().positive().optional(),
            dataEmprestimo: dateInput.optional(),
            prazoDevolucao: dateInput.optional().nullable(),
            observacao: z.string().max(250).optional().nullable(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const registrarPagamentoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        valor: z.coerce.number().positive('Valor deve ser maior que zero'),
        dataPagamento: dateInput,
        observacao: z.string().max(250).optional().nullable(),
    }),
});

const listarDividasQuerySchema = z.object({
    query: z.object({
        direcao: z.enum(['ME_DEVEM', 'EU_DEVO', 'TODOS']).optional().default('TODOS'),
        quitada: z
            .enum(['true', 'false'])
            .optional()
            .transform((v) => (v === undefined ? undefined : v === 'true')),
        status: z.enum(['vencida', 'vence_breve']).optional(),
        busca: z.string().optional(),
        ordenarValor: z.enum(['asc', 'desc']).optional(),
        dataInicio: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataInicio deve estar no formato YYYY-MM-DD')
            .optional(),
        dataFim: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataFim deve estar no formato YYYY-MM-DD')
            .optional(),
        prazoInicio: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'prazoInicio deve estar no formato YYYY-MM-DD')
            .optional(),
        prazoFim: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'prazoFim deve estar no formato YYYY-MM-DD')
            .optional(),
        pagina: z.coerce.number().int().positive().optional().default(1),
        limite: z.coerce.number().int().positive().max(100).optional().default(10),
    }),
});

const dividaIdParamSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

const pagamentoIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        pagamentoId: z.string().min(1),
    }),
});

module.exports = {
    criarDividaSchema,
    editarDividaSchema,
    registrarPagamentoSchema,
    listarDividasQuerySchema,
    dividaIdParamSchema,
    pagamentoIdParamSchema,
};
