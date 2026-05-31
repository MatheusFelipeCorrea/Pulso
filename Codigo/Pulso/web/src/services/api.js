import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const requestUrl = originalRequest?.url || ''
        const isRefreshRequest = requestUrl.includes('/auth/refresh')
        const isAuthRequest =
            requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/register') ||
            requestUrl.includes('/auth/forgot-password') ||
            requestUrl.includes('/auth/reset-password') ||
            isRefreshRequest

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthRequest
        ) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')

            if (!refreshToken) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post(`${baseURL}/auth/refresh`, {
                    refreshToken,
                })

                localStorage.setItem('accessToken', data.accessToken)
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
