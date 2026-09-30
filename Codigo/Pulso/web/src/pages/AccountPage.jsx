import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { getUserDisplayName } from '@/utils/userDisplayName'

export default function AccountPage({ title, subtitle }) {
  const user = useAppSelector((state) => state.auth.user)
  const nome = getUserDisplayName(user?.nome)
  const plano = user?.plano ?? 'FREE'

  return (
    <main className="mx-auto max-w-xl px-6 py-8">
      <h1 className="text-2xl font-semibold text-[var(--ds-color-text-primary)]">{title}</h1>
      <p className="mt-2 text-sm text-[var(--ds-color-text-secondary)]">{subtitle}</p>

      <dl className="mt-8 space-y-4 rounded-xl border border-[var(--ds-color-border)] p-5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--ds-color-text-tertiary)]">Nome</dt>
          <dd className="mt-1 text-[var(--ds-color-text-primary)]">{nome}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--ds-color-text-tertiary)]">E-mail</dt>
          <dd className="mt-1 text-[var(--ds-color-text-primary)]">{user?.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--ds-color-text-tertiary)]">Plano</dt>
          <dd className="mt-1 text-[var(--ds-color-text-primary)]">{plano}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-[var(--ds-color-text-secondary)]">
        Tema claro/escuro fica no menu do avatar, no canto superior.
      </p>
      <p className="mt-4">
        <Link className="text-[var(--ds-color-accent)] underline" to="/transactions">
          Voltar às transações
        </Link>
      </p>
    </main>
  )
}
