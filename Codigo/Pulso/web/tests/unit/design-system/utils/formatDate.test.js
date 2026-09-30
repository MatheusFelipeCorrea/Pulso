import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDate, formatDateRelative } from '@/design-system/utils/formatDate.js'

describe('formatDate utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-18T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formata data válida e retorna placeholder para inválida', () => {
    expect(formatDate(new Date(2026, 5, 18))).toBe('18/06/2026')
    expect(formatDate('2026-06-18T12:00:00Z', 'dd/MM/yyyy HH:mm')).toMatch(/^18\/06\/2026 \d{2}:\d{2}$/)
    expect(formatDate(null)).toBe('—')
    expect(formatDate('invalida')).toBe('—')
  })

  it('formata datas relativas para hoje, ontem e amanhã', () => {
    expect(formatDateRelative('2026-06-18T01:00:00Z')).toBe('hoje')
    expect(formatDateRelative('2026-06-17T01:00:00Z')).toBe('ontem')
    expect(formatDateRelative('2026-06-19T01:00:00Z')).toBe('amanhã')
  })

  it('usa formatDistance para datas fora dos casos especiais', () => {
    expect(formatDateRelative('2026-06-10T01:00:00Z')).toContain('há')
    expect(formatDateRelative('2026-06-25T01:00:00Z')).toContain('em')
  })

  it('retorna placeholder quando ocorre exceção interna', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const invalidDateLike = { getTime: () => {
      throw new Error('erro interno')
    } }
    expect(formatDate(invalidDateLike)).toBe('—')
    expect(formatDateRelative(invalidDateLike)).toBe('—')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
