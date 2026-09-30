const AppError = require('../utils/appError');
const prisma = require('../config/database');

/**
 * Exige plano PREMIUM. FREE recebe 403 (gate no backend — web e Flutter herdam).
 */
const requirePremium = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new AppError('Não autenticado.', 401);
        }

        const config = await prisma.configuracaoUsuario.findUnique({
            where: { usuarioId: req.user.id },
            select: { plano: true },
        });

        const plano = config?.plano ?? 'FREE';
        req.user.plano = plano;

        if (plano !== 'PREMIUM') {
            const err = new AppError(
                'Recurso disponível apenas no plano Premium. Faça upgrade para continuar.',
                403
            );
            err.code = 'PREMIUM_REQUIRED';
            throw err;
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = requirePremium;
