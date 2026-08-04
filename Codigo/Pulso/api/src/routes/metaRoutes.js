const express = require('express');
const metaController = require('../controllers/metaController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarMetaSchema,
    editarMetaSchema,
    registrarAporteSchema,
    listarMetasQuerySchema,
    sugestaoReservaEmergenciaQuerySchema,
    metaIdParamSchema,
    aporteIdParamSchema,
} = require('../schemas/metaSchemas');

const router = express.Router();

router.get('/resumo', authMiddleware, metaController.obterResumo);

router.get(
    '/sugestao-reserva-emergencia',
    authMiddleware,
    validateMiddleware(sugestaoReservaEmergenciaQuerySchema),
    metaController.sugerirReservaEmergencia
);

router.get(
    '/',
    authMiddleware,
    validateMiddleware(listarMetasQuerySchema),
    metaController.listar
);

router.post('/', authMiddleware, validateMiddleware(criarMetaSchema), metaController.criar);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(editarMetaSchema),
    metaController.editar
);

router.post(
    '/:id/aportes',
    authMiddleware,
    validateMiddleware(registrarAporteSchema),
    metaController.registrarAporte
);

router.delete(
    '/:id/aportes/:aporteId',
    authMiddleware,
    validateMiddleware(aporteIdParamSchema),
    metaController.excluirAporte
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(metaIdParamSchema),
    metaController.excluir
);

module.exports = router;
