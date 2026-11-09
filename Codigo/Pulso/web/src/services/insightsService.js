import api from './api.js'

const axiosConfig = (options = {}) => ({
    signal: options.signal,
})

export async function obterInsights({ mes } = {}, options = {}) {
    const { data } = await api.get('/insights', {
        ...axiosConfig(options),
        params: mes ? { mes } : undefined,
    })
    return data
}

export async function regenerarInsights({ mes } = {}, options = {}) {
    const { data } = await api.post(
        '/insights/regenerar',
        mes ? { mes } : {},
        axiosConfig(options)
    )
    return data
}

export async function obterScore(options = {}) {
    const { data } = await api.get('/insights/score', axiosConfig(options))
    return data
}
