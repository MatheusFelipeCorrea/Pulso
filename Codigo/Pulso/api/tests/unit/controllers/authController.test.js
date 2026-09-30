jest.mock('../../../src/services/authService');
jest.mock('../../../src/utils/authCookies', () => ({
    setAuthCookies: jest.fn(),
    clearAuthCookies: jest.fn(),
    getRefreshTokenFromRequest: jest.fn(),
    ACCESS_COOKIE: 'pulso_access',
    REFRESH_COOKIE: 'pulso_refresh',
}));

const authService = require('../../../src/services/authService');
const authCookies = require('../../../src/utils/authCookies');
const authController = require('../../../src/controllers/authController');
const AppError = require('../../../src/utils/appError');

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
});

describe('authController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('register retorna 201 com resultado do service', async () => {
        const result = { message: 'ok', email: 'a@b.com' };
        authService.registerUser.mockResolvedValue(result);
        const res = buildRes();

        await authController.register({ body: { email: 'a@b.com' } }, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(result);
    });

    it('login seta cookies e retorna usuário', async () => {
        const session = {
            accessToken: 'access',
            refreshToken: 'refresh',
            refreshExpiresAt: new Date(),
            user: { id: 'u1', nome: 'Ana' },
        };
        authService.loginUser.mockResolvedValue(session);
        const res = buildRes();

        await authController.login({ body: { email: 'a@b.com', senha: 'x' } }, res, jest.fn());

        expect(authCookies.setAuthCookies).toHaveBeenCalledWith(res, {
            accessToken: 'access',
            refreshToken: 'refresh',
            refreshExpiresAt: session.refreshExpiresAt,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ user: session.user });
    });

    it('login mobile com sessão cookie NÃO devolve tokens no JSON', async () => {
        const session = {
            accessToken: 'access',
            refreshToken: 'refresh',
            refreshExpiresAt: new Date(),
            user: { id: 'u1', nome: 'Ana' },
        };
        authService.loginUser.mockResolvedValue(session);
        const res = buildRes();

        await authController.login(
            {
                body: { email: 'a@b.com', senha: 'x' },
                headers: { 'x-pulso-client': 'mobile' },
                cookies: { pulso_access: 'cookie-at', pulso_refresh: 'cookie-rt' },
            },
            res,
            jest.fn()
        );

        expect(res.json).toHaveBeenCalledWith({ user: session.user });
    });

    it('login mobile devolve tokens no JSON e mantém cookies', async () => {
        const session = {
            accessToken: 'access',
            refreshToken: 'refresh',
            refreshExpiresAt: new Date(),
            user: { id: 'u1', nome: 'Ana' },
        };
        authService.loginUser.mockResolvedValue(session);
        const res = buildRes();

        await authController.login(
            { body: { email: 'a@b.com', senha: 'x' }, headers: { 'x-pulso-client': 'mobile' } },
            res,
            jest.fn()
        );

        expect(authCookies.setAuthCookies).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            user: session.user,
            accessToken: 'access',
            refreshToken: 'refresh',
        });
    });

    it('refresh web retorna apenas ok', async () => {
        authCookies.getRefreshTokenFromRequest.mockReturnValue('rt');
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: 'a2',
            refreshToken: 'r2',
            refreshExpiresAt: new Date(),
        });
        const res = buildRes();

        await authController.refresh({ body: {}, headers: {} }, res, jest.fn());

        expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    it('refresh mobile inclui o novo par de tokens', async () => {
        authCookies.getRefreshTokenFromRequest.mockReturnValue('rt');
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: 'a2',
            refreshToken: 'r2',
            refreshExpiresAt: new Date(),
        });
        const res = buildRes();

        await authController.refresh(
            { body: { refreshToken: 'rt' }, headers: { 'x-pulso-client': 'mobile' } },
            res,
            jest.fn()
        );

        expect(res.json).toHaveBeenCalledWith({
            ok: true,
            accessToken: 'a2',
            refreshToken: 'r2',
        });
    });

    it('googleMobile devolve sessão JSON sem redirect', async () => {
        const session = {
            accessToken: 'access',
            refreshToken: 'refresh',
            refreshExpiresAt: new Date(),
            user: { id: 'u1', nome: 'Ana' },
        };
        authService.loginWithGoogleIdToken.mockResolvedValue(session);
        const res = buildRes();

        await authController.googleMobile({ body: { idToken: 'id-token' } }, res, jest.fn());

        expect(authService.loginWithGoogleIdToken).toHaveBeenCalledWith('id-token');
        expect(res.redirect).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            user: session.user,
            accessToken: 'access',
            refreshToken: 'refresh',
        });
    });

    it('refresh exige cookie/body de refresh token', async () => {
        authCookies.getRefreshTokenFromRequest.mockReturnValue(null);
        const next = jest.fn();

        await authController.refresh({ body: {} }, buildRes(), next);

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('logout limpa cookies mesmo sem refresh token', async () => {
        authCookies.getRefreshTokenFromRequest.mockReturnValue(null);
        const res = buildRes();

        await authController.logout({ body: {} }, res, jest.fn());

        expect(authService.logoutUser).not.toHaveBeenCalled();
        expect(authCookies.clearAuthCookies).toHaveBeenCalledWith(res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('resetPassword limpa cookies após troca', async () => {
        authService.resetPassword.mockResolvedValue({ message: 'Senha alterada.' });
        const res = buildRes();

        await authController.resetPassword(
            { params: { token: 'tok' }, body: { senha: 'Abc@1234', confirmarSenha: 'Abc@1234' } },
            res,
            jest.fn()
        );

        expect(authCookies.clearAuthCookies).toHaveBeenCalledWith(res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
