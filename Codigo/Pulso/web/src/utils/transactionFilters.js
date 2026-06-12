import {
  datesIguais,
  defaultMesAtualDateRange,
  filtrosPeriodoSaoPadrao,
  formatDateParam,
  periodoFromDateRange,
} from './dateRangeFilterUtils.js'

export const DEFAULT_TRANSACTION_FILTROS = () => {
  const { start, end } = defaultMesAtualDateRange()
  return {
    dataInicio: start,
    dataFim: end,
    categoria: null,
    tipo: 'TODOS',
    recurso: 'TODOS',
    busca: '',
  }
}

export function filtrosTransacaoIguais(a, b) {
  return (
    datesIguais(a.dataInicio, b.dataInicio) &&
    datesIguais(a.dataFim, b.dataFim) &&
    a.categoria === b.categoria &&
    a.tipo === b.tipo &&
    a.recurso === b.recurso &&
    a.busca === b.busca
  )
}

export function filtrosTransacaoSaoPadrao(filtros) {
  return filtrosTransacaoIguais(filtros, DEFAULT_TRANSACTION_FILTROS())
}

export function periodoFromFiltros(filtros) {
  return periodoFromDateRange(filtros?.dataInicio)
}

export function buildTransactionApiFiltros(filtros = {}) {
  const { dataInicio, dataFim, ...rest } = filtros
  return {
    ...rest,
    dataInicio: formatDateParam(dataInicio) ?? undefined,
    dataFim: formatDateParam(dataFim) ?? undefined,
  }
}

export { filtrosPeriodoSaoPadrao }
