import { periodoAtual } from './transactionRecurrence.js'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

export function periodoToMesReferencia(periodo) {
  return `${periodo}-01`
}

export function mesReferenciaAnterior(periodo) {
  const [year, month] = periodo.split('-').map(Number)
  const date = new Date(year, month - 2, 1)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

export function statusToProgressVariant(status) {
  if (status === 'estourado') return 'danger'
  if (status === 'alerta') return 'warning'
  return 'primary'
}

export function barToneFromPercentual(percentual = 0) {
  if (percentual >= 100) return 'danger'
  if (percentual >= 70) return 'warning'
  return 'primary'
}

export function formatPercentualCategoria(value = 0) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1).replace('.', ',')}%`
}

/** Normaliza gasto/limite quando a API não envia um dos campos */
export function resolveBudgetAmounts(alerta = {}) {
  let gasto = Number(alerta.gastoValor)
  let limite = Number(alerta.limiteValor)
  const percentual = Number(alerta.percentualUsado) || 0

  if (Number.isNaN(gasto) && !Number.isNaN(limite) && limite > 0 && percentual > 0) {
    gasto = (percentual / 100) * limite
  }
  if (Number.isNaN(limite) && !Number.isNaN(gasto) && gasto > 0 && percentual > 0) {
    limite = (gasto / percentual) * 100
  }

  return {
    gasto: Number.isNaN(gasto) ? 0 : gasto,
    limite: Number.isNaN(limite) ? 0 : limite,
  }
}

export function formatBudgetAlertStatus({ gasto, limite, percentual, estourado }) {
  if (estourado && limite > 0) {
    const excesso = Math.max(0, gasto - limite)
    return `${formatCurrency(excesso)} acima do limite`
  }
  return `${formatPercentualCategoria(percentual)} utilizado`
}

export { periodoAtual }
