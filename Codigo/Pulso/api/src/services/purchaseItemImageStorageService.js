const fs = require('fs').promises;
const path = require('path');
const AppError = require('../utils/appError');
const env = require('../config/env');
const { ALLOWED_MIMES, MAX_BYTES, validateImageFile } = require('./grupoImageStorageService');

const storeWithVercelBlob = async (itemId, file) => {
    const { put } = require('@vercel/blob');
    const ext = ALLOWED_MIMES[file.mimetype];
    const blob = await put(`compras/${itemId}${ext}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true,
    });
    return blob.url;
};

const storeLocally = async (itemId, file) => {
    const uploadsDir = path.join(__dirname, '../../uploads/compras');
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = ALLOWED_MIMES[file.mimetype];
    const filename = `${itemId}-${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, file.buffer);

    const baseUrl = env.API_PUBLIC_URL || `http://localhost:${env.PORT}`;
    return `${baseUrl.replace(/\/$/, '')}/api/uploads/compras/${filename}`;
};

const storePurchaseItemImage = async (itemId, file) => {
    validateImageFile(file);

    if (env.BLOB_READ_WRITE_TOKEN) {
        return storeWithVercelBlob(itemId, file);
    }

    if (process.env.VERCEL) {
        throw new AppError(
            'Upload de imagem indisponível: configure BLOB_READ_WRITE_TOKEN na Vercel',
            503
        );
    }

    return storeLocally(itemId, file);
};

module.exports = {
    storePurchaseItemImage,
};
