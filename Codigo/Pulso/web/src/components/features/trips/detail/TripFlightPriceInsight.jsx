import { Info, Plane } from 'lucide-react'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

function formatSourceLabel(fonte) {
  if (fonte === 'amadeus') return 'Dados de mercado (Amadeus)'
  return 'Estimativa regional'
}

export function TripFlightPriceInsight({ loading = false, data = null }) {
  if (loading) {
    return (
      <div className="trip-flight-insight trip-flight-insight--loading">
        <SpinnerDots label="Consultando passagens..." />
      </div>
    )
  }

  if (!data?.disponivel) return null

  return (
    <div className="trip-flight-insight">
      <div className="trip-flight-insight__icon" aria-hidden>
        <Info size={22} strokeWidth={2.25} />
      </div>
      <div className="trip-flight-insight__content">
        <p className="trip-flight-insight__label">
          <Plane size={14} aria-hidden />
          Passagem aérea média para {data.destino}
        </p>
        <p className="trip-flight-insight__value">{formatCurrency(data.valorMedioBrl)}</p>
        <p className="trip-flight-insight__meta">{data.mensagem}</p>
        <p className="trip-flight-insight__source">{formatSourceLabel(data.fonte)} · ida e volta</p>
      </div>
    </div>
  )
}
