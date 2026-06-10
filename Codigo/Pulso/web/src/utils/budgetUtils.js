import { periodoAtual } from './transactionRecurrence.js'

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

export { periodoAtual }
