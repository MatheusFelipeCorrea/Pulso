const mockOauthCtor = jest.fn();

jest.mock('google-auth-library', () => ({
    OAuth2Client: mockOauthCtor,
}));

const { createOAuthClient } = require('../../../src/utils/googleOAuth');

describe('googleOAuth utils', () => {
    it('cria OAuth2Client com credenciais e redirectUri', () => {
        createOAuthClient('https://pulso.dev/callback');

        expect(mockOauthCtor).toHaveBeenCalledWith(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://pulso.dev/callback'
        );
    });
});
