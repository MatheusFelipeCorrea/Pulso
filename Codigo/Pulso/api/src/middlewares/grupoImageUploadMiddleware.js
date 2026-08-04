const multer = require('multer');
const AppError = require('../utils/appError');
const { ALLOWED_MIMES, MAX_BYTES } = require('../services/grupoImageStorageService');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIMES[file.mimetype]) {
            cb(null, true);
            return;
        }
        cb(new AppError('Formato inválido. Use JPG, PNG ou WEBP.', 400));
    },
});

const handleGrupoImageUpload = (req, res, next) => {
    upload.single('imagem')(req, res, (err) => {
        if (!err) {
            next();
            return;
        }

        if (err instanceof AppError) {
            next(err);
            return;
        }

        if (err.code === 'LIMIT_FILE_SIZE') {
            next(new AppError('Imagem deve ter no máximo 2 MB', 400));
            return;
        }

        next(err);
    });
};

module.exports = {
    handleGrupoImageUpload,
};
