import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function listarNotificacoes({ lida, limite = 10, pagina = 1 } = {}, options = {}) {
  const params = new URLSearchParams()
  if (lida === true || lida === false) params.set('lida', String(lida))
  if (limite) params.set('limite', String(limite))
  if (pagina) params.set('pagina', String(pagina))

  const { data } = await api.get(`/notificacoes?${params.toString()}`, axiosConfig(options))
  return data
}

export async function contarNaoLidas(options = {}) {
  const { data } = await api.get('/notificacoes/contador', axiosConfig(options))
  return data
}

export async function marcarComoLida(id, options = {}) {
  const { data } = await api.patch(`/notificacoes/${id}/marcar-lida`, {}, axiosConfig(options))
  return data
}

export async function marcarTodasLidas(options = {}) {
  const { data } = await api.patch('/notificacoes/marcar-todas-lidas', {}, axiosConfig(options))
  return data
}
