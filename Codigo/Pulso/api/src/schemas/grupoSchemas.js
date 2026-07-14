const { z } = require('zod');

const urlImagemGrupoSchema = z.preprocess(
    (value) => (value === '' ? null : value),
    z.string().trim().url('URL da imagem inválida').max(2048).nullable().optional()
);

const criarGrupoSchema = z.object({
    body: z.object({
        nome: z.string().trim().min(1, 'Nome do grupo é obrigatório').max(100),
        descricao: z.string().trim().max(500).optional().nullable(),
    }),
});

const editarGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            nome: z.string().trim().min(1).max(100).optional(),
            descricao: z.string().trim().max(500).optional().nullable(),
            urlImagem: urlImagemGrupoSchema,
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const atualizarModoDivisaoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        modoDivisao: z.enum(['PRETENSAO', 'IGUAL'], {
            message: 'Modo de divisão deve ser PRETENSAO ou IGUAL',
        }),
    }),
});

const grupoIdParamSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

const entrarGrupoSchema = z.object({
    body: z.object({
        codigoConvite: z.string().trim().min(1, 'Código de convite é obrigatório'),
    }),
});

const previewGrupoQuerySchema = z.object({
    query: z.object({
        codigo: z.string().trim().min(1, 'Código de convite é obrigatório'),
    }),
});

const destinoMetaGrupoSchema = z
    .object({
        source: z.enum(['geonames', 'catalog']).optional(),
        geonameId: z.number().int().positive().nullable().optional(),
        catalogId: z.string().trim().min(1).max(64).optional(),
        iata: z.string().trim().min(3).max(3).optional(),
        label: z.string().trim().min(1).max(80).optional(),
        region: z.string().trim().max(80).nullable().optional(),
        countryCode: z.string().trim().min(2).max(2).optional(),
        countryName: z.string().trim().min(1).max(80).optional(),
        moedaSugerida: z.string().trim().toUpperCase().length(3).optional(),
        domestic: z.boolean().optional(),
        lat: z.number().nullable().optional(),
        lng: z.number().nullable().optional(),
        hubIata: z.string().trim().length(3).optional(),
        coverImageUrl: z.string().max(2048).optional(),
    })
    .passthrough()
    .nullable()
    .optional();

const criarViagemGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            viagemId: z.string().trim().min(1).optional(),
            destino: z.string().trim().max(120).optional(),
            destinoMeta: destinoMetaGrupoSchema,
            moeda: z.string().trim().length(3, 'Moeda inválida').optional(),
            dataPrevista: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            if (data.viagemId) return

            if (!data.destino?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Destino é obrigatório',
                    path: ['destino'],
                })
            }
            if (!data.moeda?.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Moeda inválida',
                    path: ['moeda'],
                })
            }
            if (!data.dataPrevista) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Data prevista é obrigatória',
                    path: ['dataPrevista'],
                })
            }
        }),
});

const criarMetasGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        metas: z
            .array(
                z.object({
                    nome: z.string().trim().min(1).max(100),
                    valorAlvo: z.number().positive(),
                    prazo: z.string().min(1),
                    descricao: z.string().trim().max(500).optional().nullable(),
                })
            )
            .min(1)
            .max(5),
    }),
});

const registrarAporteGrupoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        metaId: z.string().min(1),
    }),
    body: z.object({
        valor: z.number().positive(),
        data: z.string().min(1),
    }),
});

const mediaPassagemViagemGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    query: z.object({
        origem: z.string().trim().toUpperCase().max(4).optional(),
    }),
});

const categoriaDespesaGrupoSchema = z.enum([
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

const criarDespesaViagemGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        categoria: categoriaDespesaGrupoSchema,
        descricao: z.string().trim().max(255).nullable().optional(),
        valorEstimado: z.coerce.number().positive(),
    }),
});

const editarDespesaViagemGrupoSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        despesaId: z.string().min(1),
    }),
    body: z
        .object({
            categoria: categoriaDespesaGrupoSchema.optional(),
            descricao: z.string().trim().max(255).nullable().optional(),
            valorEstimado: z.coerce.number().positive().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const despesaViagemGrupoIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        despesaId: z.string().min(1),
    }),
});

const enviarMensagemGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        conteudo: z.string().trim().min(1, 'Mensagem não pode estar vazia').max(2000),
    }),
});

const membroGrupoIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        usuarioId: z.string().min(1),
    }),
});

const alterarPapelMembroSchema = z.object({
    params: z.object({
        id: z.string().min(1),
        usuarioId: z.string().min(1),
    }),
    body: z.object({
        papel: z.enum(['ADMIN', 'MEMBRO']),
    }),
});

const editarViagemGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z
        .object({
            destino: z.string().trim().max(120).optional(),
            destinoMeta: destinoMetaGrupoSchema,
            moeda: z.string().trim().length(3, 'Moeda inválida').optional(),
            dataPrevista: z.string().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'Informe ao menos um campo para atualizar',
        }),
});

const listarMensagensGrupoSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    query: z.object({
        pagina: z.coerce.number().int().min(1).optional().default(1),
        limite: z.coerce.number().int().min(1).max(50).optional().default(20),
    }),
});

module.exports = {
    criarGrupoSchema,
    editarGrupoSchema,
    atualizarModoDivisaoSchema,
    grupoIdParamSchema,
    entrarGrupoSchema,
    previewGrupoQuerySchema,
    criarViagemGrupoSchema,
    criarMetasGrupoSchema,
    registrarAporteGrupoSchema,
    mediaPassagemViagemGrupoSchema,
    criarDespesaViagemGrupoSchema,
    editarDespesaViagemGrupoSchema,
    despesaViagemGrupoIdParamSchema,
    enviarMensagemGrupoSchema,
    membroGrupoIdParamSchema,
    alterarPapelMembroSchema,
    editarViagemGrupoSchema,
    listarMensagensGrupoSchema,
};
