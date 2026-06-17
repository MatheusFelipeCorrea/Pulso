import api from './api.js'

export async function listarGrupos(options = {}) {
  const { data } = await api.get('/grupos', options)
  return data
}

export async function buscarGrupo(id, options = {}) {
  const { data } = await api.get(`/grupos/${id}`, options)
  return data
}

export async function criarGrupo(payload) {
  const { data } = await api.post('/grupos', payload)
  return data
}

export async function editarGrupo(id, payload) {
  const { data } = await api.patch(`/grupos/${id}`, payload)
  return data
}

export async function excluirGrupo(id) {
  await api.delete(`/grupos/${id}`)
}

export async function sairDoGrupo(id) {
  await api.post(`/grupos/${id}/sair`)
}

export async function criarViagemGrupo(id, payload) {
  const { data } = await api.post(`/grupos/${id}/viagem`, payload)
  return data
}

export async function obterMediaPassagemViagemGrupo(grupoId, { origem, ...options } = {}) {
  const { data } = await api.get(`/grupos/${grupoId}/viagem/media-passagem`, {
    ...options,
    params: origem ? { origem } : undefined,
  })
  return data
}

export async function criarDespesaViagemGrupo(grupoId, payload) {
  const { data } = await api.post(`/grupos/${grupoId}/viagem/despesas`, payload)
  return data
}

export async function editarDespesaViagemGrupo(grupoId, despesaId, payload) {
  const { data } = await api.patch(`/grupos/${grupoId}/viagem/despesas/${despesaId}`, payload)
  return data
}

export async function excluirDespesaViagemGrupo(grupoId, despesaId) {
  const { data } = await api.delete(`/grupos/${grupoId}/viagem/despesas/${despesaId}`)
  return data
}

export async function criarMetasGrupo(id, metas) {
  const { data } = await api.post(`/grupos/${id}/metas`, { metas })
  return data
}

export async function registrarAporteGrupo(id, metaId, payload) {
  const { data } = await api.post(`/grupos/${id}/metas/${metaId}/aportes`, payload)
  return data
}

export async function enviarMensagemGrupo(id, payload) {
  const { data } = await api.post(`/grupos/${id}/mensagens`, payload)
  return data
}

export async function listarMensagensGrupo(id, { pagina = 1, limite = 20 } = {}, options = {}) {
  const { data } = await api.get(`/grupos/${id}/mensagens`, {
    ...options,
    params: { pagina, limite },
  })
  return data
}

export async function previewGrupoPorCodigo(codigo, options = {}) {
  const { data } = await api.get('/grupos/preview', {
    ...options,
    params: { codigo },
  })
  return data
}

export async function entrarNoGrupo(codigoConvite) {
  const { data } = await api.post('/grupos/entrar', { codigoConvite })
  return data
}

export async function removerMembroGrupo(grupoId, usuarioId) {
  await api.delete(`/grupos/${grupoId}/membros/${usuarioId}`)
}

export async function alterarPapelMembroGrupo(grupoId, usuarioId, papel) {
  const { data } = await api.patch(`/grupos/${grupoId}/membros/${usuarioId}`, { papel })
  return data
}

export async function renovarCodigoConviteGrupo(id) {
  const { data } = await api.post(`/grupos/${id}/codigo/renovar`)
  return data
}

export async function editarViagemGrupo(id, payload) {
  const { data } = await api.patch(`/grupos/${id}/viagem`, payload)
  return data
}

export async function desvincularViagemGrupo(id) {
  const { data } = await api.delete(`/grupos/${id}/viagem`)
  return data
}
