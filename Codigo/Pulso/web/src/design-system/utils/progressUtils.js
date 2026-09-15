/** Percentual 0–100+ a partir de value/max */
export function getProgressPercent(value, max = 100) {
  if (!max || max <= 0) return 0
  return (value / max) * 100
}

/** Largura visual da barra (cap em 100%) */
export function getProgressFillPercent(value, max = 100) {
  return Math.min(100, Math.max(0, getProgressPercent(value, max)))
}

/** Score de saúde — faixas do protótipo */
export function getHealthVariant(percent) {
  const p = Math.min(100, Math.max(0, percent))
  if (p <= 30) return 'danger'
  if (p <= 50) return 'warning'
  if (p <= 70) return 'info'
  if (p <= 90) return 'success'
  return 'primary'
}

export function getHealthLabel(percent) {
  const p = Math.min(100, Math.max(0, percent))
  if (p <= 30) return 'Crítico'
  if (p <= 50) return 'Alerta'
  if (p <= 70) return 'Regular'
  if (p <= 90) return 'Bom'
  return 'Excelente'
}

/** Resolve variant final (overflow → danger; health → faixa) */
export function resolveProgressVariant({
  value,
  max = 100,
  variant = 'primary',
  colorMode = 'variant',
}) {
  const percent = getProgressPercent(value, max)
  if (value > max) return 'danger'
  if (colorMode === 'health') return getHealthVariant(percent)
  return variant
}
