/** Grupos semânticos para compatibilidade VA / VR (grupo TRANSPORTE para importação; recurso VT rejeitado na API). */
const GRUPO_BENEFICIO = {
    ALIMENTACAO: 'ALIMENTACAO',
    COMPRAS: 'COMPRAS',
    TRANSPORTE: 'TRANSPORTE',
};

const GRUPO_BENEFICIO_LABELS = {
    ALIMENTACAO: 'Refeições e delivery (VA e VR)',
    COMPRAS: 'Mercado / supermercado (VA)',
    TRANSPORTE: 'Transporte',
};

/**
 * Convenção do usuário (não imposta pelo código):
 * - Supermercado pode ir em Alimentação ou Mercado — ambos aceitam VA.
 * - VR só em refeições (grupo Alimentação).
 * - Categorias custom nascem sem benefício; inferência só para nomes óbvios.
 * - Grupo TRANSPORTE permanece para importação de extratos; recurso VT é rejeitado na API de transações.
 */

/** Categorias padrão — match exato no nome normalizado. */
const DEFAULT_NOME_PARA_GRUPO = {
    alimentacao: GRUPO_BENEFICIO.ALIMENTACAO,
    compras: GRUPO_BENEFICIO.COMPRAS,
    transporte: GRUPO_BENEFICIO.TRANSPORTE,
};

/** Só nomes óbvios — match exato; "Shopping", "Compras online" etc. ficam sem grupo. */
const ALIAS_EXATO_PARA_GRUPO = {
    mercado: GRUPO_BENEFICIO.COMPRAS,
    supermercado: GRUPO_BENEFICIO.COMPRAS,
    ifood: GRUPO_BENEFICIO.ALIMENTACAO,
    uber: GRUPO_BENEFICIO.TRANSPORTE,
};

module.exports = {
    GRUPO_BENEFICIO,
    GRUPO_BENEFICIO_LABELS,
    DEFAULT_NOME_PARA_GRUPO,
    ALIAS_EXATO_PARA_GRUPO,
};
