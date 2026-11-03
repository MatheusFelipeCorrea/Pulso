const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { handleStatementUpload } = require('../middlewares/statementImportUploadMiddleware');
const importController = require('../controllers/importController');
const { analisarImportacaoSchema, confirmarImportacaoSchema } = require('../schemas/importSchemas');

const router = express.Router();

router.post(
    '/analisar',
    authMiddleware,
    handleStatementUpload,
    validateMiddleware(analisarImportacaoSchema),
    importController.analisarArquivo
);

router.post(
    '/confirmar',
    authMiddleware,
    validateMiddleware(confirmarImportacaoSchema),
    importController.confirmarImportacao
);

module.exports = router;
