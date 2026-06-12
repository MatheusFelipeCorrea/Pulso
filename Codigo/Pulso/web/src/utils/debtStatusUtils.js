import { differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
    }
  }

  if (!divida.prazoDevolucao) {
    return {
      label: 'Sem prazo definido',
      variant: 'neutral',
      tone: 'gray',
    }
  }

  const hoje = startOfDay(new Date())
  const prazo = startOfDay(parseISO(divida.prazoDevolucao))
  const dias = differenceInCalendarDays(prazo, hoje)
  const dataFmt = format(prazo, 'dd/MM/yyyy', { locale: ptBR })

  if (dias < 0) {
    const atraso = Math.abs(dias)
    return {
      label: `Vencida há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}`,
      variant: 'error',
      tone: 'red',
    }
  }

  if (dias === 0) {
    return {
      label: 'Vence hoje',
      variant: 'error',
      tone: 'red',
    }
  }

  if (dias === 2) {
    return {
      label: 'Vence em 2 dias',
      variant: 'warning',
      tone: 'yellow',
    }
  }

  if (dias <= 2) {
    return {
      label: `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
      variant: 'warning',
      tone: 'yellow',
    }
  }

  return {
    label: `Vence em ${dataFmt}`,
    variant: 'success',
    tone: 'green',
  }
}

export function getDebtSummaryText(divida) {
  const nome = divida?.nomePessoa?.trim() || 'Pessoa'
  const valor = Number(divida?.valor ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (divida?.direcao === 'EU_DEVO') {
    return { linha: `Você deve ${valor}`, sublinha: `para ${nome}` }
  }

  return { linha: `${nome} te deve`, sublinha: valor }
}
