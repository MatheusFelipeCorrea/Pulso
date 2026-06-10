import api from './api.js'

const buildParams = (filtros = {}) => {
  const params = new URLSearchParams()

  if (filtros.periodo) params.set('periodo', filtros.periodo)
  if (filtros.categoria) {
    if (typeof filtros.categoria === 'string' && filtros.categoria.startsWith('nome:')) {
      params.set('categoriaNome', filtros.categoria.slice(5))
    } else {
      params.set('categoria', filtros.categoria)
    }
  }
  if (filtros.tipo && filtros.tipo !== 'TODOS') params.set('tipo', filtros.tipo)
  if (filtros.recurso && filtros.recurso !== 'TODOS') params.set('recurso', filtros.recurso)
  if (filtros.busca) params.set('busca', filtros.busca)
  if (filtros.pagina) params.set('pagina', String(filtros.pagina))
  if (filtros.limite) params.set('limite', String(filtros.limite))

  return params
}

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function buscarTransacoes(filtros = {}, options = {}) {
  const params = buildParams(filtros)
  const { data, headers } = await api.get(`/transacoes?${params.toString()}`, axiosConfig(options))

  return {
    transacoes: data,
    total: Number(headers['x-total-count'] ?? data.length),
    paginas: Number(headers['x-total-pages'] ?? 1),
    pagina: Number(headers['x-current-page'] ?? filtros.pagina ?? 1),
  }
}

export async function obterResumo(filtros = {}, options = {}) {
  const params = buildParams(filtros)
  const { data } = await api.get(`/transacoes/resumo?${params.toString()}`, axiosConfig(options))
  return data
}

/** Metadados de filtros e formulário (categorias, tags, tipos, recursos do usuário) */
export async function obterOpcoesFiltro(options = {}) {
  const { data } = await api.get('/transacoes/filtros', axiosConfig(options))
  return data
}

export async function criarTransacao(payload) {
  const { data } = await api.post('/transacoes', payload)
  return data
}

export async function atualizarTransacao(id, payload) {
  const { data } = await api.patch(`/transacoes/${id}`, payload)
  return data
}

export async function excluirTransacao(id, excluirFuturas = false) {
  await api.delete(`/transacoes/${id}`, {
    params: { excluirFuturas: excluirFuturas ? 'true' : 'false' },
  })
}
