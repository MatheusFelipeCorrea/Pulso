import { describe, expect, it } from 'vitest'
import {
    calcularSaldosViagem,
    formatGroupChatTimestamp,
    formatGroupTripDate,
    getExpenseCategoryLabel,
    mergeMetaAportes,
    mergeTripMemberColumns,
    mesclarMensagensChat,
} from '@/utils/groupDetailUtils.js'

describe('groupDetailUtils — divisão de viagem', () => {
    const membros = [
        { id: 'a', nome: 'Ana', urlAvatar: null, souEu: false },
        { id: 'b', nome: 'Bruno', urlAvatar: null, souEu: true },
    ]

    const viagemMembros = [
        { usuarioId: 'a', nome: 'Ana', urlAvatar: null, despesas: [], total: '300.00' },
        { usuarioId: 'b', nome: 'Bruno', urlAvatar: null, despesas: [], total: '100.00' },
    ]

    it('modo PRETENSAO mantém total declarado', () => {
        const colunas = mergeTripMemberColumns(membros, viagemMembros)
        const saldos = calcularSaldosViagem(colunas, '400.00', 'PRETENSAO')

        expect(saldos[0].saldo).toBe(300)
        expect(saldos[0].labelSaldo).toBe('deve')
    })

    it('modo IGUAL calcula crédito e débito', () => {
        const colunas = mergeTripMemberColumns(membros, viagemMembros)
        const saldos = calcularSaldosViagem(colunas, '400.00', 'IGUAL')

        expect(saldos[0].tipoSaldo).toBe('credito')
        expect(saldos[1].tipoSaldo).toBe('deve')
    })

    it('formata data da viagem e horario do chat', () => {
        expect(formatGroupTripDate(null)).toBe('Data a definir')
        expect(formatGroupTripDate('data-invalida')).toBe('Data a definir')
        expect(formatGroupTripDate('2026-10-23')).toMatch(/23 de outubro de 2026/)

        expect(formatGroupChatTimestamp(null)).toBe('')
        expect(formatGroupChatTimestamp('nao-data')).toBe('')
        expect(formatGroupChatTimestamp(new Date())).toMatch(/^Hoje, /)
        const ontem = new Date()
        ontem.setDate(ontem.getDate() - 1)
        expect(formatGroupChatTimestamp(ontem)).toMatch(/^Ontem, /)
        expect(formatGroupChatTimestamp('2026-01-15T14:30:00')).toMatch(/15 jan/)
    })

    it('rotula categoria, mescla chat e aportes', () => {
        expect(getExpenseCategoryLabel('TRANSPORTE')).toBe('Transporte')
        expect(getExpenseCategoryLabel('DESCONHECIDA')).toBe('DESCONHECIDA')

        const mensagens = mesclarMensagensChat(
            [
                { id: '1', criadoEm: '2026-01-01T10:00:00Z', texto: 'antiga' },
                { id: '2', criadoEm: '2026-01-02T10:00:00Z', texto: 'meio' },
            ],
            [
                { id: '2', criadoEm: '2026-01-02T10:00:00Z', texto: 'meio atualizado' },
                { id: '3', criadoEm: '2026-01-03T10:00:00Z', texto: 'nova' },
            ]
        )
        expect(mensagens.map((item) => item.id)).toEqual(['1', '2', '3'])
        expect(mensagens[1].texto).toBe('meio atualizado')

        expect(mergeMetaAportes(null, membros)).toEqual([])
        const aportes = mergeMetaAportes(
            { aportesPorMembro: [{ usuarioId: 'a', total: '20.00' }] },
            membros
        )
        expect(aportes[0]).toMatchObject({ usuarioId: 'a', total: '20.00', completo: true })
        expect(aportes[1]).toMatchObject({ usuarioId: 'b', total: '0.00', completo: false })
    })
})
