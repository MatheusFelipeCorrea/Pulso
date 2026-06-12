import { describe, expect, it } from 'vitest'

import { getInitials, stringToHue } from '@/design-system/utils/stringToHue.js'

describe('design-system/utils/stringToHue', () => {
  it('gera hue estável entre 0 e 359', () => {
    const hue1 = stringToHue('Ana Souza')
    const hue2 = stringToHue('Ana Souza')
    const hue3 = stringToHue('Bruno Silva')

    expect(hue1).toBe(hue2)
    expect(hue1).toBeGreaterThanOrEqual(0)
    expect(hue1).toBeLessThan(360)
    expect(hue3).toBeGreaterThanOrEqual(0)
  })

  it('gera iniciais com até duas letras', () => {
    expect(getInitials('Ana Souza')).toBe('AS')
    expect(getInitials('  Ana   ')).toBe('A')
    expect(getInitials('')).toBe('')
    expect(getInitials('ana maria silva')).toBe('AM')
  })
})
