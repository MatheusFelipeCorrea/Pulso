const express = require('express');
const passport = require('../config/passport');
const { ensureGoogleStrategy } = passport;
const authController = require('../controllers/authController');
const validateMiddleware = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { authSensitiveRateLimit } = require('../middlewares/authRateLimit');
const authService = require('../services/authService');
const {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    forgotPasswordSchema,
    resetPasswordTokenSchema,
    resetPasswordSchema,
} = require('../schemas/authSchemas');

const router = express.Router();

router.post(
    '/register',
    authSensitiveRateLimit,
    validateMiddleware(registerSchema),
    authController.register
);

router.post(
    '/login',
    authSensitiveRateLimit,
    validateMiddleware(loginSchema),
    authController.login
);

router.post('/refresh', validateMiddleware(refreshSchema), authController.refresh);

router.post('/logout', validateMiddleware(logoutSchema), authController.logout);

router.get('/me', authMiddleware, authController.me);

router.post(
    '/forgot-password',
    authSensitiveRateLimit,
    validateMiddleware(forgotPasswordSchema),
    authController.forgotPassword
);

router.get(
    '/reset-password/:token',
    validateMiddleware(resetPasswordTokenSchema),
    authController.validateResetToken
);

router.post(
    '/reset-password/:token',
    validateMiddleware(resetPasswordSchema),
    authController.resetPassword
);

router.get(
    '/verify-email/:token',
    validateMiddleware(verifyEmailSchema),
    authController.verifyEmail
);

router.post(
    '/resend-verification',
    authSensitiveRateLimit,
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
