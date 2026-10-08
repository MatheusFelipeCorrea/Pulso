const { encryptTokens, decryptTokens } = require('../../../src/utils/googleTokenCrypto');

describe('googleTokenCrypto', () => {
    const tokens = {
        access_token: 'access-123',
        refresh_token: 'refresh-456',
        scope: 'https://www.googleapis.com/auth/calendar',
        expiry_date: 1_800_000_000_000,
    };

    it('criptografa e descriptografa mantendo os dados originais', () => {
        const envelope = encryptTokens(tokens);

        expect(envelope.__enc).toBe(1);
        expect(envelope.data).not.toEqual(JSON.stringify(tokens));
        expect(envelope).not.toHaveProperty('access_token');

        expect(decryptTokens(envelope)).toEqual(tokens);
    });

    it('gera um IV diferente a cada chamada (mesmo texto claro, ciphertext distinto)', () => {
        const primeiro = encryptTokens(tokens);
        const segundo = encryptTokens(tokens);

        expect(primeiro.iv).not.toBe(segundo.iv);
        expect(primeiro.data).not.toBe(segundo.data);
    });

    it('mantém compatibilidade com tokens legados salvos em texto puro (sem envelope)', () => {
        expect(decryptTokens(tokens)).toEqual(tokens);
    });

    it('retorna null/undefined como estão', () => {
        expect(decryptTokens(null)).toBeNull();
        expect(decryptTokens(undefined)).toBeUndefined();
    });

    it('rejeita descriptografar um envelope adulterado (authTag inválido)', () => {
        const envelope = encryptTokens(tokens);
        const adulterado = { ...envelope, data: Buffer.from('lixo-adulterado').toString('base64') };

        expect(() => decryptTokens(adulterado)).toThrow();
    });
});
