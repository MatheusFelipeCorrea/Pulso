import { periodoAtual } from './transactionRecurrence.js'

export const DEFAULT_TRANSACTION_FILTROS = () => ({
  periodo: periodoAtual(),
  categoria: null,
  tipo: 'TODOS',
  recurso: 'TODOS',
  busca: '',
})

export function filtrosTransacaoIguais(a, b) {
  return (
    a.periodo === b.periodo &&
    a.categoria === b.categoria &&
    a.tipo === b.tipo &&
    a.recurso === b.recurso &&
    a.busca === b.busca
  )
}

export function filtrosTransacaoSaoPadrao(filtros) {
  return filtrosTransacaoIguais(filtros, DEFAULT_TRANSACTION_FILTROS())
}
