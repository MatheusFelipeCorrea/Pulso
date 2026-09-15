import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns'

export const DEFAULT_RANGE_PRESETS = [
  {
    id: 'today',
    label: 'Hoje',
    getValue: () => {
      const today = startOfDay(new Date())
      return { start: today, end: endOfDay(today) }
    },
  },
  {
    id: 'last7',
    label: 'Últimos 7 dias',
    getValue: () => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: endOfDay(new Date()),
    }),
  },
  {
    id: 'thisMonth',
    label: 'Este mês',
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    id: 'lastMonth',
    label: 'Mês passado',
    getValue: () => {
      const prev = subMonths(new Date(), 1)
      return { start: startOfMonth(prev), end: endOfMonth(prev) }
    },
  },
  {
    id: 'last3',
    label: 'Últimos 3 meses',
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 2)),
      end: endOfMonth(new Date()),
    }),
  },
  {
    id: 'last6',
    label: 'Últimos 6 meses',
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 5)),
      end: endOfMonth(new Date()),
    }),
  },
]
