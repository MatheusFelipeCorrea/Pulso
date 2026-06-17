const express = require('express');
const grupoController = require('../controllers/grupoController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarGrupoSchema,
    editarGrupoSchema,
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

router.get('/preview', authMiddleware, validateMiddleware(previewGrupoQuerySchema), grupoController.preview);

router.post('/entrar', authMiddleware, validateMiddleware(entrarGrupoSchema), grupoController.entrar);

router.get('/', authMiddleware, grupoController.listar);

router.post('/', authMiddleware, validateMiddleware(criarGrupoSchema), grupoController.criar);

router.get('/:id', authMiddleware, validateMiddleware(grupoIdParamSchema), grupoController.obter);

router.patch('/:id', authMiddleware, validateMiddleware(editarGrupoSchema), grupoController.editar);

router.delete('/:id', authMiddleware, validateMiddleware(grupoIdParamSchema), grupoController.excluir);

router.post('/:id/sair', authMiddleware, validateMiddleware(grupoIdParamSchema), grupoController.sair);

router.post(
    '/:id/codigo/renovar',
    authMiddleware,
    validateMiddleware(grupoIdParamSchema),
    grupoController.renovarCodigo
);

router.delete(
    '/:id/membros/:usuarioId',
    authMiddleware,
    validateMiddleware(membroGrupoIdParamSchema),
    grupoController.removerMembro
);

router.patch(
    '/:id/membros/:usuarioId',
    authMiddleware,
    validateMiddleware(alterarPapelMembroSchema),
    grupoController.alterarPapelMembro
);

router.post(
    '/:id/viagem',
    authMiddleware,
    validateMiddleware(criarViagemGrupoSchema),
    grupoController.criarViagem
);

router.patch(
    '/:id/viagem',
    authMiddleware,
    validateMiddleware(editarViagemGrupoSchema),
    grupoController.editarViagem
);

router.delete(
    '/:id/viagem',
    authMiddleware,
    validateMiddleware(grupoIdParamSchema),
    grupoController.desvincularViagem
);

router.get(
    '/:id/viagem/media-passagem',
    authMiddleware,
    validateMiddleware(mediaPassagemViagemGrupoSchema),
    grupoController.obterMediaPassagemViagem
);

router.post(
    '/:id/viagem/despesas',
    authMiddleware,
    validateMiddleware(criarDespesaViagemGrupoSchema),
    grupoController.criarDespesaViagem
);

router.patch(
    '/:id/viagem/despesas/:despesaId',
    authMiddleware,
    validateMiddleware(editarDespesaViagemGrupoSchema),
    grupoController.editarDespesaViagem
);

router.delete(
    '/:id/viagem/despesas/:despesaId',
    authMiddleware,
    validateMiddleware(despesaViagemGrupoIdParamSchema),
    grupoController.excluirDespesaViagem
);

router.post(
    '/:id/metas',
    authMiddleware,
    validateMiddleware(criarMetasGrupoSchema),
    grupoController.criarMetas
);

router.post(
    '/:id/metas/:metaId/aportes',
    authMiddleware,
    validateMiddleware(registrarAporteGrupoSchema),
    grupoController.registrarAporte
);

router.get(
    '/:id/mensagens',
    authMiddleware,
    validateMiddleware(listarMensagensGrupoSchema),
    grupoController.listarMensagens
);

router.post(
    '/:id/mensagens',
    authMiddleware,
    validateMiddleware(enviarMensagemGrupoSchema),
    grupoController.enviarMensagem
);

module.exports = router;
