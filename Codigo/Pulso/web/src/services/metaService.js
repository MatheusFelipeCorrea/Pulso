import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

const buildParams = (filtros = {}) => {
  const params = new URLSearchParams()

  if (filtros.status) params.set('status', filtros.status)
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.busca) params.set('busca', filtros.busca)
  if (filtros.prazoInicio) params.set('prazoInicio', filtros.prazoInicio)
  if (filtros.prazoFim) params.set('prazoFim', filtros.prazoFim)
  if (filtros.pagina) params.set('pagina', String(filtros.pagina))
  if (filtros.limite) params.set('limite', String(filtros.limite))

  return params
}

export async function buscarMetas(filtros = {}, options = {}) {
  const params = buildParams(filtros)
  const { data, headers } = await api.get(`/metas?${params.toString()}`, axiosConfig(options))

  return {
    metas: Array.isArray(data) ? data : [],
    total: Number(headers['x-total-count'] ?? (Array.isArray(data) ? data.length : 0)),
    paginas: Number(headers['x-total-pages'] ?? 1),
    pagina: Number(headers['x-current-page'] ?? filtros.pagina ?? 1),
  }
}

export async function obterResumo(options = {}) {
  const { data } = await api.get('/metas/resumo', axiosConfig(options))
  return data
}

export async function criarMeta(payload, options = {}) {
  const { data } = await api.post('/metas', payload, axiosConfig(options))
  return data
}

export async function atualizarMeta(id, payload, options = {}) {
  const { data } = await api.patch(`/metas/${id}`, payload, axiosConfig(options))
  return data
}

export async function registrarAporte(id, payload, options = {}) {
  const { data } = await api.post(`/metas/${id}/aportes`, payload, axiosConfig(options))
  return data
}

export async function excluirAporte(id, aporteId, options = {}) {
  const { data } = await api.delete(`/metas/${id}/aportes/${aporteId}`, axiosConfig(options))
  return data
}

export async function excluirMeta(id, options = {}) {
  await api.delete(`/metas/${id}`, axiosConfig(options))
}

export async function pausarMeta(id, options = {}) {
  return atualizarMeta(id, { status: 'PAUSADA' }, options)
}

export async function retomarMeta(id, options = {}) {
  return atualizarMeta(id, { status: 'ATIVA' }, options)
}
