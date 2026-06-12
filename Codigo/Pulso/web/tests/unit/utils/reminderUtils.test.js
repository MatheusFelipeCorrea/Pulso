import { describe, expect, it } from 'vitest'

import {
  getReminderMarkLabel,
  getReminderMarkShortLabel,
  reminderHasPayment,
} from '@/utils/reminderUtils.js'

describe('utils/reminderUtils', () => {
  it('identifica lembretes com valor monetário válido', () => {
    expect(reminderHasPayment({ valor: 10 })).toBe(true)
    expect(reminderHasPayment({ valor: '15.5' })).toBe(true)
    expect(reminderHasPayment({ valor: 0 })).toBe(false)
    expect(reminderHasPayment({ valor: '' })).toBe(false)
    expect(reminderHasPayment({})).toBe(false)
  })

  it('retorna labels corretos para marcar lembretes', () => {
    expect(getReminderMarkLabel({ valor: 100 })).toBe('Marcar como pago')
    expect(getReminderMarkLabel({ valor: 100 }, { short: true })).toBe('Marcar pago')
    expect(getReminderMarkLabel({ valor: null })).toBe('Marcar como feito')
    expect(getReminderMarkShortLabel({ valor: null })).toBe('Marcar feito')
  })
})
