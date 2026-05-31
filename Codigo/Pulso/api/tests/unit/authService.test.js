const bcrypt = require('bcryptjs');
const AppError = require('../../src/utils/appError');
const authService = require('../../src/services/authService');
const { authRepositoryMock, emailProviderMock } = require('../helpers/authMocks');

const validPassword = 'Pulso@123';
const usuarioBase = {
    id: 'usr-1',
    nome: 'Matheus',
    email: 'teste@pulso.dev',
    senhaHash: null,
    verificado: true,
    provedorAuth: 'EMAIL',
    urlAvatar: null,
};

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('rejeita senhas que não conferem', async () => {
            await expect(
                authService.registerUser({
                    nome: 'Teste',
                    email: 'a@b.com',
                    senha: validPassword,
                    confirmarSenha: 'Outra@123',
                })
            ).rejects.toMatchObject({ statusCode: 400, message: 'As senhas não conferem.' });
        });

        it('rejeita senha fraca', async () => {
            await expect(
                authService.registerUser({
                    nome: 'Teste',
                    email: 'a@b.com',
                    senha: 'fraca',
                    confirmarSenha: 'fraca',
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('rejeita email duplicado', async () => {
            authRepositoryMock.findByEmail.mockResolvedValue({ id: 'existing' });

            await expect(
                authService.registerUser({
                    nome: 'Teste',
                    email: 'a@b.com',
                    senha: validPassword,
                    confirmarSenha: validPassword,
                })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it('cadastra, envia email e retorna mensagem de sucesso', async () => {
            authRepositoryMock.findByEmail.mockResolvedValue(null);
            authRepositoryMock.createUser.mockResolvedValue({ id: 'new-user', email: 'a@b.com' });
            emailProviderMock.sendVerificationEmail.mockResolvedValue(undefined);

            const result = await authService.registerUser({
                nome: 'Teste',
                email: 'A@B.com',
                senha: validPassword,
                confirmarSenha: validPassword,
            });

            expect(authRepositoryMock.createUser).toHaveBeenCalledTimes(1);
            expect(emailProviderMock.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(result.message).toContain('Cadastro realizado');
            expect(result.email).toBe('a@b.com');
        });

        it('remove usuário se envio de email falhar', async () => {
            authRepositoryMock.findByEmail.mockResolvedValue(null);
            authRepositoryMock.createUser.mockResolvedValue({ id: 'new-user' });
            emailProviderMock.sendVerificationEmail.mockRejectedValue(new Error('SMTP down'));

            await expect(
                authService.registerUser({
                    nome: 'Teste',
                    email: 'a@b.com',
                    senha: validPassword,
                    confirmarSenha: validPassword,
                })
            ).rejects.toBeInstanceOf(AppError);

            expect(authRepositoryMock.deleteUser).toHaveBeenCalledWith('new-user');
        });
    });

    describe('verifyEmail', () => {
        it('rejeita token inválido', async () => {
            authRepositoryMock.findByVerificationToken.mockResolvedValue(null);

            await expect(authService.verifyEmail('token-invalido')).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('retorna alreadyVerified quando email já foi confirmado', async () => {
            authRepositoryMock.findByVerificationToken.mockResolvedValue({
                id: '1',
                verificado: true,
            });

            const result = await authService.verifyEmail('token');

            expect(result.alreadyVerified).toBe(true);
        });

        it('rejeita token expirado', async () => {
            authRepositoryMock.findByVerificationToken.mockResolvedValue({
                id: '1',
                verificado: false,
                tokenVerificacaoExpira: new Date(Date.now() - 1000),
            });

            await expect(authService.verifyEmail('token')).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('marca usuário como verificado', async () => {
            authRepositoryMock.findByVerificationToken.mockResolvedValue({
                id: '1',
                verificado: false,
                tokenVerificacaoExpira: new Date(Date.now() + 60_000),
            });

            const result = await authService.verifyEmail('token');

            expect(authRepositoryMock.updateUser).toHaveBeenCalledWith('1', {
                verificado: true,
                tokenVerificacaoEmail: null,
                tokenVerificacaoExpira: null,
            });
            expect(result.verified).toBe(true);
        });
    });

    describe('loginUser', () => {
        it('bloqueia login de email não verificado', async () => {
            const hash = await bcrypt.hash(validPassword, 10);
            authRepositoryMock.findByEmailOrNome.mockResolvedValue({
                ...usuarioBase,
                senhaHash: hash,
                verificado: false,
            });

            await expect(
                authService.loginUser({ email: usuarioBase.email, senha: validPassword })
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it('rejeita credenciais inválidas', async () => {
            const hash = await bcrypt.hash(validPassword, 10);
            authRepositoryMock.findByEmailOrNome.mockResolvedValue({
                ...usuarioBase,
                senhaHash: hash,
            });

            await expect(
                authService.loginUser({ email: usuarioBase.email, senha: 'Errada@123' })
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it('autentica usuário verificado e emite tokens', async () => {
            const hash = await bcrypt.hash(validPassword, 10);
            authRepositoryMock.findByEmailOrNome.mockResolvedValue({
                ...usuarioBase,
                senhaHash: hash,
            });
            authRepositoryMock.createRefreshToken.mockResolvedValue({ id: 'rt-1' });

            const result = await authService.loginUser({
                email: usuarioBase.email,
                senha: validPassword,
                lembrarMe: true,
            });

            expect(result.accessToken).toBeTruthy();
            expect(result.refreshToken).toBeTruthy();
            expect(result.user.email).toBe(usuarioBase.email);
            expect(authRepositoryMock.createRefreshToken).toHaveBeenCalledTimes(1);
        });
    });

    describe('refreshAccessToken', () => {
        it('rejeita refresh token revogado ou expirado', async () => {
            authRepositoryMock.findRefreshToken.mockResolvedValue({
                revogado: true,
                expiraEm: new Date(Date.now() + 60_000),
                usuarioId: 'usr-1',
            });

            await expect(authService.refreshAccessToken('rt')).rejects.toMatchObject({
                statusCode: 401,
            });
        });

        it('emite novo access token para refresh válido', async () => {
            authRepositoryMock.findRefreshToken.mockResolvedValue({
                revogado: false,
                expiraEm: new Date(Date.now() + 60_000),
                usuarioId: usuarioBase.id,
            });
            authRepositoryMock.findById.mockResolvedValue(usuarioBase);

            const result = await authService.refreshAccessToken('rt-valido');

            expect(result.accessToken).toBeTruthy();
        });
    });

    describe('requestPasswordReset', () => {
        it('não revela se email existe (usuário inexistente)', async () => {
            authRepositoryMock.findByEmail.mockResolvedValue(null);

            const result = await authService.requestPasswordReset('nao@existe.com');

            expect(result.message).toContain('Email de recuperação enviado');
            expect(emailProviderMock.sendPasswordResetEmail).not.toHaveBeenCalled();
        });

        it('gera token e envia email para conta com senha', async () => {
            authRepositoryMock.findByEmail.mockResolvedValue({
                ...usuarioBase,
                senhaHash: 'hash',
            });
            emailProviderMock.sendPasswordResetEmail.mockResolvedValue(undefined);

            const result = await authService.requestPasswordReset(usuarioBase.email);

            expect(authRepositoryMock.updateUser).toHaveBeenCalledTimes(1);
            expect(emailProviderMock.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
            expect(result.email).toMatch(/^t\*\*\*@/);
        });
    });

    describe('resetPassword', () => {
        it('rejeita token expirado', async () => {
            authRepositoryMock.findByResetToken.mockResolvedValue({
                id: '1',
                tokenResetExpira: new Date(Date.now() - 1000),
            });

            await expect(
                authService.resetPassword('token', {
                    senha: validPassword,
                    confirmarSenha: validPassword,
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('atualiza senha, limpa token e revoga sessões', async () => {
            authRepositoryMock.findByResetToken.mockResolvedValue({
                id: '1',
                tokenResetExpira: new Date(Date.now() + 60_000),
            });

            const result = await authService.resetPassword('token', {
                senha: validPassword,
                confirmarSenha: validPassword,
            });

            expect(authRepositoryMock.updateUser).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    tokenResetSenha: null,
                    tokenResetExpira: null,
                })
            );
            expect(authRepositoryMock.revokeAllRefreshTokensForUser).toHaveBeenCalledWith('1');
            expect(result.message).toContain('Senha alterada');
        });
    });

    describe('authenticateGoogle', () => {
        it('rejeita perfil sem email', async () => {
            await expect(
                authService.authenticateGoogle({ id: 'g-1', emails: [] })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('rejeita email já cadastrado com senha', async () => {
            authRepositoryMock.findByGoogleId.mockResolvedValue(null);
            authRepositoryMock.findByEmail.mockResolvedValue({
                ...usuarioBase,
                provedorAuth: 'EMAIL',
            });

            await expect(
                authService.authenticateGoogle({
                    id: 'g-1',
                    emails: [{ value: usuarioBase.email }],
                    displayName: 'Google User',
                })
            ).rejects.toMatchObject({ statusCode: 409 });
        });
    });
});
