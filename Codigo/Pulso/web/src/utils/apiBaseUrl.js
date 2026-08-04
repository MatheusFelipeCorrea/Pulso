/**
 * URL base da API.
 * Produção e dev: /api na mesma origem (Vite proxy em dev, rewrite na Vercel).
 * Override opcional via VITE_API_URL (ex.: testes ou API remota).
 */
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '')
  }

  return '/api'
}
