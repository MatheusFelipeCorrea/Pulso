const express = require('express');
const transportController = require('../controllers/transportController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    obterSaldoQuerySchema,
    registrarVendaSchema,
    listarVendasQuerySchema,
    registrarUsoSchema,
    listarUsosQuerySchema,
    atualizarVtHabilitadoSchema,
} = require('../schemas/transportSchemas');

const router = express.Router();

router.get(
    '/saldo',
    authMiddleware,
    validateMiddleware(obterSaldoQuerySchema),
    transportController.obterSaldoVt
);

router.post(
    '/vendas',
    authMiddleware,
    validateMiddleware(registrarVendaSchema),
    transportController.registrarVendaVt
);

router.get(
    '/vendas',
    authMiddleware,
    validateMiddleware(listarVendasQuerySchema),
    transportController.listarVendas
);

router.post(
    '/usos',
    authMiddleware,
    validateMiddleware(registrarUsoSchema),
    transportController.registrarUsoVt
);

router.get(
    '/usos',
    authMiddleware,
    validateMiddleware(listarUsosQuerySchema),
    transportController.listarUsos
);

router.patch(
    '/vt-habilitado',
    authMiddleware,
    validateMiddleware(atualizarVtHabilitadoSchema),
    transportController.atualizarVtHabilitado
);

module.exports = router;
