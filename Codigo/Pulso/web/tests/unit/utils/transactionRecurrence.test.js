import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildRecurrenceRule,
  monthPickerParaPeriodo,
  periodoAtual,
  periodoParaMonthPicker,
} from '@/utils/transactionRecurrence.js'

describe('transactionRecurrence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-05T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('cria RRULE por frequência com fallback mensal', () => {
    expect(buildRecurrenceRule({ frequencia: 'SEMANAL' })).toBe('FREQ=WEEKLY;INTERVAL=1')
    expect(buildRecurrenceRule({ frequencia: 'INVALIDA' })).toBe('FREQ=MONTHLY;INTERVAL=1')
  })

  it('adiciona UNTIL quando fim é por data', () => {
    expect(
      buildRecurrenceRule({
        frequencia: 'MENSAL',
        ateQuando: 'DATA',
        dataFim: new Date(2026, 11, 31),
      })
    ).toBe('FREQ=MONTHLY;INTERVAL=1;UNTIL=20261231T235959Z')
  })

  it('retorna período atual e converte para month picker', () => {
    expect(periodoAtual()).toBe('2026-06')
    expect(periodoParaMonthPicker('2026-11')).toEqual({ year: 2026, month: 11 })
    expect(monthPickerParaPeriodo({ year: 2026, month: 3 })).toBe('2026-03')
  })
})
