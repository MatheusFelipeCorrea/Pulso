import { useEffect, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Banknote,
  Calendar,
  ChevronRight,
  Coins,
  Pencil,
  Trash2,
} from 'lucide-react'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { BudgetTruncatedLabel } from '@/components/features/budget/BudgetTruncatedLabel.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { TRIP_EXPENSE_CATEGORY_MAP, getTripExpenseCategoryIcon } from '@/utils/tripExpenseCategories.js'
import {
  getTripDestinationImage,
  getTripDestinationImageFallback,
  resolveTripDestinationImage,
  TRIP_FALLBACK_IMAGE,
} from '@/utils/tripDestinationImages.js'
import { repairWikiThumbUrl } from '@/utils/tripWikipediaImage.js'
import { formatTripDestinationDisplay } from '@/utils/tripDestinationDisplay.js'
import { TripDestinationTitle } from '@/components/features/trips/TripDestinationTitle.jsx'

function formatTripDate(iso) {
  if (!iso) return ''
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function TripCard({ viagem, catalogMap = {}, onDetails, onEdit, onDelete }) {
  const currency = catalogMap[viagem.moeda] ?? { code: viagem.moeda, name: viagem.moeda }
  const coverImage = useMemo(
    () => getTripDestinationImage(viagem.destino, viagem.moeda, viagem.destinoMeta),
    [viagem.destino, viagem.moeda, viagem.destinoMeta]
  )
  const [imageSrc, setImageSrc] = useState(coverImage)
  const [imageLoading, setImageLoading] = useState(!coverImage)
  const [imageAttempt, setImageAttempt] = useState(0)

  useEffect(() => {
    if (viagem.destinoMeta?.coverImageUrl) {
      setImageSrc(repairWikiThumbUrl(viagem.destinoMeta.coverImageUrl))
      setImageLoading(false)
      setImageAttempt(0)
      return undefined
    }

    let cancelled = false

    setImageSrc(null)
    setImageLoading(true)
    setImageAttempt(0)

    resolveTripDestinationImage(viagem.destino, viagem.moeda, viagem.destinoMeta).then((resolvedImage) => {
      if (!cancelled) {
        setImageSrc(resolvedImage || TRIP_FALLBACK_IMAGE)
        setImageLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [coverImage, viagem.destino, viagem.moeda, viagem.destinoMeta])

  const handleImageError = () => {
    if (imageSrc && /\/420px-/.test(imageSrc)) {
      const repaired = imageSrc.replace(/\/420px-/, '/330px-')
      if (repaired !== imageSrc) {
        setImageSrc(repaired)
        setImageAttempt((attempt) => attempt + 1)
        return
      }
    }

    if (imageAttempt === 0) {
      const fallback = getTripDestinationImageFallback()
      if (fallback && fallback !== imageSrc) {
        setImageSrc(fallback)
        setImageAttempt(1)
        return
      }
    }

    if (imageSrc !== TRIP_FALLBACK_IMAGE) {
      setImageSrc(TRIP_FALLBACK_IMAGE)
      setImageAttempt(2)
    }
  }

  const destinationLabel = formatTripDestinationDisplay(viagem.destino, viagem.destinoMeta)

  const grouped = viagem.despesas?.reduce((acc, item) => {
    const current = acc[item.categoria] ?? 0
    acc[item.categoria] = current + Number(item.valorEstimado)
    return acc
  }, {})

  const expenseRows = Object.entries(grouped ?? {})
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      meta: TRIP_EXPENSE_CATEGORY_MAP[categoria],
    }))
    .filter((item) => item.meta)

  const progress = viagem.meta ? Number(viagem.meta.percentual) : 0

  return (
    <article className="trip-card">
      <div className={`trip-card__media${imageLoading ? ' trip-card__media--loading' : ''}`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        ) : null}
      </div>

      <div className="trip-card__info">
        <TripDestinationTitle
          as="h3"
          className="trip-card__destination"
          destino={viagem.destino}
          destinoMeta={viagem.destinoMeta}
          stacked
        />
        <span className="trip-card__badge">Planejada</span>
        <p className="trip-card__date">
          <Calendar size={13} aria-hidden />
          <span>{formatTripDate(viagem.dataPrevista)}</span>
        </p>
        <span className="trip-card__currency-badge">
          <Banknote size={12} aria-hidden />
          {currency.code}
        </span>
      </div>

      <div className="trip-card__expenses">
        <h4>Pretensões de gastos</h4>
        {expenseRows.length === 0 ? (
          <p className="trip-card__empty-expenses">Nenhuma pretensão cadastrada ainda.</p>
        ) : (
          <ul>
            {expenseRows.map(({ categoria, valor, meta }) => {
              const Icon = getTripExpenseCategoryIcon(categoria)
              return (
                <li key={categoria}>
                  <Icon size={14} aria-hidden />
                  <BudgetTruncatedLabel text={meta.label} />
                  <strong>{formatCurrency(valor)}</strong>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <aside className="trip-card__aside">
        <p className="trip-card__total">
          <Coins size={14} aria-hidden />
          <span>
            Total: <strong>{formatCurrency(viagem.totalBrl)}</strong>
          </span>
        </p>

        {viagem.meta ? (
          <div className="trip-card__goal">
            <p>Meta vinculada: {viagem.meta.nome}</p>
            <div className="trip-card__goal-progress">
              <ProgressBar
                value={Number(viagem.meta.valorAtual)}
                max={Number(viagem.meta.valorAlvo)}
                variant="primary"
                size="sm"
              />
              <small>{Math.round(progress)}%</small>
            </div>
          </div>
        ) : (
          <p className="trip-card__no-goal">Sem meta vinculada</p>
        )}

        <button type="button" className="trip-card__details-btn" onClick={() => onDetails?.(viagem)}>
          Ver detalhes
          <ChevronRight size={16} aria-hidden />
        </button>
      </aside>

      <div className="trip-card__actions">
        <button
          type="button"
          className="trip-card__action-btn trip-card__action-btn--edit"
          aria-label={`Editar viagem ${destinationLabel}`}
          onClick={() => onEdit?.(viagem)}
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          className="trip-card__action-btn trip-card__action-btn--delete"
          aria-label={`Excluir viagem ${destinationLabel}`}
          onClick={() => onDelete?.(viagem)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}
