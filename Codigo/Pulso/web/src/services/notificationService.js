import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

function mapNotificacao(item) {
  return {
    id: item.id,
    type: item.tipo,
    title: item.titulo,
    description: item.mensagem ?? '',
    timestamp: item.criadoEm,
    read: item.lida,
    linkAcao: item.linkAcao,
    metadata: item.metadados,
  }
}

export async function listarNotificacoes({ lida, limite = 20, pagina = 1 } = {}, options = {}) {
  const params = new URLSearchParams()
  if (lida === true || lida === false) params.set('lida', String(lida))
  if (limite) params.set('limite', String(limite))
  if (pagina) params.set('pagina', String(pagina))

  const response = await api.get(`/notificacoes?${params.toString()}`, axiosConfig(options))

  return {
    notificacoes: (response.data ?? []).map(mapNotificacao),
    total: Number(response.headers['x-total-count'] ?? response.data?.length ?? 0),
    paginas: Number(response.headers['x-total-pages'] ?? 1),
    pagina: Number(response.headers['x-current-page'] ?? pagina),
  }
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
