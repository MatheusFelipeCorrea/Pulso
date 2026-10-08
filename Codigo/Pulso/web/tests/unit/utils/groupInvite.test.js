import { afterEach, describe, expect, it, vi } from 'vitest'
import {
    buildGrupoInviteLink,
    codigoGrupoCompleto,
    codigoGrupoParcial,
    formatGrupoCodigoDisplay,
    formatGrupoInviteLinkDisplay,
    formatarCodigoGrupoInput,
    groupAccentFromName,
    normalizarCodigoGrupo,
} from '@/utils/groupInvite.js'

describe('groupInvite', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('normaliza e formata código', () => {
        expect(normalizarCodigoGrupo(' pulso-ab12 ')).toBe('PULSO-AB12')
        expect(formatarCodigoGrupoInput('ab')).toBe('PULSO-AB')
        expect(formatarCodigoGrupoInput('')).toBe('')
        expect(formatarCodigoGrupoInput('PULSO-XY99')).toBe('PULSO-XY99')
        expect(codigoGrupoCompleto('PULSO-AB12')).toBe(true)
        expect(codigoGrupoCompleto('PULSO-AB')).toBe(false)
        expect(codigoGrupoParcial('PULSO-AB')).toBe(true)
        expect(formatGrupoCodigoDisplay('pulso-zz00')).toBe('PULSO-ZZ00')
    })

    it('monta link de convite e display', () => {
        vi.stubGlobal('window', {
            location: { origin: 'http://localhost:5173', host: 'localhost:5173' },
        })
        expect(buildGrupoInviteLink('')).toBe('')
        expect(buildGrupoInviteLink('PULSO-AB12')).toBe(
            'http://localhost:5173/groups/join/PULSO-AB12'
        )
        expect(formatGrupoInviteLinkDisplay('')).toBe('')
        expect(formatGrupoInviteLinkDisplay('PULSO-AB12')).toBe(
            'localhost:5173/groups/join/PULSO-AB12'
        )
        expect(formatGrupoInviteLinkDisplay('http://x.dev/groups/join/PULSO-AB12')).toBe(
            'x.dev/groups/join/PULSO-AB12'
        )
        expect(formatGrupoInviteLinkDisplay('not a url')).toBe('')
    })

    it('escolhe accent a partir do nome', () => {
        const a = groupAccentFromName('Alpha')
        const b = groupAccentFromName('Alpha')
        expect(a).toEqual(b)
        expect(a).toHaveLength(2)
        expect(groupAccentFromName(null)).toHaveLength(2)
    })
})
