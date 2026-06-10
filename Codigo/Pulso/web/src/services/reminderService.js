import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function listarLembretes({ mes } = {}, options = {}) {
  const params = new URLSearchParams()
  if (mes) params.set('mes', mes)
  const { data } = await api.get(`/lembretes?${params.toString()}`, axiosConfig(options))
  return data
}

export async function criarLembrete(body, options = {}) {
  const { data } = await api.post('/lembretes', body, axiosConfig(options))
  return data
}

export async function atualizarLembrete(id, body, options = {}) {
  const { data } = await api.patch(`/lembretes/${id}`, body, axiosConfig(options))
  return data
}

export async function excluirLembrete(id, options = {}) {
  await api.delete(`/lembretes/${id}`, axiosConfig(options))
}

export async function marcarComoPago(id, options = {}) {
  const { data } = await api.post(`/lembretes/${id}/pagar`, null, axiosConfig(options))
  return data
}
