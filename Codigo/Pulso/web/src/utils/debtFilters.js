import { formatDateParam } from './dateRangeFilterUtils.js'

export const DEBT_TABS = {
  ME_DEVEM: 'ME_DEVEM',
  EU_DEVO: 'EU_DEVO',
  QUITADAS: 'QUITADAS',
}

export const DEFAULT_DEBT_FILTROS = () => ({
  busca: '',
  ordenarValor: '',
  dataInicio: null,
  dataFim: null,
  pagina: 1,
  limite: 10,
})

export function filtrosDividaIguais(a, b) {
  return (
    a.busca === b.busca &&
    a.ordenarValor === b.ordenarValor &&
    a.dataInicio === b.dataInicio &&
    a.dataFim === b.dataFim
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
  }

  if (tabAtiva === DEBT_TABS.QUITADAS) {
    return { ...base, quitada: true }
  }

  return {
    ...base,
    quitada: false,
    direcao: tabAtiva,
  }
}
