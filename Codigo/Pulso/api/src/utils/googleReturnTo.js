const jwt = require('jsonwebtoken');
const env = require('../config/env');

const originOf = (value) => {
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
};

const listAllowedReturnOrigins = () => {
    const origins = new Set();
    const frontend = originOf(env.FRONTEND_URL);
    if (frontend) origins.add(frontend);

    String(env.CORS_ORIGIN || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
            const origin = originOf(item);
            if (origin) origins.add(origin);
        });

    return origins;
};

const frontendOrigin = () => originOf(env.FRONTEND_URL);

const resolveOAuthReturnOrigin = (raw) => {
    const fallback = frontendOrigin();
    if (!raw) return fallback;
    const origin = originOf(raw);
    if (!origin || !listAllowedReturnOrigins().has(origin)) return fallback;
    return origin;
};

const encodeGoogleReturnState = (origin) =>
    jwt.sign({ type: 'google_return', origin }, env.JWT_SECRET, { expiresIn: '10m' });

const decodeGoogleReturnState = (state) => {
    const fallback = frontendOrigin();
    if (!state) return fallback;
    try {
        const decoded = jwt.verify(state, env.JWT_SECRET);
        if (decoded.type !== 'google_return' || !decoded.origin) return fallback;
        return listAllowedReturnOrigins().has(decoded.origin) ? decoded.origin : fallback;
    } catch {
        return fallback;
    }
};

const buildOAuthCallbackLocation = (origin, params) => {
    const query = params.toString();
    if (!origin || origin === frontendOrigin()) {
        const base = String(env.FRONTEND_URL || '').replace(/\/$/, '');
        return `${base}/auth/callback?${query}`;
    }
    return `${origin}/#/auth/callback?${query}`;
};

module.exports = {
    listAllowedReturnOrigins,
    resolveOAuthReturnOrigin,
    encodeGoogleReturnState,
    decodeGoogleReturnState,
    buildOAuthCallbackLocation,
};
