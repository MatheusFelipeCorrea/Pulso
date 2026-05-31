const authService = require('../services/authService');

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
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken(req.body.refreshToken);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await authService.logoutUser(req.body.refreshToken);
        res.status(200).json(result);
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
    login,
    refresh,
    logout,
    me,
    forgotPassword,
    validateResetToken,
    resetPassword,
};
