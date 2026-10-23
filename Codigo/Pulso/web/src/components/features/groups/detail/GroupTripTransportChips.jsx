import { useEffect, useMemo, useState } from 'react'
import { Bus, Plane, TrainFront } from 'lucide-react'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import * as grupoService from '@/services/grupoService.js'
import { getSavedTripOriginId } from '@/utils/tripOriginStorage.js'

const TRANSPORT_MODES = [
  {
    key: 'flight',
    variant: 'flight',
    icon: Plane,
    label: 'Avião',
    getValue: (data) => (data?.disponivel ? data.valorMedioBrl : null),
    getTripBasis: () => 'ida e volta',
  },
  {
    key: 'bus',
    variant: 'bus',
    icon: Bus,
    label: 'Ônibus',
    getValue: (data) => {
      const onibus = data?.onibus
      if (!onibus?.disponivel) return null
      if (onibus.buserDisponivel && onibus.valorBuserBrl != null) {
        return onibus.valorBuserBrl
      }
      return onibus.valorConvencionalBrl ?? null
    },
    getTripBasis: (data) => (data?.onibus?.idaVolta ? 'ida e volta' : 'ida'),
  },
  {
    key: 'train',
    variant: 'train',
    icon: TrainFront,
    label: 'Trem',
    getValue: (data) => (data?.trem?.disponivel ? data.trem.valorMedioBrl : null),
    getTripBasis: (data) => (data?.trem?.idaVolta ? 'ida e volta' : 'ida'),
  },
]

function TransportChipTooltip({ label, formatted, tripBasis, hubReferencia, variant }) {
  return (
    <div className="group-detail-trip__transport-tooltip">
      <strong
        className={`group-detail-trip__transport-tooltip-mode group-detail-trip__transport-tooltip-mode--${variant}`}
      >
        {label} · {tripBasis}
      </strong>
      <span className="group-detail-trip__transport-tooltip-value">{formatted}</span>
      {hubReferencia ? (
        <span className="group-detail-trip__transport-tooltip-hub">
          Rota estimada até {hubReferencia.hub} (hub mais próximo de {hubReferencia.destino})
        </span>
      ) : null}
      <span className="group-detail-trip__transport-tooltip-note">Estimativa para planejamento</span>
    </div>
  )
}

export function GroupTripTransportChips({ grupoId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!grupoId) return undefined

    const controller = new AbortController()
    setLoading(true)

    grupoService
      .obterMediaPassagemViagemGrupo(grupoId, {
        origem: getSavedTripOriginId(),
        signal: controller.signal,
      })
      .then((result) => {
        if (!controller.signal.aborted) setData(result)
      })
      .catch(() => {
        if (!controller.signal.aborted) setData(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [grupoId])

  const chips = useMemo(() => {
    if (!data) return []

    const hubReferencia = data.hubReferencia ?? null

    return TRANSPORT_MODES.map((mode) => {
      const value = mode.getValue(data)
      if (value == null) return null

      const tripBasis = mode.getTripBasis?.(data) ?? 'ida e volta'

      return {
        ...mode,
        value,
        formatted: formatCurrency(value),
        tripBasis,
        hubReferencia,
      }
    }).filter(Boolean)
  }, [data])

  const hubReferencia = data?.hubReferencia ?? null

  if (loading || chips.length === 0) return null

  return (
    <span className="group-detail-trip__transport-wrap">
      <span className="group-detail-trip__transport-chips" aria-label="Estimativas de passagem">
        {chips.map(({ key, variant, icon: Icon, label, formatted, tripBasis, hubReferencia: hub }) => (
        <Tooltip
          key={key}
          position="top"
          delay={120}
          className={`group-detail-trip__transport-tooltip-shell group-detail-trip__transport-tooltip-shell--${variant}`}
          content={
            <TransportChipTooltip
              label={label}
              formatted={formatted}
              tripBasis={tripBasis}
              hubReferencia={hub}
              variant={variant}
            />
          }
        >
          <span
            className={`group-detail-trip__transport-chip group-detail-trip__transport-chip--${variant}`}
            tabIndex={0}
          >
            <Icon size={12} strokeWidth={2.25} aria-hidden />
            <span className="sr-only">
              {label} ({tripBasis}): estimativa {formatted}
              {hub ? `. Rota até ${hub.hub}, hub mais próximo de ${hub.destino}` : ''}
            </span>
            <span aria-hidden>{formatted}</span>
          </span>
        </Tooltip>
        ))}
      </span>
      {hubReferencia ? (
        <span className="group-detail-trip__transport-hub-note">
          via {hubReferencia.hub.split(' ')[0]}
        </span>
      ) : null}
    </span>
  )
}