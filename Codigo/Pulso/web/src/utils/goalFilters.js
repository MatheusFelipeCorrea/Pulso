import { formatDateParam } from './dateRangeFilterUtils.js'

export const GOAL_TABS = {
  TODAS: 'TODAS',
  ATIVAS: 'ATIVAS',
  PAUSADAS: 'PAUSADAS',
  CONCLUIDAS: 'CONCLUIDAS',
}

export const DEFAULT_GOAL_FILTROS = () => ({
  busca: '',
  prazoInicio: null,
  prazoFim: null,
  pagina: 1,
  limite: 10,
})

export function buildApiFiltros(tabAtiva, filtrosAplicados) {
  const base = {
    ...filtrosAplicados,
    prazoInicio: filtrosAplicados.prazoInicio
      ? formatDateParam(filtrosAplicados.prazoInicio)
      : undefined,
    prazoFim: filtrosAplicados.prazoFim ? formatDateParam(filtrosAplicados.prazoFim) : undefined,
  }

  if (tabAtiva === GOAL_TABS.ATIVAS) {
    return { ...base, status: 'ATIVA' }
  }
  if (tabAtiva === GOAL_TABS.PAUSADAS) {
    return { ...base, status: 'PAUSADA' }
  }
  if (tabAtiva === GOAL_TABS.CONCLUIDAS) {
    return { ...base, status: 'CONCLUIDA' }
  }

  return base
}
