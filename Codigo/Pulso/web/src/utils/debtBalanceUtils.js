export function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100
}

function calcSaldoFromPagamentos(divida, pagamentos = divida?.pagamentos ?? []) {
  const valorTotal = roundMoney(divida?.valor ?? 0)
  const valorPago = roundMoney(pagamentos.reduce((acc, item) => acc + Number(item.valor), 0))
  const valorRestante = Math.max(0, roundMoney(valorTotal - valorPago))
  return { valorTotal, valorPago, valorRestante }
}

export function isDividaQuitada(divida) {
  const pagamentos = divida?.pagamentos ?? []
  const { valorRestante } = calcSaldoFromPagamentos(divida, pagamentos)
  if (valorRestante <= 0) return true
  return Boolean(divida?.quitada) && pagamentos.length === 0
}

export function calcSaldoDivida(divida) {
  const pagamentos = divida?.pagamentos ?? []

  if (isDividaQuitada(divida)) {
    const { valorTotal, valorPago } = calcSaldoFromPagamentos(divida, pagamentos)
    return {
      valorTotal,
      valorPago: valorPago > 0 ? valorPago : valorTotal,
      valorRestante: 0,
    }
  }

  return calcSaldoFromPagamentos(divida, pagamentos)
}
