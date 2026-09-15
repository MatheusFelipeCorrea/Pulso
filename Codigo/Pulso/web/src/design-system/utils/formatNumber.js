/**
 * formatNumber() - Formatação de números genéricos
 * 
 * Formata números usando Intl.NumberFormat.
 * 
 * @param {number|string|null|undefined} value - Valor a formatar
 * @param {object} options - Opções do Intl.NumberFormat
 * @returns {string} - Número formatado ou "—" se inválido
 * 
 * Uso:
 *   formatNumber(1500.5)                                → "1.500,5"
 *   formatNumber(1500.5, { minimumFractionDigits: 2 }) → "1.500,50"
 *   formatNumber(0.85, { style: 'percent' })           → "85%"
 *   formatNumber(null)                                  → "—"
 */

export function formatNumber(value, options = {}) {
  // Trata valores inválidos
  if (value === null || value === undefined || isNaN(value)) {
    return '—'
  }

  // Converte para número se for string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return '—'
  }

  try {
    // Locale padrão brasileiro
    const locale = options.locale || 'pt-BR'
    const { locale: _, ...intlOptions } = options

    return new Intl.NumberFormat(locale, intlOptions).format(numericValue)
  } catch (error) {
    console.warn('formatNumber error:', error)
    return '—'
  }
}
