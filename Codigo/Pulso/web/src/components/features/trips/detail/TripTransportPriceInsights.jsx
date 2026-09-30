import { Bus, Lightbulb, Plane, TrainFront, TrendingDown } from 'lucide-react'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

function formatSeasonChip(ajusteSazonal) {
  if (!ajusteSazonal?.periodo || ajusteSazonal.fator === 1) return null

  const pct = Math.round(Math.abs(ajusteSazonal.fator - 1) * 100)
  const signal = ajusteSazonal.tendencia === 'baixa' ? '−' : '+'
  return `${ajusteSazonal.periodo} (${signal}${pct}%)`
}

function formatSourceLabel(fonte) {
  if (fonte === 'duffel') return 'Cotação ao vivo'
  if (fonte === 'amadeus') return 'Mercado ao vivo'
  return 'Estimativa'
}

function SeasonChip({ ajusteSazonal }) {
  const label = formatSeasonChip(ajusteSazonal)
  if (!label) return null

  const isLow = ajusteSazonal.tendencia === 'baixa'
  const Icon = isLow ? TrendingDown : Lightbulb

  return (
    <p
      className={`trip-transport-insight__season trip-transport-insight__season--${isLow ? 'low' : 'high'}`}
    >
      <Icon size={14} aria-hidden />
      <span>{label}</span>
    </p>
  )
}

function TransportCard({
  variant,
  unavailable = false,
  icon: Icon,
  iconLabel,
  title,
  meta,
  sourceLabel,
  season,
  children,
}) {
  return (
    <article
      className={[
        'trip-transport-insight',
        `trip-transport-insight--${variant}`,
        unavailable ? 'trip-transport-insight--unavailable' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="trip-transport-insight__badge" aria-hidden>
        <Icon size={20} strokeWidth={2.1} />
      </div>

      <div className="trip-transport-insight__content">
        <div className="trip-transport-insight__header">
          <p className="trip-transport-insight__label">{title}</p>
          {sourceLabel ? (
            <span className="trip-transport-insight__source-tag">{sourceLabel}</span>
          ) : null}
        </div>

        <div className="trip-transport-insight__body">
          {children}
          {meta ? <p className="trip-transport-insight__meta">{meta}</p> : null}
        </div>

        <SeasonChip ajusteSazonal={season} />
      </div>

      <span className="sr-only">{iconLabel}</span>
    </article>
  )
}

function FlightCard({ data }) {
  if (!data?.disponivel) return null

  return (
    <TransportCard
      variant="flight"
      icon={Plane}
      iconLabel="Passagem aérea"
      title="Avião"
      meta={data.mensagem}
      sourceLabel={formatSourceLabel(data.fonte)}
      season={data.ajusteSazonal}
    >
      <p className="trip-transport-insight__value">{formatCurrency(data.valorMedioBrl)}</p>
    </TransportCard>
  )
}

function BusCard({ onibus }) {
  if (!onibus?.disponivel) return null

  return (
    <TransportCard
      variant="bus"
      icon={Bus}
      iconLabel="Passagem de ônibus"
      title="Ônibus"
      meta={onibus.mensagem}
      sourceLabel={formatSourceLabel(onibus.fonte)}
      season={onibus.ajusteSazonal}
    >
      <div className="trip-transport-insight__price-grid">
        <div className="trip-transport-insight__price-row">
          <span className="trip-transport-insight__price-tag">Rodoviária</span>
          <strong className="trip-transport-insight__value trip-transport-insight__value--sm">
            {formatCurrency(onibus.valorConvencionalBrl)}
          </strong>
        </div>

        {onibus.buserDisponivel ? (
          <div className="trip-transport-insight__price-row trip-transport-insight__price-row--buser">
            <span className="trip-transport-insight__buser-badge">Buser</span>
            <strong className="trip-transport-insight__value trip-transport-insight__value--buser">
              {formatCurrency(onibus.valorBuserBrl)}
            </strong>
          </div>
        ) : (
          <p className="trip-transport-insight__buser-note">Buser não opera nesta rota.</p>
        )}
      </div>
    </TransportCard>
  )
}

function TrainCard({ trem }) {
  if (!trem) return null

  if (!trem.disponivel) {
    return (
      <TransportCard
        variant="train"
        unavailable
        icon={TrainFront}
        iconLabel="Trem indisponível"
        title="Trem"
        meta={trem.mensagem}
      >
        <p className="trip-transport-insight__unavailable">Indisponível nesta rota</p>
      </TransportCard>
    )
  }

  return (
    <TransportCard
      variant="train"
      icon={TrainFront}
      iconLabel="Passagem de trem"
      title="Trem"
      meta={trem.mensagem}
      sourceLabel={formatSourceLabel(trem.fonte)}
      season={trem.ajusteSazonal}
    >
      <p className="trip-transport-insight__value">{formatCurrency(trem.valorMedioBrl)}</p>
    </TransportCard>
  )
}

export function TripTransportPriceInsights({ loading = false, data = null }) {
  if (loading) {
    return (
      <div className="trip-transport-insights">
        <div className="trip-transport-insight trip-transport-insight--loading">
          <SpinnerDots label="Consultando passagens..." />
        </div>
      </div>
    )
  }

  if (!data) return null

  const hasInsights =
    data.disponivel || data.onibus?.disponivel || Boolean(data.trem?.destino)

  if (!hasInsights) return null

  const hasLiveFlight = data.fonte === 'duffel' || data.fonte === 'amadeus'

  return (
    <div className="trip-transport-insights">
      <p className="trip-transport-insights__disclaimer">
        {hasLiveFlight
          ? 'Avião com cotação ao vivo quando disponível. Demais valores são estimativas para a data da viagem.'
          : 'Valores aproximados para planejamento, ajustados pela data da viagem. Não substituem sites de passagens.'}
      </p>
      <FlightCard data={data} />
      <BusCard onibus={data?.onibus} />
      <TrainCard trem={data?.trem} />
    </div>
  )
}

// Compatibilidade com import antigo
export const TripFlightPriceInsight = TripTransportPriceInsights
