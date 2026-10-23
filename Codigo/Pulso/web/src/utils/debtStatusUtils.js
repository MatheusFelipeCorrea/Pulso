import { differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { formatPersonName } from './personName.js'
import { calcSaldoDivida } from './debtBalanceUtils.js'

export function getDebtStatusBadge(divida) {
  if (divida.quitada) {
    const data =
      divida.dataQuitacao != null
        ? format(parseISO(divida.dataQuitacao), 'dd/MM/yyyy', { locale: ptBR })
        : '—'
    return {
      label: `Quitada em ${data}`,
      variant: 'success',
      tone: 'green',
      icon: 'check',
    }
  }

  const { valorPago, valorRestante, valorTotal } = calcSaldoDivida(divida)
  const temPagamentoParcial = valorPago > 0 && valorRestante > 0

  if (!divida.prazoDevolucao) {
    if (temPagamentoParcial) {
      return {
        label: `Parcialmente pago · restam ${valorRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        variant: 'warning',
        tone: 'yellow',
        icon: 'hourglass',
      }
    }
    return {
      label: 'Sem prazo definido',
      variant: 'neutral',
      tone: 'gray',
      icon: null,
    }
  }

  const hoje = startOfDay(new Date())
  const prazo = startOfDay(parseISO(divida.prazoDevolucao))
  const dias = differenceInCalendarDays(prazo, hoje)

  let prazoLabel
  let variant = 'success'
  let tone = 'green'
  let icon = 'hourglass'

  if (dias < 0) {
    const atraso = Math.abs(dias)
    prazoLabel = `Vencida há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}`
    variant = 'error'
    tone = 'red'
    icon = 'dot'
  } else if (dias === 0) {
    prazoLabel = 'Vence hoje'
    variant = 'error'
    tone = 'red'
    icon = 'dot'
  } else if (dias <= 2) {
    prazoLabel = `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`
    variant = 'warning'
    tone = 'yellow'
  } else {
    prazoLabel = `Vence em ${dias} dias`
  }

  if (temPagamentoParcial) {
    return {
      label: `${prazoLabel} · pago ${((valorPago / valorTotal) * 100).toFixed(0)}%`,
      variant,
      tone,
      icon,
    }
  }

  return { label: prazoLabel, variant, tone, icon }
}

export function getDebtSummaryText(divida) {
  const nome = formatPersonName(divida?.nomePessoa) || 'Pessoa'
  const valor = Number(divida?.valor ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (divida?.direcao === 'EU_DEVO') {
    return { linha: `Você deve ${valor}`, sublinha: `para ${nome}` }
  }

  return { linha: `${nome} te deve`, sublinha: valor }
}
