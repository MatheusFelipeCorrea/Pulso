import axios from 'axios'
import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

const baseURL = getApiBaseUrl()

let refreshPromise = null

/**
 * Paths de UI públicos — não forçar redirect /login (evita loop com AuthBootstrap).
 * Inclui PULSO-FEAT-001: /register, /register/email-sent, /verify-email/:token
 */
const GUEST_PATH_PREFIXES = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
    '/verify-email',
    '/termos',
    '/privacidade',
    '/design-system',
]

const isGuestRoute = () => {
    if (typeof window === 'undefined') return false
    const { pathname } = window.location
    if (pathname === '/') return true
    return GUEST_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
}

const refreshSession = () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
            .finally(() => {
                refreshPromise = null
            })
    }
    return refreshPromise
}

const redirectToLogin = () => {
    if (isGuestRoute()) return
    window.location.href = '/login'
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const requestUrl = originalRequest?.url || ''
        const isRefreshRequest = requestUrl.includes('/auth/refresh')
        const isAuthRequest =
            requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/register') ||
            requestUrl.includes('/auth/verify-email') ||
            requestUrl.includes('/auth/resend-verification') ||
            requestUrl.includes('/auth/forgot-password') ||
            requestUrl.includes('/auth/reset-password') ||
            requestUrl.includes('/auth/oauth/exchange') ||
            isRefreshRequest

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            originalRequest._retry = true

            try {
                await refreshSession()
                return api(originalRequest)
            } catch (refreshError) {
                redirectToLogin()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
