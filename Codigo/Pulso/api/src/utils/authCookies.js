const env = require('../config/env');

const ACCESS_COOKIE = 'pulso_access';
const REFRESH_COOKIE = 'pulso_refresh';

const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;

const isProduction = env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

const baseCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api',
});

const getRefreshMaxAgeMs = (expiraEm) => {
    const remaining = new Date(expiraEm).getTime() - Date.now();
    return Math.max(remaining, 60 * 1000);
};

const setAuthCookies = (res, { accessToken, refreshToken, refreshExpiresAt }) => {
    res.cookie(ACCESS_COOKIE, accessToken, {
        ...baseCookieOptions(),
        maxAge: ACCESS_MAX_AGE_MS,
    });

    if (refreshToken) {
        res.cookie(REFRESH_COOKIE, refreshToken, {
            ...baseCookieOptions(),
            maxAge: refreshExpiresAt
                ? getRefreshMaxAgeMs(refreshExpiresAt)
                : 7 * 24 * 60 * 60 * 1000,
        });
    }
};

const clearAuthCookies = (res) => {
    const options = baseCookieOptions();
    res.clearCookie(ACCESS_COOKIE, options);
    res.clearCookie(REFRESH_COOKIE, options);
};

const getAccessTokenFromRequest = (req) => {
    const cookieToken = req.cookies?.[ACCESS_COOKIE];
    if (cookieToken) return cookieToken;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return null;
};

const getRefreshTokenFromRequest = (req) =>
    req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken || null;

module.exports = {
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    setAuthCookies,
    clearAuthCookies,
    getAccessTokenFromRequest,
    getRefreshTokenFromRequest,
};
