const AppError = require('./appError');

const isPrismaUniqueViolation = (error) => error?.code === 'P2002';

const mapPrismaUniqueViolation = (error) => {
    const target = Array.isArray(error?.meta?.target)
        ? error.meta.target.join(',')
        : String(error?.meta?.target ?? '');

    if (target.includes('email')) {
        return new AppError('Este email já está cadastrado.', 409);
    }

    if (target.includes('meta_id')) {
        return new AppError('Esta meta já está vinculada a outra viagem', 409);
    }

    if (target.includes('grupo_id')) {
        return new AppError('Este grupo já possui uma viagem vinculada', 409);
    }

    return new AppError('Registro duplicado.', 409);
};

module.exports = {
    isPrismaUniqueViolation,
    mapPrismaUniqueViolation,
};
