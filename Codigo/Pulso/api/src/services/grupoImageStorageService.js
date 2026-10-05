const fs = require('fs').promises;
const path = require('path');
const AppError = require('../utils/appError');
const env = require('../config/env');

const ALLOWED_MIMES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

const MAX_BYTES = 2 * 1024 * 1024;

const validateImageFile = (file) => {
    if (!file) {
        throw new AppError('Arquivo de imagem é obrigatório', 400);
    }
    if (!ALLOWED_MIMES[file.mimetype]) {
        throw new AppError('Formato inválido. Use JPG, PNG ou WEBP.', 400);
    }
    if (file.size > MAX_BYTES) {
        throw new AppError('Imagem deve ter no máximo 2 MB', 400);
    }
};

const storeWithVercelBlob = async (grupoId, file) => {
    const { put } = require('@vercel/blob');
    const ext = ALLOWED_MIMES[file.mimetype];
    const blob = await put(`grupos/${grupoId}${ext}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true,
    });
    return blob.url;
};

const storeLocally = async (grupoId, file) => {
    const uploadsDir = path.join(__dirname, '../../uploads/grupos');
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = ALLOWED_MIMES[file.mimetype];
    const filename = `${grupoId}-${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, file.buffer);

    const baseUrl = env.API_PUBLIC_URL || `http://localhost:${env.PORT}`;
    return `${baseUrl.replace(/\/$/, '')}/api/uploads/grupos/${filename}`;
};

const storeGrupoImage = async (grupoId, file) => {
    validateImageFile(file);

    if (env.BLOB_READ_WRITE_TOKEN) {
        return storeWithVercelBlob(grupoId, file);
    }

    if (process.env.VERCEL) {
        throw new AppError(
            'Upload de imagem indisponível: configure BLOB_READ_WRITE_TOKEN na Vercel',
            503
        );
    }

    return storeLocally(grupoId, file);
};

module.exports = {
    ALLOWED_MIMES,
    MAX_BYTES,
    validateImageFile,
    storeGrupoImage,
};
