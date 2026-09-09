import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Select } from '../../selects/Select/Select.jsx'
import { getPaginationInfoRange, getPaginationRange } from '../../../utils/paginationUtils.js'

/**
 * Pagination — controle de páginas (desacoplado dos dados)
 *
 * @param {'numeric'|'simple'|'full'} [layout='numeric']
 */
export const Pagination = ({
  page = 1,
  totalPages = 1,
  onChange,
  layout = 'numeric',
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showInfo = false,
  totalItems = 0,
  prevLabel = 'Anterior',
  nextLabel = 'Próximo',
  className,
}) => {
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages))
  const isFirst = safePage <= 1
  const isLast = safePage >= totalPages
  const range = getPaginationRange(safePage, totalPages)
  const info = getPaginationInfoRange(safePage, pageSize, totalItems)

  const pageSizeSelectOptions = pageSizeOptions.map((n) => ({
    value: n,
    label: String(n),
  }))

  const controls = (
    <div className="ds-pagination__controls">
      <button
        type="button"
        className="ds-pagination__nav"
        disabled={isFirst}
        onClick={() => onChange?.(safePage - 1)}
        aria-label={prevLabel}
      >
        <ChevronLeft size={16} aria-hidden />
        <span>{prevLabel}</span>
      </button>

      {layout !== 'simple' && (
        <div className="ds-pagination__pages" role="group" aria-label="Páginas">
          {range.map((item, i) =>
            item === 'ellipsis' ? (
              <span key={`e-${i}`} className="ds-pagination__ellipsis" aria-hidden>
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={cn(
                  'ds-pagination__page',
                  item === safePage && 'ds-pagination__page--active'
                )}
                aria-current={item === safePage ? 'page' : undefined}
                onClick={() => onChange?.(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
      )}

      {layout === 'simple' && (
        <p className="ds-pagination__simple">
          Página <strong>{safePage}</strong> de <strong>{totalPages}</strong>
        </p>
      )}

      <button
        type="button"
        className="ds-pagination__nav"
        disabled={isLast}
        onClick={() => onChange?.(safePage + 1)}
        aria-label={nextLabel}
      >
        <span>{nextLabel}</span>
        <ChevronRight size={16} aria-hidden />
      </button>
    </div>
  )

  if (layout === 'full' || showInfo || showPageSize) {
    return (
      <div className={cn('ds-pagination ds-pagination--full', className)}>
        {showInfo && totalItems > 0 && (
          <p className="ds-pagination__info">
            Mostrando <strong>{info.start}–{info.end}</strong> de{' '}
            <strong>{info.total}</strong> resultados
          </p>
        )}
        {controls}
        {showPageSize && (
          <div className="ds-pagination__page-size">
            <label className="ds-pagination__page-size-label" htmlFor="ds-page-size">
              Itens por página:
            </label>
            <Select
              id="ds-page-size"
              options={pageSizeSelectOptions}
              value={pageSize}
              onChange={(v) => onPageSizeChange?.(v)}
              className="ds-pagination__page-size-select"
            />
          </div>
        )}
      </div>
    )
  }

  return <div className={cn('ds-pagination', className)}>{controls}</div>
}
