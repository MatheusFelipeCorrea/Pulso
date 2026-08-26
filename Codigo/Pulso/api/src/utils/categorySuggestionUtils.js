const { normalize } = require('./recursoCategoriaRules');

const LIMIAR_SIMILARIDADE = 0.35;
const DESCRICAO_MINIMA = 3;

const bigramas = (texto) => {
    if (texto.length < 2) return [texto];

    const pares = [];
    for (let i = 0; i < texto.length - 1; i += 1) {
        pares.push(texto.slice(i, i + 2));
    }
    return pares;
};

/**
 * Coeficiente de Dice sobre bigramas de caracteres — similaridade determinística
 * entre 0 (nada em comum) e 1 (idêntico), sem dependências externas.
 */
const similaridade = (a, b) => {
    const textoA = normalize(a);
    const textoB = normalize(b);

    if (!textoA || !textoB) return 0;
    if (textoA === textoB) return 1;

    const bigramasA = bigramas(textoA);
    const bigramasB = bigramas(textoB);
    const restantes = [...bigramasB];

    let coincidencias = 0;
    for (const par of bigramasA) {
        const idx = restantes.indexOf(par);
        if (idx !== -1) {
            coincidencias += 1;
            restantes.splice(idx, 1);
        }
    }

    return (2 * coincidencias) / (bigramasA.length + bigramasB.length);
};

/**
 * Sugere a categoria mais provável para `descricaoAlvo` com base no histórico de
 * transações do próprio usuário (RF-028). `historico` é `[{ descricao, categoriaId }]`.
 * Retorna o `categoriaId` com maior score acumulado de similaridade, ou `null`
 * se nada atingir o limiar mínimo.
 */
const sugerirCategoriaId = (descricaoAlvo, historico = []) => {
    const alvo = normalize(descricaoAlvo);
    if (alvo.length < DESCRICAO_MINIMA || !historico.length) return null;

    const scorePorCategoria = new Map();

    for (const item of historico) {
        if (!item?.descricao || !item?.categoriaId) continue;

        const score = similaridade(alvo, item.descricao);
        if (score < LIMIAR_SIMILARIDADE) continue;

        scorePorCategoria.set(
            item.categoriaId,
            (scorePorCategoria.get(item.categoriaId) ?? 0) + score
        );
    }

    let melhorCategoriaId = null;
    let melhorScore = 0;
    for (const [categoriaId, score] of scorePorCategoria) {
        if (score > melhorScore) {
            melhorScore = score;
            melhorCategoriaId = categoriaId;
        }
    }

    return melhorCategoriaId;
};

module.exports = { similaridade, sugerirCategoriaId };
