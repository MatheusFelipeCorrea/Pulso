import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { useLocalStorage } from '@/design-system/hooks/useLocalStorage.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  formatBudgetAlertStatus,
  formatPercentualCategoria,
  resolveBudgetAmounts,
} from '@/utils/budgetUtils.js'

const DISMISS_STORAGE_KEY = 'pulso:dashboard:budget-alerts-dismissed'

function BudgetAlertCard({ alerta }) {
  const { gasto, limite } = resolveBudgetAmounts(alerta)
  const percentual = Number(alerta.percentualUsado) || 0
  const estourado = alerta.status === 'estourado' || percentual >= 100
  const barWidth = Math.min(100, Math.max(0, percentual))
  const icon = resolveBadgeIcon(alerta.categoriaIcone ?? 'CircleDollarSign', { size: 18 })
  const cor = alerta.categoriaCor ?? '#7c3aed'

  const statusLabel = formatBudgetAlertStatus({ gasto, limite, percentual, estourado })

  return (
    <Link
      to="/budget"
      className={`dashboard-budget-alert-card${estourado ? ' is-over' : ' is-warn'}`}
      style={{ '--cat-color': cor }}
      role="listitem"
      aria-label={`${alerta.categoriaNome}: ${statusLabel}`}
    >
      <div className="dashboard-budget-alert-card__header">
        <span className="dashboard-budget-alert-card__icon" aria-hidden>
          {icon}
        </span>
        <span className="dashboard-budget-alert-card__name">{alerta.categoriaNome}</span>
      </div>

      <div className="dashboard-budget-alert-card__values">
        <span className="dashboard-budget-alert-card__spent">{formatCurrency(gasto)}</span>
        <span className="dashboard-budget-alert-card__limit">de {formatCurrency(limite)}</span>
      </div>

      <div
        className="dashboard-budget-alert-card__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={barWidth}
        aria-label={`${formatPercentualCategoria(percentual)} do limite`}
      >
        <div className="dashboard-budget-alert-card__progress-fill" style={{ width: `${barWidth}%` }} />
      </div>

      <span className="dashboard-budget-alert-card__status">{statusLabel}</span>
    </Link>
  )
}

export function DashboardBudgetAlerts({ alertas = [], periodo }) {
  const [dismissedByPeriodo, setDismissedByPeriodo] = useLocalStorage(DISMISS_STORAGE_KEY, {})
  const isDismissed = periodo ? Boolean(dismissedByPeriodo[periodo]) : false

  const trackRef = useRef(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScroll = track.scrollWidth - track.clientWidth
    const scrollable = maxScroll > 4
    setIsScrollable(scrollable)
    setCanScrollBack(track.scrollLeft > 4)
    setCanScrollForward(track.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    updateScrollState()

    const track = trackRef.current
    if (!track) return undefined

    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollState) : null
    observer?.observe(track)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
      observer?.disconnect()
    }
  }, [alertas.length, updateScrollState])

  const dismiss = () => {
    if (!periodo) return
    setDismissedByPeriodo((prev) => ({ ...prev, [periodo]: true }))
  }

  if (!alertas.length || isDismissed) return null

  const estourados = alertas.filter((a) => a.status === 'estourado' || (a.percentualUsado ?? 0) >= 100).length
  const subtitle =
    estourados > 0
      ? `${estourados} ${estourados === 1 ? 'categoria estourou' : 'categorias estouraram'} o limite este mês`
      : `${alertas.length} ${alertas.length === 1 ? 'categoria está' : 'categorias estão'} chegando no limite`

  return (
    <section className="dashboard-budget-alerts" aria-label="Alertas de orçamento">
      <div className="dashboard-budget-alerts__top">
        <div className="dashboard-budget-alerts__intro">
          <span className="dashboard-budget-alerts__intro-icon" aria-hidden>
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 className="dashboard-budget-alerts__title">Orçamento do mês</h2>
            <p className="dashboard-budget-alerts__subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="dashboard-budget-alerts__actions">
          <Link to="/budget" className="dashboard-card__link">
            Ver orçamento
          </Link>
          <IconButton
            variant="ghost"
            size="sm"
            icon={<X size={16} strokeWidth={2} />}
            ariaLabel="Fechar alertas de orçamento"
            className="dashboard-budget-alerts__close"
            onClick={dismiss}
          />
        </div>
      </div>

      <div
        className="dashboard-budget-alerts__scroll-wrap"
        data-scrollable={isScrollable ? 'true' : 'false'}
        data-fade-start={canScrollBack ? 'true' : 'false'}
        data-fade-end={canScrollForward ? 'true' : 'false'}
      >
        <div
          ref={trackRef}
          className="dashboard-budget-alerts__track"
          role="list"
          tabIndex={isScrollable ? 0 : undefined}
          aria-label={`${alertas.length} categorias com alerta. Arraste horizontalmente para ver mais.`}
        >
          {alertas.map((alerta) => (
            <BudgetAlertCard key={alerta.categoriaId} alerta={alerta} />
          ))}
        </div>
      </div>
    </section>
  )
}
