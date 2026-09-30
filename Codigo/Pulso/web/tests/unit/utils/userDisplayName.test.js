import { describe, expect, it } from 'vitest'
import { getUserDisplayName } from '@/utils/userDisplayName.js'

describe('getUserDisplayName', () => {
  it('retorna fallback quando nome vazio', () => {
    expect(getUserDisplayName('')).toBe('Usuário')
    expect(getUserDisplayName(null)).toBe('Usuário')
  })

  it('remove sufixos entre parênteses e normaliza espaços', () => {
    expect(getUserDisplayName('Maria (Estagiária)   (Beta)')).toBe('Maria')
    expect(getUserDisplayName('  João   Silva  ')).toBe('João Silva')
  })
})
