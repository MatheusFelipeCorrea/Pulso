const { z } = require('zod');

const { CATEGORIAS_LEMBRETE } = require('../constants/reminderCategories');



const antecedenciaEnum = z.enum(['NO_DIA', 'UM_DIA', 'TRES_DIAS', 'CINCO_DIAS', 'UMA_SEMANA']);

const categoriaLembreteEnum = z.enum(CATEGORIAS_LEMBRETE);



const queryMesSchema = z.object({

    query: z.object({

        mes: z

            .string()

            .regex(/^\d{4}-\d{2}$/, 'Use o formato YYYY-MM')

            .optional(),

    }),

});



const queryDataSchema = z.object({

    query: z.object({

        data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato YYYY-MM-DD'),

    }),

});



const criarLembreteSchema = z.object({

    body: z.object({

        titulo: z.string().min(1, 'Título é obrigatório').max(120),

        valor: z.coerce.number().min(0).optional().nullable(),

        dataVencimento: z.string().datetime({ message: 'Data de vencimento inválida' }),

        antecedencia: antecedenciaEnum.optional(),

        categoria: categoriaLembreteEnum.optional(),

        sincronizarGoogle: z.boolean().optional(),

    }),

});



const atualizarLembreteSchema = z.object({

    params: z.object({

        id: z.string().min(1),

    }),

    body: z.object({

        titulo: z.string().min(1).max(120).optional(),

        valor: z.coerce.number().min(0).optional().nullable(),

        dataVencimento: z.string().datetime().optional(),

        antecedencia: antecedenciaEnum.optional(),

        categoria: categoriaLembreteEnum.optional(),

        pago: z.boolean().optional(),

        sincronizarGoogle: z.boolean().optional(),

    }),

});



const marcarPagoSchema = z.object({

    params: z.object({

        id: z.string().min(1),

    }),

});



const removerLembreteSchema = z.object({

    params: z.object({

        id: z.string().min(1),

    }),

});

const googleSyncSchema = z.object({
    body: z.object({
        escopo: z.enum(['futuros', 'futuros_nao_pagos', 'todos']).default('futuros'),
    }),
});

module.exports = {
    queryMesSchema,
    queryDataSchema,
    criarLembreteSchema,
    atualizarLembreteSchema,
    marcarPagoSchema,
    removerLembreteSchema,
    googleSyncSchema,
};

