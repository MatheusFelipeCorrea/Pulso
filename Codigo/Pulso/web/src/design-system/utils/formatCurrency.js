/**
 * formatCurrency() - Formatação de valores monetários
 * 
 * Formata números como moeda usando Intl.NumberFormat.
 * 
 * @param {number|string|null|undefined} value - Valor a formatar
 * @param {string} locale - Locale (padrão: 'pt-BR')
 * @param {string} currency - Código da moeda (padrão: 'BRL')
 * @param {object} options - Opções extras do Intl.NumberFormat
 * @returns {string} - Valor formatado (ex: "R$ 1.500,00") ou "—" se inválido
 * 
 * Uso:
 *   formatCurrency(1500.50)              → "R$ 1.500,50"
 *   formatCurrency(1500.50, 'en-US', 'USD') → "$1,500.50"
 *   formatCurrency(null)                 → "—"
 */

export function formatCurrency(
  value,
  locale = 'pt-BR',
  currency = 'BRL',
  options = {}
) {
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
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    }).format(numericValue)
  } catch (error) {
    console.warn('formatCurrency error:', error)
    return '—'
  }
}
