import { endOfMonth, startOfMonth } from 'date-fns'
import { periodoAtual } from './transactionRecurrence.js'

export function formatDateParam(date) {
  if (!date) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateParam(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function datesIguais(a, b) {
  if (!a && !b) return true
  if (!a || !b) return false
  return formatDateParam(a) === formatDateParam(b)
}

export function periodoParaDateRange(periodo) {
  const [year, month] = (periodo || periodoAtual()).split('-').map(Number)
  const start = new Date(year, month - 1, 1)
  return { start, end: endOfMonth(start) }
}

export function defaultMesAtualDateRange() {
  const now = new Date()
  return { start: startOfMonth(now), end: endOfMonth(now) }
}

export function periodoFromDateRange(start) {
  if (!start) return periodoAtual()
  const y = start.getFullYear()
  const m = String(start.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function filtrosPeriodoSaoPadrao(dataInicio, dataFim) {
  const { start, end } = defaultMesAtualDateRange()
  return datesIguais(dataInicio, start) && datesIguais(dataFim, end)
}
