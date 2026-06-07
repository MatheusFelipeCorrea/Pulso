import { Ban } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'

export function VtDisabledScreen({ onEnable, loading = false }) {
  return (
    <div className="vt-blocked">
      <div className="vt-blocked__icon" aria-hidden>
        <Ban size={40} strokeWidth={1.5} />
      </div>
      <h2 className="vt-blocked__title">Vale Transporte desabilitado</h2>
      <p className="vt-blocked__message">
        Você informou que não recebe vale transporte. Se isso mudou, habilite novamente para
        acompanhar saldo, usos e vendas.
      </p>
      <Button
        type="button"
        variant="primary"
        size="md"
        disabled={loading}
        loading={loading}
        onClick={() => onEnable?.()}
        className="vt-opt-in__cta"
      >
        Habilitar Vale Transporte
      </Button>
    </div>
  )
}
