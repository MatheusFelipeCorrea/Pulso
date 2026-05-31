const jwt = require('jsonwebtoken');
const {
    signAccessToken,
    createRefreshTokenValue,
    getRefreshTokenExpiry,
    REFRESH_TOKEN_TTL_MS,
    REFRESH_TOKEN_REMEMBER_TTL_MS,
} = require('../../src/utils/tokenUtils');
const env = require('../../src/config/env');

describe('tokenUtils', () => {
    const usuario = {
        id: 'user-123',
        email: 'teste@pulso.dev',
        nome: 'Usuário Teste',
    };

    it('signAccessToken gera JWT válido com payload do usuário', () => {
        const token = signAccessToken(usuario);
        const decoded = jwt.verify(token, env.JWT_SECRET);

        expect(decoded.sub).toBe(usuario.id);
        expect(decoded.email).toBe(usuario.email);
        expect(decoded.nome).toBe(usuario.nome);
    });

    it('createRefreshTokenValue gera string hex única', () => {
        const a = createRefreshTokenValue();
        const b = createRefreshTokenValue();

        expect(a).toMatch(/^[a-f0-9]{96}$/);
        expect(b).toMatch(/^[a-f0-9]{96}$/);
        expect(a).not.toBe(b);
    });

    it('getRefreshTokenExpiry usa 7 dias por padrão', () => {
        const before = Date.now();
        const expiry = getRefreshTokenExpiry(false);
        const after = Date.now();

        const expectedMin = before + REFRESH_TOKEN_TTL_MS;
        const expectedMax = after + REFRESH_TOKEN_TTL_MS;

        expect(expiry.getTime()).toBeGreaterThanOrEqual(expectedMin);
        expect(expiry.getTime()).toBeLessThanOrEqual(expectedMax);
    });

    it('getRefreshTokenExpiry usa 30 dias com lembrarMe', () => {
        const before = Date.now();
        const expiry = getRefreshTokenExpiry(true);

        expect(expiry.getTime()).toBeGreaterThanOrEqual(before + REFRESH_TOKEN_REMEMBER_TTL_MS - 1000);
    });
});
