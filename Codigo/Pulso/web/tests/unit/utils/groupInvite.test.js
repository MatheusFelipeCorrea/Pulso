import { describe, expect, it } from 'vitest'
import {
  buildGrupoInviteLink,
  codigoGrupoCompleto,
  formatarCodigoGrupoInput,
  formatGrupoCodigoDisplay,
  formatGrupoInviteLinkDisplay,
  normalizarCodigoGrupo,
} from '@/utils/groupInvite.js'

describe('groupInvite', () => {
  it('formata input do código', () => {
    expect(formatarCodigoGrupoInput('x7k2')).toBe('PULSO-X7K2')
    expect(normalizarCodigoGrupo('pulso-ab12')).toBe('PULSO-AB12')
  })

  it('detecta código completo', () => {
    expect(codigoGrupoCompleto('PULSO-AB12')).toBe(true)
    expect(codigoGrupoCompleto('PULSO-AB1')).toBe(false)
  })

  it('monta link de convite', () => {
    expect(buildGrupoInviteLink('PULSO-AB12')).toContain('/groups/join/PULSO-AB12')
  })

  it('formata código para exibição', () => {
    expect(formatGrupoCodigoDisplay('pulso-x7k2')).toBe('PULSO-X7K2')
  })

  it('formata link de convite para exibição', () => {
    expect(formatGrupoInviteLinkDisplay('PULSO-AB12')).toMatch(/\/groups\/join\/PULSO-AB12$/)
    expect(formatGrupoInviteLinkDisplay('https://pulsoapp.com/groups?convite=PULSO-AB12')).toBe(
      'pulsoapp.com/groups/join/PULSO-AB12'
    )
  })
})
