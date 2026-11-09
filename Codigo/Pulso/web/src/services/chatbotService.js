import api from './api.js'

const axiosConfig = (options = {}) => ({
    signal: options.signal,
})

export async function listarSugestoes(options = {}) {
    const { data } = await api.get('/chatbot/sugestoes', axiosConfig(options))
    return data
}

export async function listarConversas(options = {}) {
    const { data } = await api.get('/chatbot/conversas', axiosConfig(options))
    return data
}

export async function criarConversa(payload = {}, options = {}) {
    const { data } = await api.post('/chatbot/conversas', payload, axiosConfig(options))
    return data
}

export async function obterConversa(id, options = {}) {
    const { data } = await api.get(`/chatbot/conversas/${id}`, axiosConfig(options))
    return data
}

export async function excluirConversa(id, options = {}) {
    const { data } = await api.delete(`/chatbot/conversas/${id}`, axiosConfig(options))
    return data
}

export async function enviarMensagem(
    { mensagem, historico = [], modo = 'chat', conversaId = null },
    options = {}
) {
    const { data } = await api.post(
        '/chatbot/mensagem',
        { mensagem, historico, modo, conversaId },
        axiosConfig(options)
    )
    return data
}

export async function confirmarTransacao(proposta, options = {}) {
    const { data } = await api.post('/chatbot/confirmar-transacao', proposta, axiosConfig(options))
    return data
}
