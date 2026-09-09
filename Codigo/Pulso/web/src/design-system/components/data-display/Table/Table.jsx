import { ArrowDown, ArrowUp, ArrowUpDown, SearchX, FolderOpen } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Skeleton } from '../../feedback/Skeleton/Skeleton.jsx'
import { EmptyState } from '../../feedback/EmptyState/EmptyState.jsx'
import { ErrorState } from '../../feedback/ErrorState/ErrorState.jsx'
import { tableWrapperVariants } from './Table.styles.jsx'

const EMPTY_PRESETS = {
  default: {
    icon: <FolderOpen strokeWidth={1.25} />,
    title: 'Nenhum registro encontrado',
    description: 'Ajuste os filtros ou crie um novo registro.',
  },
  'no-results': {
    icon: <SearchX strokeWidth={1.25} />,
    title: 'Nenhum resultado encontrado',
    description: 'Tente buscar por outro termo ou limpe os filtros.',
  },
  filter: {
    icon: <SearchX strokeWidth={1.25} />,
    title: 'Sem dados para este período',
    description: 'Selecione outro período ou registre novas transações.',
  },
}

/**
 * Table — listagem genérica (sem paginação/ordenação interna)
 */
export const Table = ({
  columns = [],
  data = [],
  loading = false,
  error = false,
  onRetry,
  emptyState = 'default',
  emptyIcon,
  emptyTitle,
  emptyDescription,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  idKey = 'id',
  onSort,
  sortKey,
  sortDirection,
  skeletonRows = 5,
  density = 'comfortable',
  footer,
  className,
  'aria-label': ariaLabel = 'Tabela de dados',
}) => {
  const preset = EMPTY_PRESETS[emptyState] ?? EMPTY_PRESETS.default
  const allIds = data.map((row) => row[idKey]).filter(Boolean)
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0 && !allSelected

  const toggleAll = () => {
    if (!onSelectionChange) return
    onSelectionChange(allSelected ? [] : allIds)
  }

  const toggleRow = (id) => {
    if (!onSelectionChange) return
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    )
  }

  const handleSort = (key, sortable) => {
    if (!sortable || !onSort) return
    const nextDir = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort({ key, direction: nextDir })
  }

  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <tr key={`sk-${rowIndex}`} className="ds-table__row ds-table__row--skeleton">
              {selectable && (
                <td className="ds-table__cell ds-table__cell--select">
                  <Skeleton variant="button" className="!h-5 !w-5 !min-w-5 rounded" />
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('ds-table__cell', col.hideOnMobile && 'ds-table__cell--hide-mobile')}
                  style={{ width: col.width, textAlign: col.align }}
                >
                  <Skeleton variant="text" className="max-w-[120px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} className="ds-table__state-cell">
              <ErrorState
                variant="inline"
                title="Algo deu errado ao carregar os dados"
                message="Verifique sua conexão e tente novamente."
                onRetry={onRetry}
                retryLabel="Tentar novamente"
                size="compact"
              />
            </td>
          </tr>
        </tbody>
      )
    }

    if (!data.length) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length + (selectable ? 1 : 0)} className="ds-table__state-cell">
              <EmptyState
                icon={emptyIcon ?? preset.icon}
                title={emptyTitle ?? preset.title}
                description={emptyDescription ?? preset.description}
                size="compact"
              />
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {data.map((row, rowIndex) => {
          const rowId = row[idKey]
          const isSelected = rowId != null && selectedIds.includes(rowId)
          return (
            <tr
              key={rowId ?? rowIndex}
              className={cn('ds-table__row', isSelected && 'ds-table__row--selected')}
            >
              {selectable && (
                <td className="ds-table__cell ds-table__cell--select">
                  <input
                    type="checkbox"
                    className="ds-table-checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(rowId)}
                    aria-label={`Selecionar linha ${rowIndex + 1}`}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'ds-table__cell',
                    col.align === 'right' && 'ds-table__cell--right',
                    col.align === 'center' && 'ds-table__cell--center',
                    col.type === 'actions' && 'ds-table__cell--actions',
                    col.hideOnMobile && 'ds-table__cell--hide-mobile'
                  )}
                  style={{ width: col.width }}
                >
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <div className={cn(tableWrapperVariants({ density }), className)}>
      <div className="ds-table-scroll">
        <table className="ds-table" aria-label={ariaLabel}>
          <thead>
            <tr>
              {selectable && (
                <th className="ds-table__head ds-table__head--select" scope="col">
                  <input
                    type="checkbox"
                    className="ds-table-checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleAll}
                    aria-label="Selecionar todas as linhas"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'ds-table__head',
                      col.sortable && 'ds-table__head--sortable',
                      isSorted && 'ds-table__head--sorted',
                      col.hideOnMobile && 'ds-table__cell--hide-mobile'
                    )}
                    style={{ width: col.width, textAlign: col.align }}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className="ds-table__sort-btn"
                        onClick={() => handleSort(col.key, col.sortable)}
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={14} aria-hidden />
                          ) : (
                            <ArrowDown size={14} aria-hidden />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="opacity-50" aria-hidden />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          {renderBody()}
          {footer && !loading && !error && data.length > 0 && (
            <tfoot>
              <tr className="ds-table__row ds-table__row--footer">{footer}</tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
