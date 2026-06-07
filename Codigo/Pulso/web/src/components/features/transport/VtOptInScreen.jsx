import { Bus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'

export function VtOptInScreen({ onConfirm, loading = false }) {
  return (
    <div className="vt-blocked">
      <div className="vt-blocked__icon" aria-hidden>
        <Bus size={40} strokeWidth={1.5} />
      </div>
      <h2 className="vt-blocked__title">Você recebe vale transporte?</h2>
      <p className="vt-blocked__message">
        Como PJ, você pode habilitar o controle de VT caso sua empresa ou contrato inclua esse
        benefício. Se não receber, escolha &quot;Não&quot; e esta opção sairá do menu.
      </p>
      <div className="vt-opt-in__actions">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={loading}
          loading={loading}
          onClick={() => onConfirm?.(true)}
        >
          Sim, recebo
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          disabled={loading}
          onClick={() => onConfirm?.(false)}
        >
          Não recebo
        </Button>
      </div>
    </div>
  )
}
