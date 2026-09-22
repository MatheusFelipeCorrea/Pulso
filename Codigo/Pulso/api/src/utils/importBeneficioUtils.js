const { GRUPO_BENEFICIO } = require('../constants/categoryBeneficioGroups');
const { normalize, resolverGrupoBeneficio } = require('./recursoCategoriaRules');

const ORIGENS_BENEFICIO = new Set(['VT', 'VA', 'VR']);

const AJUSTE_SALDO_IMPORTACAO_DESCRICAO = 'Ajuste de saldo — importação de extrato';

const isAjusteSaldoImportacao = (descricao) => descricao === AJUSTE_SALDO_IMPORTACAO_DESCRICAO;

const isOrigemBeneficio = (origem) => ORIGENS_BENEFICIO.has(origem);

const isOrigemComSaldoExtrato = (origem) => origem === 'CONTA' || isOrigemBeneficio(origem);

const categoriaCompativelImportacao = (categoria, origem, tipoTransacao) => {
    if (!categoria || categoria.tipo !== tipoTransacao) return false;
    if (!isOrigemBeneficio(origem)) return true;
    if (tipoTransacao === 'RECEITA') return true;

    const grupo = resolverGrupoBeneficio(categoria);
    if (origem === 'VR') return grupo === GRUPO_BENEFICIO.ALIMENTACAO;
    if (origem === 'VA') {
        return grupo === GRUPO_BENEFICIO.ALIMENTACAO || grupo === GRUPO_BENEFICIO.COMPRAS;
    }
    if (origem === 'VT') return grupo === GRUPO_BENEFICIO.TRANSPORTE;
    return true;
};
const encontrarCategoriaConta = (categorias, tipo) => {
    if (tipo === 'RECEITA') {
        return (
            categorias.find(
                (cat) =>
                    cat.tipo === 'RECEITA' &&
                    RECEITA_FALLBACK_NOMES.includes(normalize(cat.nome))
            ) ?? categorias.find((cat) => cat.tipo === 'RECEITA')
        );
    }

    return (
        categorias.find((cat) => cat.tipo === 'DESPESA' && normalize(cat.nome) === 'outros') ??
        categorias.find((cat) => cat.tipo === 'DESPESA')
    );
};

const encontrarCategoriaAjusteSaldo = (categorias, origem, tipo) => {
    if (origem === 'CONTA') {
        return encontrarCategoriaConta(categorias, tipo);
    }
    return encontrarCategoriaBeneficio(categorias, origem, tipo);
};

const RECURSO_BY_ORIGEM = {
    VT: 'VT',
    VA: 'VA',
    VR: 'VR',
};

const RECEITA_FALLBACK_NOMES = ['salario', 'salário', 'renda', 'extra', 'freelance'];

const encontrarCategoriaReceitaBeneficio = (categorias) =>
    categorias.find(
        (cat) =>
            cat.tipo === 'RECEITA' &&
            RECEITA_FALLBACK_NOMES.includes(normalize(cat.nome))
    ) ??
    categorias.find((cat) => cat.tipo === 'RECEITA' && normalize(cat.nome) !== 'outros') ??
    categorias.find((cat) => cat.tipo === 'RECEITA');

const encontrarCategoriaBeneficio = (categorias, origem, tipo) => {
    const recurso = RECURSO_BY_ORIGEM[origem];
    if (!recurso) return null;

    if (tipo === 'RECEITA') {
        return encontrarCategoriaReceitaBeneficio(categorias);
    }

    if (recurso === 'VR') {
        return (
            categorias.find(
                (cat) =>
                    cat.tipo === 'DESPESA' &&
                    resolverGrupoBeneficio(cat) === GRUPO_BENEFICIO.ALIMENTACAO
            ) ?? categorias.find((cat) => normalize(cat.nome) === 'alimentacao')
        );
    }

    if (recurso === 'VA') {
        return (
            categorias.find(
                (cat) =>
                    cat.tipo === 'DESPESA' &&
                    (resolverGrupoBeneficio(cat) === GRUPO_BENEFICIO.ALIMENTACAO ||
                        resolverGrupoBeneficio(cat) === GRUPO_BENEFICIO.COMPRAS)
            ) ?? categorias.find((cat) => normalize(cat.nome) === 'alimentacao')
        );
    }

    if (recurso === 'VT') {
        return (
            categorias.find(
                (cat) =>
                    cat.tipo === 'DESPESA' &&
                    resolverGrupoBeneficio(cat) === GRUPO_BENEFICIO.TRANSPORTE
            ) ?? categorias.find((cat) => normalize(cat.nome) === 'transporte')
        );
    }

    return null;
};

module.exports = {
    ORIGENS_BENEFICIO,
    AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
    isAjusteSaldoImportacao,
    isOrigemBeneficio,
    isOrigemComSaldoExtrato,
    categoriaCompativelImportacao,
    encontrarCategoriaBeneficio,
    encontrarCategoriaAjusteSaldo,
};
