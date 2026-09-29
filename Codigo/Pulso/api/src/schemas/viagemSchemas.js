const { z } = require('zod');



const categoriaDespesaSchema = z.enum([
    'TRANSPORTE',
    'HOSPEDAGEM',
    'ALIMENTACAO',
    'PASSEIOS',
    'COMPRAS',
    'DOCUMENTACAO',
    'SAUDE',
    'EMERGENCIAS',
    'ENTRETENIMENTO',
    'OUTROS',
]);



const criarViagemSchema = z.object({

    body: z.object({

        destino: z.string().trim().min(1).max(120),

        destinoMeta: z
            .object({
                source: z.enum(['geonames', 'catalog']).optional(),
                geonameId: z.number().int().positive().nullable().optional(),
                catalogId: z.string().trim().min(1).max(64),
                iata: z.string().trim().min(3).max(3),
                label: z.string().trim().min(1).max(80),
                region: z.string().trim().max(80).nullable().optional(),
                countryCode: z.string().trim().min(2).max(2),
                countryName: z.string().trim().min(1).max(80),
                moedaSugerida: z.string().trim().toUpperCase().length(3),
                domestic: z.boolean(),
                lat: z.number().nullable().optional(),
                lng: z.number().nullable().optional(),
                hubIata: z.string().trim().length(3).optional(),
            })
            .nullable()
            .optional(),

        moeda: z.string().trim().toUpperCase().length(3),

        dataPrevista: z.union([z.string(), z.date()]),

        metaId: z.string().cuid().nullable().optional(),

    }),

});



const editarViagemSchema = z.object({

    body: z

        .object({

            destino: z.string().trim().min(1).max(120).optional(),

            destinoMeta: z
                .object({
                    catalogId: z.string().trim().min(1).max(64),
                    iata: z.string().trim().min(3).max(3),
                    label: z.string().trim().min(1).max(80),
                    countryCode: z.string().trim().min(2).max(2),
                    countryName: z.string().trim().min(1).max(80),
                    moedaSugerida: z.string().trim().toUpperCase().length(3),
                    domestic: z.boolean(),
                })
                .nullable()
                .optional(),

            moeda: z.string().trim().toUpperCase().length(3).optional(),

            dataPrevista: z.union([z.string(), z.date()]).optional(),

            metaId: z.string().cuid().nullable().optional(),

        })

        .refine((data) => Object.keys(data).length > 0, {

            message: 'Informe ao menos um campo para atualizar',

        }),

});



const viagemIdParamSchema = z.object({

    params: z.object({

        id: z.string().cuid(),

    }),

});



const despesaBodySchema = z.object({

    body: z.object({

        categoria: categoriaDespesaSchema,

        descricao: z.string().trim().max(255).nullable().optional(),

        valorEstimado: z.coerce.number().positive(),

    }),

});



const editarDespesaSchema = z.object({

    body: z

        .object({

            categoria: categoriaDespesaSchema.optional(),

            descricao: z.string().trim().max(255).nullable().optional(),

            valorEstimado: z.coerce.number().positive().optional(),

        })

        .refine((data) => Object.keys(data).length > 0, {

            message: 'Informe ao menos um campo para atualizar',

        }),

});



const despesaIdParamSchema = z.object({

    params: z.object({

        id: z.string().cuid(),

        despesaId: z.string().cuid(),

    }),

});



const tipoObservacaoSchema = z.enum(['GERAL', 'CHECKLIST', 'LINK', 'DICA', 'DOCUMENTOS']);



const checklistItemSchema = z.object({

    id: z.string().trim().min(1).max(64).optional(),

    texto: z.string().trim().min(1).max(200),

    concluido: z.boolean().optional(),

});



const observacaoBodySchema = z.object({

    body: z.object({

        titulo: z.string().trim().min(1).max(120),

        conteudo: z.string().trim().max(1000).nullable().optional(),

        tipo: tipoObservacaoSchema.nullable().optional(),

        linkUrl: z

            .union([z.string().trim().url().max(500), z.literal(''), z.null()])

            .optional(),

        checklist: z.array(checklistItemSchema).max(50).nullable().optional(),

    }),

});



const editarObservacaoSchema = z.object({

    body: z

        .object({

            titulo: z.string().trim().min(1).max(120).optional(),

            conteudo: z.string().trim().max(1000).nullable().optional(),

            tipo: tipoObservacaoSchema.nullable().optional(),

            linkUrl: z

                .union([z.string().trim().url().max(500), z.literal(''), z.null()])

                .optional(),

            checklist: z.array(checklistItemSchema).max(50).nullable().optional(),

        })

        .refine((data) => Object.keys(data).length > 0, {

            message: 'Informe ao menos um campo para atualizar',

        }),

});



const observacaoIdParamSchema = z.object({

    params: z.object({

        id: z.string().cuid(),

        observacaoId: z.string().cuid(),

    }),

});

const mediaPassagemQuerySchema = z.object({
    params: z.object({
        id: z.string().cuid(),
    }),
    query: z.object({
        origem: z.string().trim().toUpperCase().max(4).optional(),
    }),
});

const destinosQuerySchema = z.object({
    query: z.object({
        q: z.string().trim().max(80).optional(),
        limit: z.coerce.number().int().min(1).max(50).optional(),
    }),
});



module.exports = {

    criarViagemSchema,

    editarViagemSchema,

    viagemIdParamSchema,

    despesaBodySchema,

    editarDespesaSchema,

    despesaIdParamSchema,

    observacaoBodySchema,

    editarObservacaoSchema,

    observacaoIdParamSchema,
    mediaPassagemQuerySchema,
    destinosQuerySchema,
};


