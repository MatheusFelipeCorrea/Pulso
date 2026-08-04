/**
 * Grupos semânticos para VA / VR / VT (RN-032/035/038/039).
 *
 * Convenção do usuário (não imposta pelo código):
 * - Supermercado pode ir em Alimentação (VA) ou Mercado (VA) — escolha pessoal.
 * - VR só em refeições (grupo Alimentação).
 * - Categorias custom nascem sem benefício; o usuário opta pelo preset.
 */
export const GRUPO_BENEFICIO = {
  ALIMENTACAO: 'ALIMENTACAO',
  COMPRAS: 'COMPRAS',
  TRANSPORTE: 'TRANSPORTE',
}

export const GRUPO_BENEFICIO_LABELS = {
  ALIMENTACAO: 'Refeições e delivery (VA e VR)',
  COMPRAS: 'Mercado / supermercado (VA)',
  TRANSPORTE: 'Transporte (VT)',
}

/** Categorias padrão do sistema — match exato no nome normalizado. */
export const DEFAULT_NOME_PARA_GRUPO = {
  alimentacao: GRUPO_BENEFICIO.ALIMENTACAO,
  compras: GRUPO_BENEFICIO.COMPRAS,
  transporte: GRUPO_BENEFICIO.TRANSPORTE,
}

/** Só nomes óbvios — match exato; nomes ambíguos ficam sem grupo. */
export const ALIAS_EXATO_PARA_GRUPO = {
  mercado: GRUPO_BENEFICIO.COMPRAS,
  supermercado: GRUPO_BENEFICIO.COMPRAS,
  ifood: GRUPO_BENEFICIO.ALIMENTACAO,
  uber: GRUPO_BENEFICIO.TRANSPORTE,
}

export const CATEGORIA_BENEFICIO_PRESETS = [
  {
    value: '',
    title: 'Gasto comum',
    description: 'Dinheiro ou poupança — sem vales.',
    hint: 'Roupas, eletrônicos, assinaturas e despesas gerais.',
  },
  {
    value: GRUPO_BENEFICIO.ALIMENTACAO,
    title: 'Refeições e delivery',
    description: 'Restaurante, lanche, iFood e similares.',
    hint: 'VA e VR ao lançar. Supermercado também pode ir aqui, se preferir.',
  },
  {
    value: GRUPO_BENEFICIO.COMPRAS,
    title: 'Mercado / supermercado',
    description: 'Supermercado, feira e hortifruti.',
    hint: 'Só VA — não use para shopping ou compras gerais.',
  },
  {
    value: GRUPO_BENEFICIO.TRANSPORTE,
    title: 'Transporte',
    description: 'Uber, 99, metrô, ônibus, combustível.',
    hint: 'Só VT.',
  },
]
