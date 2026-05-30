/**
 * Utilitários para máscara monetária (InputMoney)
 * Formato pt-BR: #.##0,00
 */

export function formatMoneyMask(value, locale = 'pt-BR') {
  const numeric = typeof value === 'number' && !Number.isNaN(value) ? value : 0
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric)
}

/** Converte string de dígitos brutos (centavos) para number */
export function digitsToNumber(digits) {
  const cents = parseInt(String(digits).replace(/\D/g, '') || '0', 10)
  return cents / 100
}
