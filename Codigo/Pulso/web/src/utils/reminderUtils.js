/** Lembrete com valor monetário (conta, fatura, etc.) */
export function reminderHasPayment(item) {
  const valor = item?.valor
  if (valor == null || valor === '') return false
  return Number(valor) > 0
}

export function getReminderMarkLabel(item, { short = false } = {}) {
  if (reminderHasPayment(item)) {
    return short ? 'Marcar pago' : 'Marcar como pago'
  }
  return short ? 'Marcar feito' : 'Marcar como feito'
}

export function getReminderMarkShortLabel(item) {
  return getReminderMarkLabel(item, { short: true })
}
