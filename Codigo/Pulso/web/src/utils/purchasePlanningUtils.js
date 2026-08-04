export const PRIORIDADE_LABELS = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
}

export const PRIORIDADE_OPTIONS = [
  { value: 'ALTA', label: PRIORIDADE_LABELS.ALTA },
  { value: 'MEDIA', label: PRIORIDADE_LABELS.MEDIA },
  { value: 'BAIXA', label: PRIORIDADE_LABELS.BAIXA },
]

export const COMPROMETIMENTO_NIVEL = {
  SAUDAVEL: 'saudavel',
  ATENCAO: 'atencao',
  ARRISCADO: 'arriscado',
}

export const COMPROMETIMENTO_COLORS = {
  [COMPROMETIMENTO_NIVEL.SAUDAVEL]: '#22C55E',
  [COMPROMETIMENTO_NIVEL.ATENCAO]: '#F59E0B',
  [COMPROMETIMENTO_NIVEL.ARRISCADO]: '#EF4444',
}

export const COMPROMETIMENTO_LABELS = {
  [COMPROMETIMENTO_NIVEL.SAUDAVEL]: 'Saudável',
  [COMPROMETIMENTO_NIVEL.ATENCAO]: 'Atenção',
  [COMPROMETIMENTO_NIVEL.ARRISCADO]: 'Arriscado',
}

export const CATEGORIA_LABELS = {
  ELETRONICOS: 'Eletrônicos',
  CASA_ELETRODOMESTICOS: 'Casa & Eletrodomésticos',
  VESTUARIO: 'Vestuário',
  VEICULO: 'Veículo',
  ACESSORIOS: 'Acessórios',
  OUTROS: 'Outros',
}

export const CATEGORIA_SEGMENTS = [
  { key: 'ELETRONICOS', color: '#3B82F6', label: CATEGORIA_LABELS.ELETRONICOS },
  { key: 'CASA_ELETRODOMESTICOS', color: '#7C3AED', label: CATEGORIA_LABELS.CASA_ELETRODOMESTICOS },
  { key: 'VESTUARIO', color: '#EC4899', label: CATEGORIA_LABELS.VESTUARIO },
  { key: 'VEICULO', color: '#06B6D4', label: CATEGORIA_LABELS.VEICULO },
  { key: 'ACESSORIOS', color: '#F59E0B', label: CATEGORIA_LABELS.ACESSORIOS },
  { key: 'OUTROS', color: '#94A3B8', label: CATEGORIA_LABELS.OUTROS },
]

const CATEGORIA_ICON_MAP = {
  ELETRONICOS: { icon: 'Smartphone', color: '#3B82F6' },
  CASA_ELETRODOMESTICOS: { icon: 'Home', color: '#7C3AED' },
  VESTUARIO: { icon: 'Shirt', color: '#EC4899' },
  VEICULO: { icon: 'Car', color: '#06B6D4' },
  ACESSORIOS: { icon: 'ShoppingBag', color: '#F59E0B' },
  OUTROS: { icon: 'Sparkles', color: '#94A3B8' },
}

export function getCategoryIconConfig(categoria) {
  return CATEGORIA_ICON_MAP[categoria] ?? CATEGORIA_ICON_MAP.OUTROS
}

export function formatMesesParaComprar(meses) {
  if (meses === 0) return 'Meta atingida'
  if (meses == null) return 'Sem sobra mensal'
  if (meses === 1) return '1 mês'
  return `${meses} meses`
}

export function formatComprometimentoPercentual(percentual) {
  const value = Number(percentual ?? 0)
  return `${value.toFixed(1).replace('.0', '')}%`
}

/** Mesmos limiares usados no backend (api/src/utils/purchasePlanningUtils.js). */
export function getComprometimentoNivel(percentual) {
  const value = Number(percentual ?? 0)
  if (value > 30) return COMPROMETIMENTO_NIVEL.ARRISCADO
  if (value > 20) return COMPROMETIMENTO_NIVEL.ATENCAO
  return COMPROMETIMENTO_NIVEL.SAUDAVEL
}

export function shouldShowImpactAlert(mediaImpactoRenda) {
  return Number(mediaImpactoRenda ?? 0) > 20
}

/** Mesma fórmula usada no backend (api/src/utils/purchasePlanningUtils.js#calcComprometimento). */
export function calcComprometimentoParcela(valorEstimado, parcelas, rendaMensal) {
  const renda = Number(rendaMensal ?? 0)
  const parcelasNum = Math.max(Number(parcelas) || 1, 1)
  const parcela = Number(valorEstimado ?? 0) / parcelasNum
  if (renda <= 0) {
    return { parcela, percentual: 0, nivel: COMPROMETIMENTO_NIVEL.SAUDAVEL }
  }
  const percentual = Math.round((parcela / renda) * 1000) / 10
  return { parcela, percentual, nivel: getComprometimentoNivel(percentual) }
}

export function capitalizeNomeItem(nome) {
  const texto = String(nome ?? '').trim()
  if (!texto) return texto
  return texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1)
}
