import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor: anexa token JWT em toda requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor: trata erros globais
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Se 401 (não autenticado), tenta refresh ou faz logout
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api