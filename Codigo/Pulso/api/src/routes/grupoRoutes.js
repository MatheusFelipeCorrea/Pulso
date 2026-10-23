const express = require('express');
const grupoController = require('../controllers/grupoController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePremium = require('../middlewares/requirePremium');
const { grupoInviteCodeRateLimit } = require('../middlewares/grupoInviteRateLimit');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { handleGrupoImageUpload } = require('../middlewares/grupoImageUploadMiddleware');
const {
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
} = require('../schemas/grupoSchemas');

const router = express.Router();

router.use(authMiddleware);
router.use(requirePremium);

router.get('/preview', grupoInviteCodeRateLimit, validateMiddleware(previewGrupoQuerySchema), grupoController.preview);

router.post('/entrar', grupoInviteCodeRateLimit, validateMiddleware(entrarGrupoSchema), grupoController.entrar);

router.get('/', grupoController.listar);

router.post('/', validateMiddleware(criarGrupoSchema), grupoController.criar);

router.get('/:id', validateMiddleware(grupoIdParamSchema), grupoController.obter);

router.patch('/:id', validateMiddleware(editarGrupoSchema), grupoController.editar);

router.patch(
    '/:id/modo-divisao',
    validateMiddleware(atualizarModoDivisaoSchema),
    grupoController.atualizarModoDivisao
);

router.post(
    '/:id/imagem',
    validateMiddleware(grupoIdParamSchema),
    handleGrupoImageUpload,
    grupoController.enviarImagem
);

router.delete('/:id', validateMiddleware(grupoIdParamSchema), grupoController.excluir);

router.post('/:id/sair', validateMiddleware(grupoIdParamSchema), grupoController.sair);

router.post(
    '/:id/codigo/renovar',
    validateMiddleware(grupoIdParamSchema),
    grupoController.renovarCodigo
);

router.delete(
    '/:id/membros/:usuarioId',
    validateMiddleware(membroGrupoIdParamSchema),
    grupoController.removerMembro
);

router.patch(
    '/:id/membros/:usuarioId',
    validateMiddleware(alterarPapelMembroSchema),
    grupoController.alterarPapelMembro
);

router.post(
    '/:id/viagem',
    validateMiddleware(criarViagemGrupoSchema),
    grupoController.criarViagem
);

router.patch(
    '/:id/viagem',
    validateMiddleware(editarViagemGrupoSchema),
    grupoController.editarViagem
);

router.delete(
    '/:id/viagem',
    validateMiddleware(grupoIdParamSchema),
    grupoController.desvincularViagem
);

router.get(
    '/:id/viagem/media-passagem',
    validateMiddleware(mediaPassagemViagemGrupoSchema),
    grupoController.obterMediaPassagemViagem
);

router.post(
    '/:id/viagem/despesas',
    validateMiddleware(criarDespesaViagemGrupoSchema),
    grupoController.criarDespesaViagem
);

router.patch(
    '/:id/viagem/despesas/:despesaId',
    validateMiddleware(editarDespesaViagemGrupoSchema),
    grupoController.editarDespesaViagem
);

router.delete(
    '/:id/viagem/despesas/:despesaId',
    validateMiddleware(despesaViagemGrupoIdParamSchema),
    grupoController.excluirDespesaViagem
);

router.post(
    '/:id/metas',
    validateMiddleware(criarMetasGrupoSchema),
    grupoController.criarMetas
);

router.post(
    '/:id/metas/:metaId/aportes',
    validateMiddleware(registrarAporteGrupoSchema),
    grupoController.registrarAporte
);

router.get(
    '/:id/mensagens',
    validateMiddleware(listarMensagensGrupoSchema),
    grupoController.listarMensagens
);

router.post(
    '/:id/mensagens',
    validateMiddleware(enviarMensagemGrupoSchema),
    grupoController.enviarMensagem
);

module.exports = router;
