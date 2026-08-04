import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function listarAtivas(options = {}) {
  const { data } = await api.get('/divisoes/ativas', axiosConfig(options))
  return data
}

export async function listarHistorico(params = {}, options = {}) {
  const query = new URLSearchParams()
  if (params.pagina) query.set('pagina', String(params.pagina))
  if (params.limite) query.set('limite', String(params.limite))

  const { data, headers } = await api.get(
    `/divisoes/historico?${query.toString()}`,
    axiosConfig(options)
  )

  return {
    divisoes: data,
    total: Number(headers['x-total-count'] ?? data.length),
    paginas: Number(headers['x-total-pages'] ?? 1),
    pagina: Number(headers['x-current-page'] ?? params.pagina ?? 1),
  }
}

export async function obterResumo(options = {}) {
  const { data } = await api.get('/divisoes/resumo', axiosConfig(options))
  return data
}

export async function criarDivisao(payload, options = {}) {
  const { data } = await api.post('/divisoes', payload, axiosConfig(options))
  return data
}

export async function atualizarDivisao(id, payload, options = {}) {
  const { data } = await api.patch(`/divisoes/${id}`, payload, axiosConfig(options))
  return data
}

export async function marcarParticipantePago(id, participanteId, options = {}) {
  const { data } = await api.patch(
    `/divisoes/${id}/participantes/${participanteId}/pagar`,
    {},
    axiosConfig(options)
  )
  return data
}

export async function desmarcarParticipantePago(id, participanteId, options = {}) {
  const { data } = await api.patch(
    `/divisoes/${id}/participantes/${participanteId}/despagar`,
    {},
    axiosConfig(options)
  )
  return data
}

export async function criarLembreteCobranca(id, payload = {}, options = {}) {
  const { data } = await api.post(`/divisoes/${id}/lembrete`, payload, axiosConfig(options))
  return data
}

export async function excluirDivisao(id, options = {}) {
  await api.delete(`/divisoes/${id}`, axiosConfig(options))
}
