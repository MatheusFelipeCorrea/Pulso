const AppError = require('./appError');

const normalize = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

/**
 * Valida combinação recurso x categoria (RN-032, RN-035, RN-038, RN-039).
 * Aplica apenas a despesas com recurso VA, VR ou VT.
 */
const validarRecursoCategoria = (recurso, categoria, tipo) => {
    if (tipo !== 'DESPESA') return;
    if (recurso === 'DINHEIRO') return;

    const nome = normalize(categoria?.nome);

    if (recurso === 'VA') {
        if (!['alimentacao', 'compras'].includes(nome)) {
            throw new AppError(
                'VA só pode ser usado em despesas de Alimentação ou Compras',
                400
            );
        }
        return;
    }

    if (recurso === 'VR') {
        if (nome !== 'alimentacao') {
            throw new AppError('VR só pode ser usado em despesas de Alimentação', 400);
        }
        return;
    }

    if (recurso === 'VT') {
        if (nome === 'alimentacao') {
            throw new AppError('Não é possível usar VT para despesas de alimentação', 400);
        }
        if (nome !== 'transporte') {
            throw new AppError('VT só pode ser usado em despesas de Transporte', 400);
        }
    }
};

module.exports = { validarRecursoCategoria, normalize };
