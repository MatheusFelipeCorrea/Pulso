/**
 * formatDate() e formatDateRelative() - Formatação de datas
 * 
 * Usa date-fns para formatação consistente de datas.
 * 
 * @param {Date|string|number|null|undefined} date - Data a formatar
 * @param {string} formatStr - Formato (padrão: 'dd/MM/yyyy')
 * @returns {string} - Data formatada ou "—" se inválida
 * 
 * Uso:
 *   formatDate(new Date())                → "29/05/2026"
 *   formatDate(new Date(), 'dd/MM/yyyy HH:mm') → "29/05/2026 14:30"
 *   formatDate(null)                      → "—"
 * 
 *   formatDateRelative(new Date())        → "hoje"
 *   formatDateRelative(yesterday)         → "ontem"
 *   formatDateRelative(threeDaysAgo)      → "há 3 dias"
 */

import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata data em string específica
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  // Trata valores inválidos
  if (!date) {
    return '—'
  }

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date

    // Valida se é uma data válida
    if (isNaN(dateObj.getTime())) {
      return '—'
    }

    return format(dateObj, formatStr, { locale: ptBR })
  } catch (error) {
    console.warn('formatDate error:', error)
    return '—'
  }
}

/**
 * Formata data de forma relativa (hoje, ontem, há X dias)
 */
export function formatDateRelative(date) {
  // Trata valores inválidos
  if (!date) {
    return '—'
  }

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date

    // Valida se é uma data válida
    if (isNaN(dateObj.getTime())) {
      return '—'
    }

    const now = new Date()
    const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24))

    // Casos especiais
    if (diffInDays === 0) {
      return 'hoje'
    }
    if (diffInDays === 1) {
      return 'ontem'
    }
    if (diffInDays === -1) {
      return 'amanhã'
    }

    // Usa formatDistance do date-fns para outros casos
    return formatDistance(dateObj, now, {
      addSuffix: true,
      locale: ptBR,
    })
  } catch (error) {
    console.warn('formatDateRelative error:', error)
    return '—'
  }
}
