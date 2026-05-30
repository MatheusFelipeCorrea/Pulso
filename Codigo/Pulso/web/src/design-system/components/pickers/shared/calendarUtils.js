import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from 'date-fns'

export const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export const MONTH_SHORT_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

/** Grade de dias para um mês (inclui dias adjacentes para completar semanas) */
export function getCalendarDays(month, weekStartsOn = 0) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn })
  return eachDayOfInterval({ start, end })
}

export function isDayDisabled(day, { minDate, maxDate, disablePast }) {
  const d = startOfDay(day)
  if (disablePast && isBefore(d, startOfDay(new Date()))) return true
  if (minDate && isBefore(d, startOfDay(minDate))) return true
  if (maxDate && isAfter(d, startOfDay(maxDate))) return true
  return false
}

/** Retorna estado visual do dia para seleção de range ou data única */
export function getDayRangeState(day, { rangeStart, rangeEnd, hoverDay, selected }) {
  const d = startOfDay(day)

  if (selected && isSameDay(d, selected)) {
    return { type: 'selected' }
  }

  if (!rangeStart) return { type: 'default' }

  const effectiveEnd = rangeEnd ?? hoverDay
  if (!effectiveEnd) {
    if (isSameDay(d, rangeStart)) return { type: 'endpoint', position: 'single' }
    return { type: 'default' }
  }

  const start = startOfDay(isBefore(rangeStart, effectiveEnd) ? rangeStart : effectiveEnd)
  const end = startOfDay(isBefore(rangeStart, effectiveEnd) ? effectiveEnd : rangeStart)

  if (isSameDay(d, start) && isSameDay(d, end)) {
    return { type: 'endpoint', position: 'single', confirmed: Boolean(rangeEnd) }
  }
  if (isSameDay(d, start)) {
    return { type: 'endpoint', position: 'start', confirmed: Boolean(rangeEnd) }
  }
  if (isSameDay(d, end)) {
    return {
      type: 'endpoint',
      position: rangeEnd ? 'end' : 'preview-end',
      confirmed: Boolean(rangeEnd),
    }
  }
  if (isWithinInterval(d, { start, end })) {
    return { type: 'in-range', confirmed: Boolean(rangeEnd) }
  }

  return { type: 'default' }
}

export function isInRangePreview(day, start, end) {
  if (!start || !end) return false
  const [a, b] = isBefore(start, end) ? [start, end] : [end, start]
  return isWithinInterval(startOfDay(day), { start: startOfDay(a), end: startOfDay(b) })
}

export {
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
}
