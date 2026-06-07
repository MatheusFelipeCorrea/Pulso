const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const authRepository = require('../repositories/authRepository');
const emailProvider = require('../providers/emailProvider');
const categoryService = require('./categoryService');
const logger = require('../utils/logger');
const env = require('../config/env');
const {
    signAccessToken,
    createRefreshTokenValue,
    getRefreshTokenExpiry,
} = require('../utils/tokenUtils');

const SENHA_FORTE_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const SALT_ROUNDS = 10;
const TOKEN_VERIFICACAO_TTL_MS = 24 * 60 * 60 * 1000;
const TOKEN_RESET_TTL_MS = 60 * 60 * 1000;

const maskEmail = (email) => {
    const [local, domain] = email.split('@');

    if (!local || !domain) {
        return email;
    }

    return `${local.charAt(0)}***@${domain}`;
};

const validateSenhaForte = (senha) => {
    if (!SENHA_FORTE_REGEX.test(senha)) {
        throw new AppError(
            'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.',
            400
        );
    }
};

const registerUser = async ({ nome, email, senha, confirmarSenha }) => {
    if (senha !== confirmarSenha) {
        throw new AppError('As senhas não conferem.', 400);
    }

    validateSenhaForte(senha);

    const existing = await authRepository.findByEmail(email);
    if (existing) {
        throw new AppError('Este email já está cadastrado.', 409);
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const tokenVerificacaoEmail = crypto.randomBytes(32).toString('hex');
    const tokenVerificacaoExpira = new Date(Date.now() + TOKEN_VERIFICACAO_TTL_MS);

    const usuario = await authRepository.createUser({
        nome,
        email: email.trim().toLowerCase(),
        senhaHash,
        provedorAuth: 'EMAIL',
        verificado: false,
        tokenVerificacaoEmail,
        tokenVerificacaoExpira,
        configuracoes: {
            create: {
                tema: 'CLARO',
                gamificacaoAtiva: true,
            },
        },
        sequencia: {
            create: {
                sequenciaAtual: 0,
                maiorSequencia: 0,
                xp: 0,
                nivel: 'INICIANTE',
            },
        },
    });

    await categoryService.seedCategoriasPadrao(usuario.id);

    try {
        await emailProvider.sendVerificationEmail(email, tokenVerificacaoEmail);
    } catch (error) {
        await authRepository.deleteUser(usuario.id);
        logger.warn(`Falha ao enviar email de verificação para ${email}: ${error.message}`);

        if (env.NODE_ENV === 'development') {
            throw new AppError(
                'Cadastro não concluído: limite de envio de email atingido. Aguarde alguns segundos e tente novamente.',
                503
            );
        }

        throw new AppError(
            'Não foi possível enviar o email de verificação. Tente novamente em instantes.',
            503
        );
    }

    return {
        message: 'Cadastro realizado! Verifique seu email.',
        email: email.trim().toLowerCase(),
    };
};

const verifyEmail = async (token) => {
    const usuario = await authRepository.findByVerificationToken(token);

    if (!usuario) {
        throw new AppError('Token de verificação inválido.', 400);
    }

    if (usuario.verificado) {
        return {
            message: 'Email já foi verificado anteriormente.',
            alreadyVerified: true,
        };
    }

    if (!usuario.tokenVerificacaoExpira || usuario.tokenVerificacaoExpira < new Date()) {
        throw new AppError('Token expirado. Solicite um novo email de verificação.', 400);
    }

    await authRepository.updateUser(usuario.id, {
        verificado: true,
        tokenVerificacaoEmail: null,
        tokenVerificacaoExpira: null,
    });

    return {
        message: 'Email verificado com sucesso!',
        verified: true,
    };
};

const resendVerificationEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await authRepository.findByEmail(normalizedEmail);

    if (!usuario) {
        throw new AppError('Email não encontrado.', 404);
    }

    if (usuario.verificado) {
        throw new AppError('Este email já foi verificado.', 400);
    }

    if (usuario.provedorAuth !== 'EMAIL') {
        throw new AppError('Esta conta não utiliza verificação por email.', 400);
    }

    const tokenVerificacaoEmail = crypto.randomBytes(32).toString('hex');
    const tokenVerificacaoExpira = new Date(Date.now() + TOKEN_VERIFICACAO_TTL_MS);

    await authRepository.updateUser(usuario.id, {
        tokenVerificacaoEmail,
        tokenVerificacaoExpira,
    });

    try {
        await emailProvider.sendVerificationEmail(normalizedEmail, tokenVerificacaoEmail);
    } catch (error) {
        logger.warn(
            `Falha ao reenviar email de verificação para ${normalizedEmail}: ${error.message}`
        );

        throw new AppError(
            'Não foi possível enviar o email de verificação. Tente novamente em instantes.',
            503
        );
    }

    return {
        message: 'Email de verificação reenviado.',
        email: normalizedEmail,
    };
};

const defaultUserRelations = {
    configuracoes: {
        create: {
            tema: 'CLARO',
            gamificacaoAtiva: true,
        },
    },
    sequencia: {
        create: {
            sequenciaAtual: 0,
            maiorSequencia: 0,
            xp: 0,
            nivel: 'INICIANTE',
        },
    },
};

const issueAuthTokens = async (usuario, lembrarMe = false) => {
    const accessToken = signAccessToken(usuario);
    const refreshToken = createRefreshTokenValue();

    await authRepository.createRefreshToken({
        usuarioId: usuario.id,
        token: refreshToken,
        expiraEm: getRefreshTokenExpiry(lembrarMe),
    });

    return { accessToken, refreshToken };
};

const formatUserResponse = (usuario) => {
    const modoUso = usuario.configuracoes?.modoUso ?? 'CLT';
    const vtRaw = usuario.configuracoes?.vtHabilitado;

    let vtHabilitado = false;
    if (modoUso === 'ESTAGIARIO' || modoUso === 'CLT') {
        vtHabilitado = true;
    } else if (modoUso === 'PJ') {
        vtHabilitado = vtRaw ?? null;
    }

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        urlAvatar: usuario.urlAvatar,
        modoUso,
        vtHabilitado,
        valorPadraoPassagem: usuario.configuracoes?.valorPadraoPassagem
            ? Number(usuario.configuracoes.valorPadraoPassagem).toFixed(2)
            : null,
    };
};

const loginUser = async ({ email, senha, lembrarMe = false }) => {
    const identificador = email?.trim();

    if (!identificador || !senha) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    const usuario = await authRepository.findByEmailOrNome(identificador);

    if (!usuario || !usuario.senhaHash) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    if (!usuario.verificado) {
        throw new AppError(
            'Você precisa verificar seu email antes de fazer login. Verifique sua caixa de entrada.',
            403
        );
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
        throw new AppError('Email ou senha incorretos.', 401);
    }

    const { accessToken, refreshToken } = await issueAuthTokens(usuario, lembrarMe);

    return {
        accessToken,
        refreshToken,
        user: formatUserResponse(usuario),
    };
};

const refreshAccessToken = async (refreshToken) => {
    const stored = await authRepository.findRefreshToken(refreshToken);

    if (!stored || stored.revogado || stored.expiraEm < new Date()) {
        throw new AppError('Sessão expirada. Faça login novamente.', 401);
    }

    const usuario = await authRepository.findById(stored.usuarioId);

    if (!usuario) {
        throw new AppError('Sessão expirada. Faça login novamente.', 401);
    }

    return {
        accessToken: signAccessToken(usuario),
    };
};

const logoutUser = async (refreshToken) => {
    await authRepository.revokeRefreshToken(refreshToken);

    return {
        message: 'Logout realizado com sucesso.',
    };
};

const getAuthenticatedUser = async (userId) => {
    const usuario = await authRepository.findById(userId);

    if (!usuario) {
        throw new AppError('Usuário não encontrado.', 404);
    }

    return formatUserResponse(usuario);
};

const requestPasswordReset = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await authRepository.findByEmail(normalizedEmail);

    const response = {
        message: 'Email de recuperação enviado.',
        email: maskEmail(normalizedEmail),
    };

    if (!usuario || !usuario.senhaHash || usuario.provedorAuth !== 'EMAIL') {
        return response;
    }

    const tokenResetSenha = crypto.randomBytes(32).toString('hex');
    const tokenResetExpira = new Date(Date.now() + TOKEN_RESET_TTL_MS);

    await authRepository.updateUser(usuario.id, {
        tokenResetSenha,
        tokenResetExpira,
    });

    try {
        await emailProvider.sendPasswordResetEmail(normalizedEmail, tokenResetSenha);
    } catch (error) {
        logger.warn(
            `Falha ao enviar email de recuperação para ${normalizedEmail}: ${error.message}`
        );

        throw new AppError(
            'Não foi possível enviar o email de recuperação. Tente novamente em instantes.',
            503
        );
    }

    return response;
};

const validateResetToken = async (token) => {
    const usuario = await authRepository.findByResetToken(token);

    if (!usuario || !usuario.tokenResetExpira || usuario.tokenResetExpira < new Date()) {
        throw new AppError('Token inválido ou expirado.', 400);
    }

    return {
        valid: true,
        email: usuario.email,
    };
};

const resetPassword = async (token, { senha, confirmarSenha }) => {
    if (senha !== confirmarSenha) {
        throw new AppError('As senhas não conferem.', 400);
    }

    validateSenhaForte(senha);

    const usuario = await authRepository.findByResetToken(token);

    if (!usuario || !usuario.tokenResetExpira || usuario.tokenResetExpira < new Date()) {
        throw new AppError('Token inválido ou expirado.', 400);
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    await authRepository.updateUser(usuario.id, {
        senhaHash,
        tokenResetSenha: null,
        tokenResetExpira: null,
    });

    await authRepository.revokeAllRefreshTokensForUser(usuario.id);

    return {
        message: 'Senha alterada com sucesso.',
    };
};

const authenticateGoogle = async (profile) => {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase().trim();
    const nome = profile.displayName || profile.name?.givenName || 'Usuário Pulso';
    const urlAvatar = profile.photos?.[0]?.value || null;

    if (!email) {
        throw new AppError('Não foi possível obter o email da conta Google.', 400);
    }

    const byGoogleId = await authRepository.findByGoogleId(googleId);
    if (byGoogleId) {
        if (!byGoogleId.verificado) {
            return authRepository.updateUser(byGoogleId.id, { verificado: true });
        }
        return byGoogleId;
    }

    const byEmail = await authRepository.findByEmail(email);

    if (byEmail) {
        if (byEmail.provedorAuth === 'EMAIL') {
            throw new AppError(
                'Este email já está cadastrado com senha. Faça login com email e senha ou vincule sua conta depois.',
                409
            );
        }

        if (byEmail.googleId && byEmail.googleId !== googleId) {
            throw new AppError('Conta Google não corresponde a este email.', 409);
        }

        return authRepository.updateUser(byEmail.id, {
            googleId,
            provedorAuth: 'GOOGLE',
            verificado: true,
            urlAvatar: byEmail.urlAvatar || urlAvatar,
            nome: byEmail.nome || nome,
        });
    }

    return authRepository.createUser({
        nome,
        email,
        googleId,
        urlAvatar,
        provedorAuth: 'GOOGLE',
        verificado: true,
        senhaHash: null,
        ...defaultUserRelations,
    }).then(async (usuario) => {
        await categoryService.seedCategoriasPadrao(usuario.id);
        return usuario;
    });
};

const buildGoogleCallbackRedirect = async (usuario) => {
    const { accessToken, refreshToken } = await issueAuthTokens(usuario);
    const params = new URLSearchParams({
        accessToken,
        refreshToken,
    });

    return `${env.FRONTEND_URL}/auth/callback?${params.toString()}`;
};

const buildGoogleErrorRedirect = (error) => {
    const message =
        error instanceof AppError
            ? error.message
            : 'Não foi possível entrar com Google. Tente novamente.';

    const params = new URLSearchParams({
        error: 'google_auth_failed',
        message,
    });

    return `${env.FRONTEND_URL}/auth/callback?${params.toString()}`;
};

module.exports = {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    authenticateGoogle,
    issueAuthTokens,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getAuthenticatedUser,
    formatUserResponse,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
    buildGoogleCallbackRedirect,
    buildGoogleErrorRedirect,
};
