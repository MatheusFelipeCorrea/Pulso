const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');

const createOAuthClient = (redirectUri) =>
    new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);

const getGoogleAudiences = () =>
    [env.GOOGLE_CLIENT_ID, env.GOOGLE_ANDROID_CLIENT_ID, env.GOOGLE_IOS_CLIENT_ID].filter(Boolean);

const verifyIdToken = async (idToken) => {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: getGoogleAudiences(),
    });
    return ticket.getPayload();
};

module.exports = { createOAuthClient, getGoogleAudiences, verifyIdToken };
