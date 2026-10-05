import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function obterStatusOrcamento(mes, options = {}) {
  const params = mes ? `?mes=${mes}` : ''
  const { data } = await api.get(`/orcamentos/status${params}`, axiosConfig(options))
  return data
}

export async function listarOrcamentos(mes, options = {}) {
  const params = mes ? `?mes=${mes}` : ''
  const { data } = await api.get(`/orcamentos${params}`, axiosConfig(options))
  return data
}

export async function salvarOrcamentos({ mesReferencia, limites }, options = {}) {
  const { data } = await api.post('/orcamentos', { mesReferencia, limites }, axiosConfig(options))
  return data
}

export async function copiarOrcamento({ mesOrigem, mesDestino }, options = {}) {
  const { data } = await api.post('/orcamentos/copiar', { mesOrigem, mesDestino }, axiosConfig(options))
  return data
}

export async function removerOrcamento(id, options = {}) {
  await api.delete(`/orcamentos/${id}`, axiosConfig(options))
}
