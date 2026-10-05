const express = require('express');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middlewares/authMiddleware');
const requirePremium = require('../middlewares/requirePremium');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { queryMesSchema, queryDataSchema, googleSyncSchema } = require('../schemas/reminderSchemas');

const router = express.Router();

router.get('/mes', authMiddleware, validateMiddleware(queryMesSchema), calendarController.obterMes);

router.get('/dia', authMiddleware, validateMiddleware(queryDataSchema), calendarController.obterDia);

router.get('/google/status', authMiddleware, requirePremium, calendarController.obterStatusGoogle);

router.get('/google/url', authMiddleware, requirePremium, calendarController.obterUrlGoogle);

router.get('/google/callback', calendarController.callbackGoogle);

router.post('/google/desconectar', authMiddleware, requirePremium, calendarController.desconectarGoogle);

router.get('/google/sync/pendentes', authMiddleware, requirePremium, calendarController.obterPendentesSyncGoogle);

router.post(
    '/google/sync',
    authMiddleware,
    requirePremium,
    validateMiddleware(googleSyncSchema),
    calendarController.sincronizarPendentesGoogle
);

module.exports = router;
