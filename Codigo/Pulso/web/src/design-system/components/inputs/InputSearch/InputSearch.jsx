import { forwardRef, useId, useRef, useState, useEffect, useCallback } from 'react'
import { Search, X, ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { useClickOutside } from '../../../hooks/useClickOutside.js'
import { Spinner } from '../../feedback/Spinner/Spinner.jsx'
import { inputHelperVariants } from '../shared/inputField.styles.jsx'

/** InputSearch — busca com dropdown de resultados opcional */
export const InputSearch = forwardRef(
  (
    {
      label,
      placeholder = 'Pesquisar...',
      value = '',
      onChange,
      onClear,
      debounce: debounceMs = 0,
      size = 'default',
      disabled = false,
      results,
      renderResult,
      onSelectResult,
      onViewAll,
      viewAllLabel,
      loading = false,
      emptyMessage = 'Nenhum resultado encontrado',
      emptySubtitle = 'Tente buscar por outro termo.',
      className,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = generatedId
    const wrapperRef = useRef(null)
    const debounceRef = useRef(null)

    const [isFocused, setIsFocused] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const isCompact = size === 'compact'
    const hasDropdown = results !== undefined
    const showClear = Boolean(value && !disabled)

    const iconColor = disabled
      ? 'text-[var(--ds-color-placeholder)] opacity-50'
      : isFocused
        ? 'text-[var(--ds-color-primary)]'
        : 'text-[var(--ds-color-placeholder)]'

    const closeDropdown = useCallback(() => setIsOpen(false), [])

    useClickOutside(wrapperRef, () => {
      setIsOpen(false)
      setIsFocused(false)
    })

    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') closeDropdown()
      }
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }, [closeDropdown])

    const emitChange = (next) => {
      if (debounceMs > 0) {
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => onChange?.(next), debounceMs)
      } else {
        onChange?.(next)
      }
    }

    const handleClear = () => {
      onChange?.('')
      onClear?.()
      setIsOpen(false)
    }

    const footerLabel = viewAllLabel ?? `Ver todos os resultados para '${value}'`

    return (
      <div ref={wrapperRef} className={cn('relative flex w-full flex-col gap-1.5', className)}>
        {label && !isCompact && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--ds-color-text-secondary)]">
            {label}
          </label>
        )}

        <div
          className={cn(
            'ds-input-container flex items-center gap-3',
            'rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-input-bg)]',
            'transition-colors duration-[var(--ds-transition-fast)]',
            isCompact ? 'h-9 px-3' : 'h-11 px-4',
            isFocused ? 'border-[var(--ds-color-input-focus)]' : 'border-[var(--ds-color-input-border)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Search size={isCompact ? 16 : 20} className={cn('shrink-0', iconColor)} />

          <input
            ref={ref}
            id={inputId}
            type="search"
            value={value}
            onChange={(e) => {
              emitChange(e.target.value)
              if (hasDropdown && e.target.value.trim()) setIsOpen(true)
            }}
            onFocus={() => {
              setIsFocused(true)
              if (hasDropdown && value.trim()) setIsOpen(true)
            }}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
              'min-w-0 flex-1 bg-transparent text-sm text-[var(--ds-color-text)]',
              'placeholder:text-[var(--ds-color-placeholder)]',
              'border-0 outline-none focus:outline-none focus-visible:outline-none',
              'disabled:cursor-not-allowed',
              '[&::-webkit-search-cancel-button]:hidden'
            )}
            {...rest}
          />

          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 text-[var(--ds-color-placeholder)] hover:text-[var(--ds-color-text)] transition-colors"
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isFocused && showClear && !isCompact && (
          <p className={inputHelperVariants({ type: 'helper' })}>Clique no x para limpar a busca</p>
        )}

        {isOpen && hasDropdown && value.trim() && (
          <div
            className={cn(
              'absolute left-0 right-0 top-full z-[var(--ds-z-dropdown)] mt-1',
              'overflow-hidden rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)]',
              'bg-[var(--ds-color-surface)] shadow-[var(--ds-shadow-md)]'
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-8 text-center">
                <Search size={40} className="mb-3 text-[var(--ds-color-placeholder)] opacity-40" />
                <p className="text-sm font-medium text-[var(--ds-color-text)]">{emptyMessage}</p>
                <p className="mt-1 text-xs text-[var(--ds-color-text-secondary)]">{emptySubtitle}</p>
              </div>
            ) : (
              <>
                <ul className="max-h-64 overflow-y-auto">
                  {results.map((item, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-[var(--ds-color-hover)] transition-colors"
                        onClick={() => {
                          onSelectResult?.(item)
                          closeDropdown()
                        }}
                      >
                        {renderResult?.(item, index)}
                      </button>
                    </li>
                  ))}
                </ul>
                {onViewAll && (
                  <button
                    type="button"
                    onClick={() => { onViewAll(); closeDropdown() }}
                    className="flex w-full items-center gap-2 border-t border-[var(--ds-color-border)] px-4 py-3 text-sm text-[var(--ds-color-text-secondary)] hover:bg-[var(--ds-color-hover)] transition-colors"
                  >
                    <Search size={16} />
                    <span className="flex-1 text-left">{footerLabel}</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    )
  }
)

InputSearch.displayName = 'InputSearch'
