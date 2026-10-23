import { formatDateParam } from './dateRangeFilterUtils.js'

export const DEBT_TABS = {
  ME_DEVEM: 'ME_DEVEM',
  EU_DEVO: 'EU_DEVO',
  QUITADAS: 'QUITADAS',
}

export const DEBT_STATUS_FILTERS = {
  TODAS: '',
  VENCIDA: 'vencida',
  VENCE_BREVE: 'vence_breve',
}

export const DEFAULT_DEBT_FILTROS = () => ({
  busca: '',
  ordenarValor: '',
  status: '',
  dataInicio: null,
  dataFim: null,
  prazoInicio: null,
  prazoFim: null,
  pagina: 1,
  limite: 10,
})

export function filtrosDividaIguais(a, b) {
  return (
    a.busca === b.busca &&
    a.ordenarValor === b.ordenarValor &&
    a.status === b.status &&
    a.dataInicio === b.dataInicio &&
    a.dataFim === b.dataFim &&
    a.prazoInicio === b.prazoInicio &&
    a.prazoFim === b.prazoFim
  )
}

export function filtrosDividaSaoPadrao(filtros) {
  return filtrosDividaIguais(filtros, DEFAULT_DEBT_FILTROS())
}

export function buildApiFiltros(tabAtiva, filtrosAplicados) {
  const base = {
    ...filtrosAplicados,
    dataInicio: filtrosAplicados.dataInicio
      ? formatDateParam(filtrosAplicados.dataInicio)
      : undefined,
    dataFim: filtrosAplicados.dataFim ? formatDateParam(filtrosAplicados.dataFim) : undefined,
    prazoInicio: filtrosAplicados.prazoInicio
      ? formatDateParam(filtrosAplicados.prazoInicio)
      : undefined,
    prazoFim: filtrosAplicados.prazoFim ? formatDateParam(filtrosAplicados.prazoFim) : undefined,
    status: filtrosAplicados.status || undefined,
  }

  if (tabAtiva === DEBT_TABS.QUITADAS) {
    return { ...base, quitada: true, status: undefined }
  }

  return {
    ...base,
    quitada: false,
    direcao: tabAtiva,
  }
}
