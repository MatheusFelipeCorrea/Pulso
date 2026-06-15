const express = require('express');
const moedaController = require('../controllers/moedaController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    converterQuerySchema,
    historicoQuerySchema,
    cotacoesQuerySchema,
    favoritaBodySchema,
    favoritaParamSchema,
} = require('../schemas/moedaSchemas');

const router = express.Router();

router.get('/catalogo', authMiddleware, moedaController.obterCatalogo);

router.get(
    '/cotacoes',
    authMiddleware,
    validateMiddleware(cotacoesQuerySchema),
    moedaController.listarCotacoes
);

router.get(
    '/converter',
    authMiddleware,
    validateMiddleware(converterQuerySchema),
    moedaController.converter
);

router.get(
    '/historico',
    authMiddleware,
    validateMiddleware(historicoQuerySchema),
    moedaController.obterHistorico
);

router.get('/favoritas', authMiddleware, moedaController.listarFavoritas);

router.post(
    '/favoritas',
    authMiddleware,
    validateMiddleware(favoritaBodySchema),
    moedaController.adicionarFavorita
);

router.delete(
    '/favoritas/:codigo',
    authMiddleware,
    validateMiddleware(favoritaParamSchema),
    moedaController.removerFavorita
);

module.exports = router;
