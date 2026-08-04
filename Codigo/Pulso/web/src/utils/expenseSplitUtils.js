import { roundMoney } from './debtBalanceUtils.js'

export function splitEqual(valorTotal, n) {
  if (n <= 0) return []

  const totalCentavos = Math.round(Number(valorTotal) * 100)
  const baseCentavos = Math.floor(totalCentavos / n)
  const resto = totalCentavos - baseCentavos * n

  return Array.from({ length: n }, (_, index) => {
    const centavos = index < resto ? baseCentavos + 1 : baseCentavos
    return roundMoney(centavos / 100)
  })
}

export function validarSomaPersonalizada(valorTotal, valores) {
  const somaCentavos = valores.reduce((acc, valor) => acc + Math.round(Number(valor) * 100), 0)
  const totalCentavos = Math.round(Number(valorTotal) * 100)
  return somaCentavos === totalCentavos
}

/** Quem pagou a conta não aparece na própria lista de participantes do card (não deve a si mesmo). */
export function getParticipantesVisiveis(divisao) {
  return (divisao?.participantes ?? []).filter((participante) => !participante.pagouAConta)
}

export function getPagador(divisao) {
  return divisao?.pagador ?? (divisao?.participantes ?? []).find((p) => p.pagouAConta) ?? null
}
