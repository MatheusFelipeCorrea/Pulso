import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Star } from 'lucide-react'
import { CurrencyFlag } from '@/components/features/trips/CurrencyFlag.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

const CAROUSEL_THRESHOLD = 5

function formatRate(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return formatCurrency(0)

  if (amount > 0 && amount < 0.01) {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  }

  return formatCurrency(amount)
}

export function TripFavoriteCurrencies({
  favoritas = [],
  catalog = [],
  onToggleFavorite,
  onAddFavorite,
}) {
  const catalogMap = Object.fromEntries(catalog.map((item) => [item.code, item]))
  const isCarousel = favoritas.length >= CAROUSEL_THRESHOLD
  const trackRef = useRef(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScroll = track.scrollWidth - track.clientWidth
    setCanScrollBack(track.scrollLeft > 4)
    setCanScrollForward(track.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    if (!isCarousel) return undefined

    updateScrollState()

    const track = trackRef.current
    if (!track) return undefined

    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [favoritas.length, isCarousel, updateScrollState])

  const scrollByPage = (direction) => {
    const track = trackRef.current
    if (!track) return

    const firstItem = track.querySelector('.trips-favorites__card, .trips-favorites__add')
    const gap = 12
    const step = firstItem ? firstItem.getBoundingClientRect().width + gap : track.clientWidth * 0.8

    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const listClassName = isCarousel ? 'trips-favorites__track' : 'trips-favorites__grid'

  return (
    <section className={`trips-favorites${isCarousel ? ' trips-favorites--carousel' : ''}`}>
      <div className="trips-favorites__heading">
        <h2>Moedas favoritas</h2>
        {isCarousel ? (
          <div className="trips-favorites__nav">
            <IconButton
              variant="secondary"
              size="sm"
              ariaLabel="Ver moedas anteriores"
              icon={<ChevronLeft size={16} />}
              disabled={!canScrollBack}
              onClick={() => scrollByPage(-1)}
            />
            <IconButton
              variant="secondary"
              size="sm"
              ariaLabel="Ver próximas moedas"
              icon={<ChevronRight size={16} />}
              disabled={!canScrollForward}
              onClick={() => scrollByPage(1)}
            />
          </div>
        ) : null}
      </div>

      <div className={listClassName} ref={isCarousel ? trackRef : null}>
        {favoritas.map((item) => {
          const meta = catalogMap[item.code] ?? item
          const positive = Number(item.pctChange) >= 0

          return (
            <article key={item.code} className="trips-favorites__card">
              <div className="trips-favorites__card-top">
                <CurrencyFlag code={item.code} size={24} />
                <button
                  type="button"
                  className="trips-favorites__star is-active"
                  aria-label={`Remover ${item.code} dos favoritos`}
                  onClick={() => onToggleFavorite?.(item.code)}
                >
                  <Star size={14} fill="currentColor" />
                </button>
              </div>

              <div className="trips-favorites__info">
                <strong>{item.code}</strong>
                <span className="trips-favorites__name">{meta.name}</span>
              </div>

              <p className="trips-favorites__rate">{formatRate(item.bid)}</p>
              <small className={positive ? 'is-up' : 'is-down'}>
                {positive ? '▲' : '▼'} {Math.abs(Number(item.pctChange)).toFixed(2)}%
              </small>
            </article>
          )
        })}

        <button type="button" className="trips-favorites__add" onClick={onAddFavorite}>
          <span className="trips-favorites__add-icon" aria-hidden>
            <Plus size={18} />
          </span>
          <span>Adicionar favorita</span>
        </button>
      </div>
    </section>
  )
}
