import { calcSaldoDivida, roundMoney } from '@/utils/debtBalanceUtils.js'
import { describe, expect, it } from 'vitest'

describe('debtBalanceUtils', () => {
  it('arredonda valores monetários', () => {
    expect(roundMoney(10.555)).toBe(10.56)
  })

  it('calcula saldo restante com pagamentos parciais', () => {
    const divida = {
      valor: 100,
      quitada: false,
      pagamentos: [{ valor: 30 }, { valor: 20 }],
    }

    expect(calcSaldoDivida(divida)).toEqual({
      valorTotal: 100,
      valorPago: 50,
      valorRestante: 50,
    })
  })

  it('mantém saldo restante quando quitada com pagamentos parciais inconsistentes', () => {
    const divida = {
      valor: 100,
      quitada: true,
      pagamentos: [{ valor: 40 }],
    }

    expect(calcSaldoDivida(divida)).toEqual({
      valorTotal: 100,
      valorPago: 40,
      valorRestante: 60,
    })
  })

  it('zera saldo restante quando quitada sem pagamentos (quitação manual)', () => {
    const divida = {
      valor: 100,
      quitada: true,
      pagamentos: [],
    }

    expect(calcSaldoDivida(divida)).toEqual({
      valorTotal: 100,
      valorPago: 100,
      valorRestante: 0,
    })
  })
})
