const mockOauthCtor = jest.fn();

jest.mock('google-auth-library', () => ({
    OAuth2Client: mockOauthCtor,
}));

const { createOAuthClient, verifyIdToken } = require('../../../src/utils/googleOAuth');

describe('googleOAuth utils', () => {
    beforeEach(() => {
        mockOauthCtor.mockReset();
    });

    it('cria OAuth2Client com credenciais e redirectUri', () => {
        createOAuthClient('https://pulso.dev/callback');

        expect(mockOauthCtor).toHaveBeenCalledWith(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://pulso.dev/callback'
        );
    });

    it('valida ID token nativo com as audiências configuradas', async () => {
        const getPayload = jest.fn().mockReturnValue({ sub: 'g-1', email: 'ana@pulso.dev' });
        const verify = jest.fn().mockResolvedValue({ getPayload });
        mockOauthCtor.mockImplementation(() => ({ verifyIdToken: verify }));

        const payload = await verifyIdToken('id-token');

        expect(payload.email).toBe('ana@pulso.dev');
        expect(verify).toHaveBeenCalledWith({
            idToken: 'id-token',
            audience: expect.arrayContaining([process.env.GOOGLE_CLIENT_ID]),
        });
    });
});
