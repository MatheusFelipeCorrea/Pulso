import { describe, expect, it } from 'vitest'
import { calcularSaldosViagem, mergeTripMemberColumns } from '@/utils/groupDetailUtils.js'

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
})
