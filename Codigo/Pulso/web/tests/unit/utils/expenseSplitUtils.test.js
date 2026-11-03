import { describe, expect, it } from 'vitest'
import {
    splitEqual,
    validarSomaPersonalizada,
    getParticipantesVisiveis,
    getPagador,
    resolveExpenseSplitVisual,
    expenseSplitIconStyle,
    EXPENSE_SPLIT_DEFAULT_COLOR,
    EXPENSE_SPLIT_DEFAULT_ICON,
} from '@/utils/expenseSplitUtils.js'

describe('expenseSplitUtils', () => {
    describe('splitEqual', () => {
        it('divide um valor exato igualmente', () => {
            expect(splitEqual(10, 2)).toEqual([5, 5])
        })

        it('distribui o resto de forma determinística', () => {
            expect(splitEqual(100, 3)).toEqual([33.34, 33.33, 33.33])
        })
    })

    describe('validarSomaPersonalizada', () => {
        it('aceita quando a soma bate com o total', () => {
            expect(validarSomaPersonalizada(100, [33.34, 33.33, 33.33])).toBe(true)
        })

        it('rejeita quando a soma não bate', () => {
            expect(validarSomaPersonalizada(100, [50, 40])).toBe(false)
        })
    })

    describe('getParticipantesVisiveis', () => {
        it('remove quem pagou a conta da lista visível', () => {
            const divisao = {
                participantes: [
                    { id: 'p1', nome: 'João', pagouAConta: false },
                    { id: 'p2', nome: 'Você', pagouAConta: true },
                ],
            }
            expect(getParticipantesVisiveis(divisao)).toEqual([
                { id: 'p1', nome: 'João', pagouAConta: false },
            ])
        })
    })

    describe('getPagador', () => {
        it('usa divisao.pagador quando disponível', () => {
            const divisao = { pagador: { id: 'p2', nome: 'Você' } }
            expect(getPagador(divisao)).toEqual({ id: 'p2', nome: 'Você' })
        })

        it('deriva o pagador a partir dos participantes quando pagador não vem pronto', () => {
            const divisao = {
                participantes: [
                    { id: 'p1', nome: 'João', pagouAConta: false },
                    { id: 'p2', nome: 'Você', pagouAConta: true },
                ],
            }
            expect(getPagador(divisao)).toEqual({ id: 'p2', nome: 'Você', pagouAConta: true })
        })
    })

    describe('resolveExpenseSplitVisual', () => {
        it('usa fallback de ícone e cor quando a divisão não tem categoria', () => {
            expect(resolveExpenseSplitVisual({})).toEqual({
                icone: EXPENSE_SPLIT_DEFAULT_ICON,
                cor: EXPENSE_SPLIT_DEFAULT_COLOR,
            })
        })

        it('preserva ícone e cor salvos na divisão', () => {
            expect(resolveExpenseSplitVisual({ icone: 'UtensilsCrossed', cor: '#EF4444' })).toEqual(
                {
                    icone: 'UtensilsCrossed',
                    cor: '#EF4444',
                }
            )
        })
    })

    describe('expenseSplitIconStyle', () => {
        it('sempre devolve cor e fundo, mesmo sem hex salvo', () => {
            const style = expenseSplitIconStyle(null)
            expect(style.color).toBe(EXPENSE_SPLIT_DEFAULT_COLOR)
            expect(style.background).toContain(EXPENSE_SPLIT_DEFAULT_COLOR)
        })
    })
})
