import { Link2, Target, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

export function TripDetailGoalCard({ meta, onLinkGoal }) {
  const navigate = useNavigate()

  if (!meta) {
    return (
      <section className="trip-detail-page__card trip-detail-page__goal">
        <div className="trip-detail-page__goal-head trip-detail-page__goal-head--placeholder">
          <div className="trip-detail-page__goal-title">
            <Target size={18} aria-hidden className="trip-detail-page__goal-icon" />
            <div>
              <span>Meta vinculada</span>
            </div>
          </div>
        </div>

        <EmptyState
          className="trip-detail-page__goal-empty"
          size="compact"
          icon={<Target size={22} strokeWidth={1.75} />}
          title="Nenhuma meta vinculada"
          description="Vincule uma meta financeira para acompanhar o progresso desta viagem."
          action={{
            label: 'Vincular meta',
            onClick: onLinkGoal,
            leftIcon: <Link2 size={14} aria-hidden />,
          }}
        />
      </section>
    )
  }

  const valorAtual = Number(meta.valorAtual)
  const valorAlvo = Number(meta.valorAlvo)
  const percentual = Math.round(Number(meta.percentual))
  const faltante = Math.max(0, valorAlvo - valorAtual)

  return (
    <section className="trip-detail-page__card trip-detail-page__goal trip-detail-page__goal--linked">
      <div className="trip-detail-page__goal-head">
        <div className="trip-detail-page__goal-title">
          <Target size={18} aria-hidden className="trip-detail-page__goal-icon" />
          <div>
            <span>Meta vinculada</span>
            <strong>{meta.nome}</strong>
          </div>
        </div>
        <Button variant="secondary" size="sm" className="trip-detail-page__goal-btn" onClick={() => navigate('/goals')}>
          Gerenciar meta
        </Button>
      </div>

      <p className="trip-detail-page__goal-progress-text">
        {formatCurrency(valorAtual)} de {formatCurrency(valorAlvo)} ({percentual}%)
      </p>

      <ProgressBar
        value={valorAtual}
        max={valorAlvo}
        variant="primary"
        size="lg"
      />

      {faltante > 0 ? (
        <p className="trip-detail-page__goal-tip">
          <Lightbulb size={14} aria-hidden />
          Faltam {formatCurrency(faltante)} para atingir sua meta
        </p>
      ) : null}
    </section>
  )
}
