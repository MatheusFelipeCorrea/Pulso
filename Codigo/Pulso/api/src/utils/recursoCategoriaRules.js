const AppError = require('./appError');
const {
    GRUPO_BENEFICIO,
    GRUPO_BENEFICIO_LABELS,
    DEFAULT_NOME_PARA_GRUPO,
    ALIAS_EXATO_PARA_GRUPO,
} = require('../constants/categoryBeneficioGroups');

const normalize = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const inferirGrupoBeneficioPorNome = (nome) => {
    const normalized = normalize(nome);
    if (!normalized) return null;

    if (DEFAULT_NOME_PARA_GRUPO[normalized]) {
        return DEFAULT_NOME_PARA_GRUPO[normalized];
    }

    return ALIAS_EXATO_PARA_GRUPO[normalized] ?? null;
};

const resolverGrupoBeneficio = (categoria) => {
    if (!categoria) return null;
    if (categoria.grupoBeneficio) return categoria.grupoBeneficio;
    return inferirGrupoBeneficioPorNome(categoria.nome);
};

const buildMensagemIncompativel = (recurso, categoriaNome) => {
    const nome = categoriaNome?.trim() || 'esta categoria';

    if (recurso === 'VA') {
        return (
            `A categoria "${nome}" não aceita Vale Alimentação (VA). ` +
            `Use uma categoria de ${GRUPO_BENEFICIO_LABELS.ALIMENTACAO} ou ${GRUPO_BENEFICIO_LABELS.COMPRAS}, ` +
            'ou edite a categoria e escolha o preset compatível.'
        );
    }

    if (recurso === 'VR') {
        return (
            `A categoria "${nome}" não aceita Vale Refeição (VR). ` +
            `VR só vale para ${GRUPO_BENEFICIO_LABELS.ALIMENTACAO}.`
        );
    }

    return (
        `A categoria "${nome}" não aceita Vale Transporte (VT). ` +
        `VT só vale para ${GRUPO_BENEFICIO_LABELS.TRANSPORTE}.`
    );
};

/**
 * Valida combinação recurso x categoria (RN-032, RN-035, RN-038, RN-039).
 * Usa grupoBeneficio explícito, com fallback por nome/aliases das categorias padrão.
 */
const validarRecursoCategoria = (recurso, categoria, tipo) => {
    if (tipo !== 'DESPESA') return;
    if (recurso === 'DINHEIRO' || recurso === 'POUPANCA') return;

    const grupo = resolverGrupoBeneficio(categoria);

    if (recurso === 'VA') {
        const permitido =
            grupo === GRUPO_BENEFICIO.ALIMENTACAO || grupo === GRUPO_BENEFICIO.COMPRAS;
        if (!permitido) {
            throw new AppError(buildMensagemIncompativel('VA', categoria?.nome), 400);
        }
        return;
    }

    if (recurso === 'VR') {
        if (grupo !== GRUPO_BENEFICIO.ALIMENTACAO) {
            throw new AppError(buildMensagemIncompativel('VR', categoria?.nome), 400);
        }
        return;
    }

    if (recurso === 'VT') {
        if (grupo === GRUPO_BENEFICIO.ALIMENTACAO) {
            throw new AppError(
                `Não é possível usar VT na categoria "${categoria?.nome}". VT não vale para alimentação.`,
                400
            );
        }
        if (grupo !== GRUPO_BENEFICIO.TRANSPORTE) {
            throw new AppError(buildMensagemIncompativel('VT', categoria?.nome), 400);
        }
    }
};

module.exports = {
    validarRecursoCategoria,
    normalize,
    inferirGrupoBeneficioPorNome,
    resolverGrupoBeneficio,
};
