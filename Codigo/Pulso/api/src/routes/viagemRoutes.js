const express = require('express');
const viagemController = require('../controllers/viagemController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
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
} = require('../schemas/viagemSchemas');

const router = express.Router();

router.get('/resumo', authMiddleware, viagemController.obterResumo);
router.get('/origens', authMiddleware, viagemController.listarOrigensViagem);
router.get('/destinos', authMiddleware, validateMiddleware(destinosQuerySchema), viagemController.listarDestinosViagem);
router.get('/', authMiddleware, viagemController.listar);
router.get(
    '/:id/media-passagem',
    authMiddleware,
    validateMiddleware(mediaPassagemQuerySchema),
    viagemController.obterMediaPassagem
);
router.get('/:id', authMiddleware, validateMiddleware(viagemIdParamSchema), viagemController.obter);

router.post('/', authMiddleware, validateMiddleware(criarViagemSchema), viagemController.criar);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(editarViagemSchema),
    viagemController.editar
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(viagemIdParamSchema),
    viagemController.excluir
);

router.post(
    '/:id/despesas',
    authMiddleware,
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(despesaBodySchema),
    viagemController.criarDespesa
);

router.patch(
    '/:id/despesas/:despesaId',
    authMiddleware,
    validateMiddleware(despesaIdParamSchema),
    validateMiddleware(editarDespesaSchema),
    viagemController.editarDespesa
);

router.delete(
    '/:id/despesas/:despesaId',
    authMiddleware,
    validateMiddleware(despesaIdParamSchema),
    viagemController.excluirDespesa
);

router.post(
    '/:id/observacoes',
    authMiddleware,
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(observacaoBodySchema),
    viagemController.criarObservacao
);

router.patch(
    '/:id/observacoes/:observacaoId',
    authMiddleware,
    validateMiddleware(observacaoIdParamSchema),
    validateMiddleware(editarObservacaoSchema),
    viagemController.editarObservacao
);

router.delete(
    '/:id/observacoes/:observacaoId',
    authMiddleware,
    validateMiddleware(observacaoIdParamSchema),
    viagemController.excluirObservacao
);

module.exports = router;
