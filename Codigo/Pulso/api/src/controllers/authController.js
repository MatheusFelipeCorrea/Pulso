const authService = require('../services/authService');
const {
    setAuthCookies,
    clearAuthCookies,
    getRefreshTokenFromRequest,
} = require('../utils/authCookies');
const AppError = require('../utils/appError');

const respondWithAuthSession = (res, result, statusCode = 200) => {
    setAuthCookies(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        refreshExpiresAt: result.refreshExpiresAt,
    });

    res.status(statusCode).json({
        user: result.user ?? undefined,
        message: result.message ?? undefined,
        email: result.email ?? undefined,
        emailPendente: result.emailPendente ?? undefined,
    });
};

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const googleCallback = async (req, res) => {
    try {
        const redirectUrl = await authService.buildGoogleCallbackRedirect(req.user);
        res.redirect(redirectUrl);
    } catch (error) {
        const redirectUrl = authService.buildGoogleErrorRedirect(error);
        res.redirect(redirectUrl);
    }
};

const exchangeOAuth = async (req, res, next) => {
    try {
        const result = await authService.exchangeOAuthSession(req.body.exchange);
        respondWithAuthSession(res, result);
    } catch (error) {
        next(error);
    }
};

const resendVerification = async (req, res, next) => {
    try {
        const result = await authService.resendVerificationEmail(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(req.params.token);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        respondWithAuthSession(res, result);
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const refreshToken = getRefreshTokenFromRequest(req);
        if (!refreshToken) {
            throw new AppError('Sessão expirada. Faça login novamente.', 401);
        }

        const result = await authService.refreshAccessToken(refreshToken);
        setAuthCookies(res, {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            refreshExpiresAt: result.refreshExpiresAt,
        });
        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const refreshToken = getRefreshTokenFromRequest(req);
        if (refreshToken) {
            await authService.logoutUser(refreshToken);
        }
        clearAuthCookies(res);
        res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await authService.getAuthenticatedUser(req.user.id);
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.requestPasswordReset(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const validateResetToken = async (req, res, next) => {
    try {
        const result = await authService.validateResetToken(req.params.token);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const result = await authService.resetPassword(req.params.token, req.body);
        clearAuthCookies(res);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyEmail,
    resendVerification,
    googleCallback,
    exchangeOAuth,
    login,
    refresh,
    logout,
    me,
    forgotPassword,
    validateResetToken,
    resetPassword,
};
