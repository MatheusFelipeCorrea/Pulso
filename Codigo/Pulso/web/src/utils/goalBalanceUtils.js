import { differenceInMonths, startOfDay } from 'date-fns'

export function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100
}

export function calcProgressoMeta(meta) {
  const valorAlvo = roundMoney(meta?.valorAlvo ?? 0)
  const valorAtual = roundMoney(meta?.valorAtual ?? 0)
  const valorRestante = Math.max(0, roundMoney(valorAlvo - valorAtual))
  const percentual = valorAlvo > 0 ? Math.min(100, roundMoney((valorAtual / valorAlvo) * 100)) : 0

  return { valorAlvo, valorAtual, valorRestante, percentual }
}

export function inferirTipoMeta(prazo) {
  if (!prazo) return 'LONGO_PRAZO'
  const meses = Math.max(1, differenceInMonths(startOfDay(new Date(prazo)), startOfDay(new Date())))
  return meses <= 6 ? 'CURTO_PRAZO' : 'LONGO_PRAZO'
}

export function calcValorMensalSugerido(valorAlvo, valorAtual, prazo) {
  const restante = Math.max(0, roundMoney(Number(valorAlvo) - Number(valorAtual)))
  if (!prazo || restante <= 0) return 0
  const meses = Math.max(1, differenceInMonths(startOfDay(new Date(prazo)), startOfDay(new Date())))
  return roundMoney(restante / meses)
}

export function calcMesesAtePrazo(prazo) {
  if (!prazo) return null
  return Math.max(1, differenceInMonths(startOfDay(new Date(prazo)), startOfDay(new Date())))
}

export function podeReceberAporte(meta) {
  return meta?.status === 'ATIVA'
}
