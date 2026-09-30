const crypto = require('crypto');
const env = require('../config/env');

const ALGORITHM = 'aes-256-gcm';
const ENVELOPE_VERSION = 1;

const getKey = () => {
    const secret = env.GOOGLE_TOKENS_ENCRYPTION_KEY;
    if (!secret) {
        throw new Error(
            'GOOGLE_TOKENS_ENCRYPTION_KEY não configurada — necessária para criptografar os tokens do Google em repouso.'
        );
    }

    const key = Buffer.from(secret, 'hex');
    if (key.length !== 32) {
        throw new Error(
            'GOOGLE_TOKENS_ENCRYPTION_KEY deve ter 32 bytes em hexadecimal (64 caracteres). Gere com: openssl rand -hex 32'
        );
    }

    return key;
};

const isEncryptedEnvelope = (value) =>
    Boolean(value) && typeof value === 'object' && value.__enc === ENVELOPE_VERSION;

/** Criptografa o objeto de tokens do Google (AES-256-GCM) antes de persistir em repouso. */
const encryptTokens = (tokens) => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const plaintext = Buffer.from(JSON.stringify(tokens), 'utf8');
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        __enc: ENVELOPE_VERSION,
        iv: iv.toString('base64'),
        tag: authTag.toString('base64'),
        data: encrypted.toString('base64'),
    };
};

/**
 * Descriptografa o envelope salvo em `tokensGoogle`. Dados legados (gravados em texto puro
 * antes desta migração) não têm o envelope `__enc` e são retornados como estão.
 */
const decryptTokens = (stored) => {
    if (!stored) return stored;

    const value = typeof stored === 'string' ? JSON.parse(stored) : stored;

    if (!isEncryptedEnvelope(value)) {
        return value;
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(value.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(value.tag, 'base64'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(value.data, 'base64')),
        decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
};

module.exports = {
    encryptTokens,
    decryptTokens,
};
