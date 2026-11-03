import { describe, expect, it } from 'vitest'
import {
    formatGroupActivity,
    formatGrupoMembroDisplayNome,
    limparNomeGrupoMembro,
} from '@/utils/groupFormat.js'

describe('groupFormat', () => {
    it('remove parenteses, sufixo de modo e espacos extras', () => {
        expect(limparNomeGrupoMembro('  Ana (admin)  Silva   pessoa física  ')).toBe('Ana Silva')
        expect(limparNomeGrupoMembro(null)).toBe('')
        expect(limparNomeGrupoMembro('Bruno estagiário')).toBe('Bruno')
    })

    it('marca o proprio membro e cai no nome original se a limpeza zerar', () => {
        expect(formatGrupoMembroDisplayNome('Carla CLT', true)).toBe('Carla (você)')
        expect(formatGrupoMembroDisplayNome('Diego', false)).toBe('Diego')
        expect(formatGrupoMembroDisplayNome('   ', false)).toBe('')
    })

    it('formata atividade recente e rejeita data invalida', () => {
        expect(formatGroupActivity(null)).toBe('Sem atividade recente')
        expect(formatGroupActivity('nao-e-data')).toBe('Sem atividade recente')
        expect(formatGroupActivity(new Date('invalid'))).toBe('Sem atividade recente')
        expect(formatGroupActivity(new Date().toISOString())).toMatch(/há|menos de/)
    })
})
