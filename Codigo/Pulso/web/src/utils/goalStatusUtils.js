import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { calcValorMensalSugerido } from './goalBalanceUtils.js'

export function getGoalProgressVariant(status) {
  if (status === 'CONCLUIDA') return 'success'
  if (status === 'PAUSADA') return 'warning'
  return 'primary'
}

export function formatGoalDeadline(prazo) {
  if (!prazo) return 'Sem prazo'
  return format(parseISO(prazo), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatGoalDeadlineLabel(meta) {
  if (!meta?.prazo) return 'Sem prazo definido'
  const data = formatGoalDeadline(meta.prazo)
  if (meta.status === 'CONCLUIDA') return `Concluída em ${data}`
  if (meta.vencida) return `Venceu em ${data}`
  const meses = meta.mesesRestantes ?? 0
  const mesesLabel = meses === 1 ? '1 mês' : `${meses} meses`
  return `Vence em ${data} (${mesesLabel})`
}

export function getGoalInsight(meta) {
  if (meta.status === 'CONCLUIDA') {
    return 'Parabéns! Meta concluída com sucesso.'
  }

  if (meta.status === 'PAUSADA') {
    return 'Meta pausada. Retome quando quiser continuar guardando.'
  }

  if (meta.vencida) {
    return 'Prazo vencido. Ajuste o prazo ou aumente seus aportes para retomar o plano.'
  }

  const mensal = Number(meta.valorMensalSugerido) || calcValorMensalSugerido(meta.valorAlvo, meta.valorAtual, meta.prazo)

  if (mensal > 0) {
    return `Guarde ${formatCurrency(mensal)}/mês para atingir no prazo.`
  }

  return 'Você já atingiu o valor alvo desta meta.'
}
