import { Link, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { DEFAULT_AUTHENTICATED_ROUTE } from '@/config/defaultAuthenticatedRoute.js'

/** Impede deep link FREE em rotas Premium (a página inteira não deve quebrar). */
export function PremiumRoute() {
  const plano = useAppSelector((state) => state.auth.user?.plano ?? 'FREE')

  if (plano !== 'PREMIUM') {
    return (
      <main className="mx-auto max-w-lg px-6 py-12 text-center">
        <h1 className="text-xl font-semibold">Recurso Premium</h1>
        <p className="mt-3 text-sm text-[var(--ds-color-text-secondary)]">
          Viagens e cotações avançadas ficam no plano Premium. O upgrade ainda não está
          disponível neste recorte (sem billing).
        </p>
        <p className="mt-6">
          <Link className="text-[var(--ds-color-accent)] underline" to={DEFAULT_AUTHENTICATED_ROUTE}>
            Ir para transações
          </Link>
        </p>
      </main>
    )
  }

  return <Outlet />
}
