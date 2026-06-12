const { z } = require('zod');
const { CATEGORY_ICONS, CATEGORY_COLORS } = require('../constants/categoryIcons');

const tipoCategoriaEnum = z.enum(['RECEITA', 'DESPESA']);
const iconeEnum = z.enum(CATEGORY_ICONS);
const corEnum = z.enum(CATEGORY_COLORS);

const criarCategoriaSchema = z.object({
    body: z.object({
        nome: z.string().trim().min(1, 'Nome é obrigatório').max(60),
        tipo: tipoCategoriaEnum,
        icone: iconeEnum,
        cor: corEnum,
    }),
});

const atualizarCategoriaSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z.object({
        nome: z.string().trim().min(1).max(60).optional(),
        icone: iconeEnum.optional(),
        cor: corEnum.optional(),
    }),
});

const removerCategoriaSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

module.exports = {
    criarCategoriaSchema,
    atualizarCategoriaSchema,
    removerCategoriaSchema,
};
