const { z } = require('zod');

const origemSchema = z.enum(['CONTA', 'VT', 'VA', 'VR']);

const linhaConfirmacaoSchema = z.object({
    id: z.string().optional(),
    data: z.string().min(1),
    valor: z.union([z.string(), z.number()]),
    descricao: z.string().max(255).optional().nullable(),
    tipo: z.enum(['RECEITA', 'DESPESA']),
    categoriaId: z.string().min(1),
    incluir: z.boolean().optional(),
    duplicata: z.boolean().optional(),
});

const confirmarImportacaoSchema = z.object({
    body: z.object({
        origem: origemSchema,
        linhas: z.array(linhaConfirmacaoSchema),
        saldoExtrato: z.union([z.string(), z.number()]).optional().nullable(),
    }),
});

const analisarImportacaoSchema = z.object({
    body: z.object({
        origem: origemSchema,
        mapeamento: z.string().optional(),
    }),
});

module.exports = {
    analisarImportacaoSchema,
    confirmarImportacaoSchema,
};
