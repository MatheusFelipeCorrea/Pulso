/**
 * URL base da API.
 * Produção (Vercel): /api na mesma origem.
 * Dev: localhost:3333 ou VITE_API_URL do .env.
 */
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '')
  }

  if (import.meta.env.PROD) {
    return '/api'
  }

  return 'http://localhost:3333/api'
}
