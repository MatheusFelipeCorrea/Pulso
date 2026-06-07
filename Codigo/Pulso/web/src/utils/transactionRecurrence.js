/** Converte frequência + fim em RRULE (RFC 5545 simplificado) */
export function buildRecurrenceRule({ frequencia, ateQuando, dataFim }) {
  const freqMap = {
    SEMANAL: 'FREQ=WEEKLY;INTERVAL=1',
    QUINZENAL: 'FREQ=WEEKLY;INTERVAL=2',
    MENSAL: 'FREQ=MONTHLY;INTERVAL=1',
    ANUAL: 'FREQ=YEARLY;INTERVAL=1',
  }

  let rule = freqMap[frequencia] ?? freqMap.MENSAL

  if (ateQuando === 'DATA' && dataFim) {
    const d = dataFim instanceof Date ? dataFim : new Date(dataFim)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    rule += `;UNTIL=${y}${m}${day}T235959Z`
  }

  return rule
}

/** Período atual no formato YYYY-MM */
export function periodoAtual() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function periodoParaMonthPicker(periodo) {
  const [year, month] = periodo.split('-').map(Number)
  return { year, month }
}

export function monthPickerParaPeriodo({ year, month }) {
  return `${year}-${String(month).padStart(2, '0')}`
}
