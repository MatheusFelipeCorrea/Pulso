const multer = require('multer');
const AppError = require('../utils/appError');

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['pdf']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (_req, file, cb) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (ext && ALLOWED_EXTENSIONS.has(ext)) {
            cb(null, true);
            return;
        }
        cb(new AppError('Formato inválido. Envie um arquivo PDF.', 400));
    },
});

const handleStatementUpload = (req, res, next) => {
    upload.single('arquivo')(req, res, (err) => {
        if (!err) {
            next();
            return;
        }

        if (err instanceof AppError) {
            next(err);
            return;
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            next(new AppError('Arquivo deve ter no máximo 8 MB', 400));
            return;
        }

        next(err);
    });
};

module.exports = { handleStatementUpload };
