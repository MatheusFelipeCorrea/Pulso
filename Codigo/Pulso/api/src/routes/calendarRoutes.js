const express = require('express');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { queryMesSchema, queryDataSchema, googleSyncSchema } = require('../schemas/reminderSchemas');

const router = express.Router();

router.get('/mes', authMiddleware, validateMiddleware(queryMesSchema), calendarController.obterMes);

router.get('/dia', authMiddleware, validateMiddleware(queryDataSchema), calendarController.obterDia);

router.get('/google/status', authMiddleware, calendarController.obterStatusGoogle);

router.get('/google/url', authMiddleware, calendarController.obterUrlGoogle);

router.get('/google/callback', calendarController.callbackGoogle);

router.post('/google/desconectar', authMiddleware, calendarController.desconectarGoogle);

router.get('/google/sync/pendentes', authMiddleware, calendarController.obterPendentesSyncGoogle);

router.post(
    '/google/sync',
    authMiddleware,
    validateMiddleware(googleSyncSchema),
    calendarController.sincronizarPendentesGoogle
);

module.exports = router;
