const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const env = require('./env');
const authService = require('../services/authService');

let googleStrategyReady = false;

const ensureGoogleStrategy = () => {
    if (googleStrategyReady) return;

    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
        throw new Error(
            'Google OAuth não configurado. Defina GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_CALLBACK_URL.'
        );
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
                callbackURL: env.GOOGLE_CALLBACK_URL,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const user = await authService.authenticateGoogle(profile);
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );

    googleStrategyReady = true;
};

module.exports = passport;
module.exports.ensureGoogleStrategy = ensureGoogleStrategy;
