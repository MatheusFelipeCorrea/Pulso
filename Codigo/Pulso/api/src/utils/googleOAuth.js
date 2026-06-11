const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');

const createOAuthClient = (redirectUri) =>
    new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);

module.exports = { createOAuthClient };
