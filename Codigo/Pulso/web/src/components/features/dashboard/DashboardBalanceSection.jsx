import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { ResourceCard } from '@/components/features/dashboard/ResourceCard/ResourceCard.jsx'
import { RESOURCE_TYPES } from '@/components/features/dashboard/ResourceCard/resourceConfig.js'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

function VariacaoBadge({ variacao }) {
  if (!variacao || variacao.tipo === 'igual') return null

  const positive = variacao.valor > 0
  const Icon = positive ? TrendingUp : TrendingDown

  if (variacao.tipo === 'percentual') {
    return (
      <span className={`dashboard-balance__var dashboard-balance__var--${positive ? 'up' : 'down'}`}>
        <Icon size={14} aria-hidden />
        {Math.abs(variacao.valor)}% vs. mês anterior
      </span>
    )
  }

  return null
}

export function DashboardBalanceSection({ saldoTotal, recursos = [], loading }) {
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
    if (loading) return undefined

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
  }, [loading, recursos.length, updateScrollState])

  const scrollByPage = (direction) => {
    const track = trackRef.current
    if (!track) return

    const firstCard = track.querySelector('.pulso-resource-card')
    const gap = 0
    const step = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.75

    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="dashboard-balance dashboard-balance--loading">
        <SpinnerDots center label="Carregando saldos..." />
      </div>
    )
  }

  const total = Number(saldoTotal?.valor ?? 0)

  return (
    <section className="dashboard-balance" aria-label="Saldos por recurso">
      <article className="dashboard-balance__hero">
        <p className="dashboard-balance__hero-label">Saldo total disponível</p>
        <p className="dashboard-balance__hero-value" title={formatCurrency(total)}>
          {formatCurrency(total)}
        </p>
        <VariacaoBadge variacao={saldoTotal?.variacao} />
      </article>

      <div
        className="dashboard-balance__panel"
        data-scrollable={isScrollable ? 'true' : 'false'}
        data-fade-start={canScrollBack ? 'true' : 'false'}
        data-fade-end={canScrollForward ? 'true' : 'false'}
      >
        {isScrollable ? (
          <div className="dashboard-balance__nav">
            <IconButton
              variant="secondary"
              size="sm"
              ariaLabel="Ver recursos anteriores"
              icon={<ChevronLeft size={16} />}
              disabled={!canScrollBack}
              onClick={() => scrollByPage(-1)}
            />
            <IconButton
              variant="secondary"
              size="sm"
              ariaLabel="Ver próximos recursos"
              icon={<ChevronRight size={16} />}
              disabled={!canScrollForward}
              onClick={() => scrollByPage(1)}
            />
          </div>
        ) : null}

        <div
          ref={trackRef}
          className="dashboard-balance__track"
          role="list"
          tabIndex={isScrollable ? 0 : undefined}
          aria-label="Recursos financeiros"
        >
          {recursos.map((item) => {
            const subtitle =
              item.tipo === 'VR' && item.sugestaoDiaria
                ? `${formatCurrency(item.sugestaoDiaria)}/dia`
                : 'Disponível'

            return (
              <ResourceCard
                key={item.tipo}
                type={item.tipo}
                value={Number(item.saldo)}
                subtitle={subtitle}
                subtitleDot={item.tipo === 'VR' && item.sugestaoDiaria ? 'suggestion' : 'available'}
                className="pulso-resource-card--dashboard"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { RESOURCE_TYPES }
