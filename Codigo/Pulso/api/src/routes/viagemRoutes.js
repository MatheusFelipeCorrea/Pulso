const express = require('express');
const viagemController = require('../controllers/viagemController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePremium = require('../middlewares/requirePremium');
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

router.use(authMiddleware);
router.use(requirePremium);

router.get('/resumo', viagemController.obterResumo);
router.get('/origens', viagemController.listarOrigensViagem);
router.get('/destinos', validateMiddleware(destinosQuerySchema), viagemController.listarDestinosViagem);
router.get('/', viagemController.listar);
router.get(
    '/:id/media-passagem',
    validateMiddleware(mediaPassagemQuerySchema),
    viagemController.obterMediaPassagem
);
router.get('/:id', validateMiddleware(viagemIdParamSchema), viagemController.obter);

router.post('/', validateMiddleware(criarViagemSchema), viagemController.criar);

router.patch(
    '/:id',
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(editarViagemSchema),
    viagemController.editar
);

router.delete('/:id', validateMiddleware(viagemIdParamSchema), viagemController.excluir);

router.post(
    '/:id/despesas',
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(despesaBodySchema),
    viagemController.criarDespesa
);

router.patch(
    '/:id/despesas/:despesaId',
    validateMiddleware(despesaIdParamSchema),
    validateMiddleware(editarDespesaSchema),
    viagemController.editarDespesa
);

router.delete(
    '/:id/despesas/:despesaId',
    validateMiddleware(despesaIdParamSchema),
    viagemController.excluirDespesa
);

router.post(
    '/:id/observacoes',
    validateMiddleware(viagemIdParamSchema),
    validateMiddleware(observacaoBodySchema),
    viagemController.criarObservacao
);

router.patch(
    '/:id/observacoes/:observacaoId',
    validateMiddleware(observacaoIdParamSchema),
    validateMiddleware(editarObservacaoSchema),
    viagemController.editarObservacao
);

router.delete(
    '/:id/observacoes/:observacaoId',
    validateMiddleware(observacaoIdParamSchema),
    viagemController.excluirObservacao
);

module.exports = router;
