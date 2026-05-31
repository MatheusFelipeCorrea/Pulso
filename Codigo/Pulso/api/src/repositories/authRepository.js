const prisma = require('../config/database');

const createUser = async (data) => {
    return prisma.usuario.create({ data });
};

const findByGoogleId = async (googleId) => {
    return prisma.usuario.findUnique({ where: { googleId } });
};

const createRefreshToken = async ({ usuarioId, token, expiraEm }) => {
    return prisma.tokenRenovacao.create({
        data: {
            usuarioId,
            token,
            expiraEm,
        },
    });
};

const findByEmail = async (email) => {
    return prisma.usuario.findUnique({ where: { email } });
};

const findById = async (id) => {
    return prisma.usuario.findUnique({ where: { id } });
};

const findByEmailOrNome = async (identificador) => {
    const trimmed = identificador.trim();

    if (trimmed.includes('@')) {
        return findByEmail(trimmed.toLowerCase());
    }

    return prisma.usuario.findFirst({
        where: {
            nome: {
                equals: trimmed,
                mode: 'insensitive',
            },
        },
    });
};

const findRefreshToken = async (token) => {
    return prisma.tokenRenovacao.findUnique({ where: { token } });
};

const revokeRefreshToken = async (token) => {
    const existing = await prisma.tokenRenovacao.findUnique({ where: { token } });

    if (!existing || existing.revogado) {
        return null;
    }

    return prisma.tokenRenovacao.update({
        where: { token },
        data: {
            revogado: true,
            revogadoEm: new Date(),
        },
    });
};

const findByVerificationToken = async (token) => {
    return prisma.usuario.findFirst({
        where: { tokenVerificacaoEmail: token },
    });
};

const findByResetToken = async (token) => {
    return prisma.usuario.findFirst({
        where: { tokenResetSenha: token },
    });
};

const revokeAllRefreshTokensForUser = async (usuarioId) => {
    return prisma.tokenRenovacao.updateMany({
        where: {
            usuarioId,
            revogado: false,
        },
        data: {
            revogado: true,
            revogadoEm: new Date(),
        },
    });
};

const deleteExpiredRefreshTokens = async () => {
    return prisma.tokenRenovacao.deleteMany({
        where: {
            OR: [{ expiraEm: { lt: new Date() } }, { revogado: true }],
        },
    });
};

const clearExpiredVerificationTokens = async () => {
    return prisma.usuario.updateMany({
        where: {
            tokenVerificacaoExpira: { lt: new Date() },
        },
        data: {
            tokenVerificacaoEmail: null,
            tokenVerificacaoExpira: null,
        },
    });
};

const clearExpiredResetTokens = async () => {
    return prisma.usuario.updateMany({
        where: {
            tokenResetExpira: { lt: new Date() },
        },
        data: {
            tokenResetSenha: null,
            tokenResetExpira: null,
        },
    });
};

const updateUser = async (id, data) => {
    return prisma.usuario.update({ where: { id }, data });
};

const deleteUser = async (id) => {
    return prisma.usuario.delete({ where: { id } });
};

module.exports = {
    createUser,
    findByEmail,
    findById,
    findByEmailOrNome,
    findByGoogleId,
    findByVerificationToken,
    findByResetToken,
    updateUser,
    deleteUser,
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
    revokeAllRefreshTokensForUser,
    deleteExpiredRefreshTokens,
    clearExpiredVerificationTokens,
    clearExpiredResetTokens,
};
