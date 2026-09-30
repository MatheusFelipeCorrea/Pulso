import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TRIP_EXPENSE_CATEGORY_MAP } from '@/utils/tripExpenseCategories.js'

export function formatTripDetailDate(iso) {
  if (!iso) return ''
  try {
    const formatted = format(parseISO(iso), 'LLL/yyyy', { locale: ptBR })
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace('.', '')
  } catch {
    return ''
  }
}

export function formatTripRateUpdatedAt(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function buildCategoryBreakdown(despesas = []) {
  const totals = despesas.reduce((acc, item) => {
    const value = Number(item.valorEstimado) || 0
    acc[item.categoria] = (acc[item.categoria] ?? 0) + value
    return acc
  }, {})

  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0)

  return Object.entries(totals)
    .map(([categoria, valor]) => ({
      categoria,
      label: TRIP_EXPENSE_CATEGORY_MAP[categoria]?.tableLabel ?? categoria,
      valor,
      percentual: grandTotal > 0 ? (valor / grandTotal) * 100 : 0,
    }))
    .sort((left, right) => right.valor - left.valor)
}

export function calcTripTotalInCurrency(totalBrl, moeda, rateBid) {
  const total = Number(totalBrl) || 0
  if (moeda === 'BRL') return total
  const rate = Number(rateBid)
  if (!Number.isFinite(rate) || rate <= 0) return total
  return total / rate
}
