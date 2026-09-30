const {
    resolveOAuthReturnOrigin,
    encodeGoogleReturnState,
    decodeGoogleReturnState,
    buildOAuthCallbackLocation,
    listAllowedReturnOrigins,
} = require('../../../src/utils/googleReturnTo');

describe('googleReturnTo', () => {
    it('aceita origem listada no CORS e rejeita origem estranha', () => {
        expect(resolveOAuthReturnOrigin('http://localhost:5173/qualquer')).toBe(
            'http://localhost:5173'
        );
        expect(resolveOAuthReturnOrigin('https://evil.example')).toBe('http://localhost:5173');
        expect(listAllowedReturnOrigins().has('http://localhost:5173')).toBe(true);
    });

    it('assina e lê o state do OAuth sem open redirect', () => {
        const state = encodeGoogleReturnState('http://localhost:5173');
        expect(decodeGoogleReturnState(state)).toBe('http://localhost:5173');
        expect(decodeGoogleReturnState('nao-e-jwt')).toBe('http://localhost:5173');
    });

    it('usa path da SPA com exchange no hash e hash no Flutter web', () => {
        const params = new URLSearchParams({ exchange: 'abc' });
        expect(buildOAuthCallbackLocation('http://localhost:5173', params)).toBe(
            'http://localhost:5173/auth/callback#exchange=abc'
        );
        expect(buildOAuthCallbackLocation('http://127.0.0.1:8080', params)).toBe(
            'http://127.0.0.1:8080/#/auth/callback?exchange=abc'
        );
    });
});
