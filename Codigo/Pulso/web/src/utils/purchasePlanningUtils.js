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
  TECNOLOGIA: 'Tecnologia',
  ELETRONICOS: 'Eletrônicos',
  ACESSORIOS: 'Acessórios',
  OUTROS: 'Outros',
}

export const CATEGORIA_SEGMENTS = [
  { key: 'TECNOLOGIA', color: '#7C3AED', label: CATEGORIA_LABELS.TECNOLOGIA },
  { key: 'ELETRONICOS', color: '#3B82F6', label: CATEGORIA_LABELS.ELETRONICOS },
  { key: 'ACESSORIOS', color: '#F59E0B', label: CATEGORIA_LABELS.ACESSORIOS },
  { key: 'OUTROS', color: '#94A3B8', label: CATEGORIA_LABELS.OUTROS },
]

const CATEGORIA_ICON_MAP = {
  TECNOLOGIA: { icon: 'Laptop', color: '#7C3AED' },
  ELETRONICOS: { icon: 'Smartphone', color: '#3B82F6' },
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

export function shouldShowImpactAlert(mediaImpactoRenda) {
  return Number(mediaImpactoRenda ?? 0) > 20
}
