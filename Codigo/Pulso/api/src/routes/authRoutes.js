const express = require('express');
const passport = require('../config/passport');
const { ensureGoogleStrategy } = passport;
const authController = require('../controllers/authController');
const validateMiddleware = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    authRegisterRateLimit,
    authLoginRateLimit,
    authOAuthExchangeRateLimit,
    authRefreshRateLimit,
    authLogoutRateLimit,
    authForgotPasswordRateLimit,
    authResetPasswordRateLimit,
    authVerifyEmailRateLimit,
    authResendVerificationRateLimit,
} = require('../middlewares/authRateLimit');
const authService = require('../services/authService');
const {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    oauthExchangeSchema,
    forgotPasswordSchema,
    resetPasswordTokenSchema,
    resetPasswordSchema,
} = require('../schemas/authSchemas');

const router = express.Router();

router.post(
    '/register',
    authRegisterRateLimit,
    validateMiddleware(registerSchema),
    authController.register
);

router.post(
    '/login',
    authLoginRateLimit,
    validateMiddleware(loginSchema),
    authController.login
);

router.post(
    '/oauth/exchange',
    authOAuthExchangeRateLimit,
    validateMiddleware(oauthExchangeSchema),
    authController.exchangeOAuth
);

router.post(
    '/refresh',
    authRefreshRateLimit,
    validateMiddleware(refreshSchema),
    authController.refresh
);

router.post(
    '/logout',
    authLogoutRateLimit,
    validateMiddleware(logoutSchema),
    authController.logout
);

router.get('/me', authMiddleware, authController.me);

router.post(
    '/forgot-password',
    authForgotPasswordRateLimit,
    validateMiddleware(forgotPasswordSchema),
    authController.forgotPassword
);

router.get(
    '/reset-password/:token',
    authResetPasswordRateLimit,
    validateMiddleware(resetPasswordTokenSchema),
    authController.validateResetToken
);

router.post(
    '/reset-password/:token',
    authResetPasswordRateLimit,
    validateMiddleware(resetPasswordSchema),
    authController.resetPassword
);

router.get(
    '/verify-email/:token',
    authVerifyEmailRateLimit,
    validateMiddleware(verifyEmailSchema),
    authController.verifyEmail
);

router.post(
    '/resend-verification',
    authResendVerificationRateLimit,
    validateMiddleware(resendVerificationSchema),
    authController.resendVerification
);

router.get(
    '/google',
    (req, res, next) => {
        try {
            ensureGoogleStrategy();
            next();
        } catch (error) {
            next(error);
        }
    },
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

router.get('/google/callback', (req, res, next) => {
    try {
        ensureGoogleStrategy();
    } catch (error) {
        return next(error);
    }

    passport.authenticate('google', { session: false }, (err, user) => {
        if (err || !user) {
            const redirectUrl = authService.buildGoogleErrorRedirect(
                err || new Error('Autenticação Google cancelada ou inválida.')
            );
            return res.redirect(redirectUrl);
        }

        req.user = user;
        return authController.googleCallback(req, res, next);
    })(req, res, next);
});

module.exports = router;
