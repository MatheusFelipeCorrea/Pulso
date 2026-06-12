import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

const buildParams = (filtros = {}) => {
  const params = new URLSearchParams()

  if (filtros.direcao && filtros.direcao !== 'TODOS') params.set('direcao', filtros.direcao)
  if (filtros.quitada === true || filtros.quitada === false) {
    params.set('quitada', String(filtros.quitada))
  }
  if (filtros.busca) params.set('busca', filtros.busca)
  if (filtros.ordenarValor) params.set('ordenarValor', filtros.ordenarValor)
  if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio)
  if (filtros.dataFim) params.set('dataFim', filtros.dataFim)
  if (filtros.pagina) params.set('pagina', String(filtros.pagina))
  if (filtros.limite) params.set('limite', String(filtros.limite))

  return params
}

export async function buscarDividas(filtros = {}, options = {}) {
  const params = buildParams(filtros)
  const { data, headers } = await api.get(`/dividas?${params.toString()}`, axiosConfig(options))

  return {
    dividas: data,
    total: Number(headers['x-total-count'] ?? data.length),
    paginas: Number(headers['x-total-pages'] ?? 1),
    pagina: Number(headers['x-current-page'] ?? filtros.pagina ?? 1),
  }
}

export async function obterResumo(options = {}) {
  const { data } = await api.get('/dividas/resumo', axiosConfig(options))
  return data
}

export async function criarDivida(payload, options = {}) {
  const { data } = await api.post('/dividas', payload, axiosConfig(options))
  return data
}

export async function atualizarDivida(id, payload, options = {}) {
  const { data } = await api.patch(`/dividas/${id}`, payload, axiosConfig(options))
  return data
}

export async function quitarDivida(id, options = {}) {
  const { data } = await api.patch(`/dividas/${id}/quitar`, {}, axiosConfig(options))
  return data
}

export async function excluirDivida(id, options = {}) {
  await api.delete(`/dividas/${id}`, axiosConfig(options))
}
