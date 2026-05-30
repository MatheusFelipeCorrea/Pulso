import { useId, useState, useMemo, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Button } from '../../buttons/Button/Button.jsx'
import { Spinner } from '../../feedback/Spinner/Spinner.jsx'
import { Tooltip } from '../../data-display/Tooltip/Tooltip.jsx'
import { useSelectDropdown } from '../shared/useSelectDropdown.js'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectCheckbox } from '../shared/SelectCheckbox.jsx'
import { SelectChip } from '../shared/SelectChip.jsx'
import { SelectChevron } from '../shared/SelectChevron.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'
import { SelectSearchBox } from '../shared/SelectSearchBox.jsx'
import { SelectTrigger } from '../shared/SelectTrigger.jsx'

/** MultiSelectSearch — multi-seleção com busca; onChange só ao clicar "Aplicar" */
export const MultiSelectSearch = ({
  options = [],
  values = [],
  onChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  maxChipsVisible = 2,
  loading = false,
  emptyMessage,
  emptySubtitle = 'Tente outro termo.',
  error,
  disabled = false,
  label,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, close, ref } = useSelectDropdown(disabled)
  const [query, setQuery] = useState('')
  const [pendingValues, setPendingValues] = useState(values)

  useEffect(() => {
    if (isOpen) setPendingValues(values)
  }, [isOpen, values])

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  const selectedOptions = useMemo(
    () => options.filter((o) => values.includes(o.value)),
    [options, values]
  )

  const filtered = useMemo(
    () =>
      query.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options,
    [options, query]
  )

  const allPendingSelected =
    pendingValues.length === options.length && options.length > 0

  const togglePending = (val) => {
    setPendingValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
  }

  const selectAllPending = () => {
    setPendingValues(allPendingSelected ? [] : options.map((o) => o.value))
  }

  const clearPending = () => setPendingValues([])

  const apply = () => {
    onChange?.(pendingValues)
    close()
  }

  const removeChipImmediate = useCallback(
    (val) => {
      onChange?.(values.filter((v) => v !== val))
    },
    [values, onChange]
  )

  const handleToggle = () => {
    if (isOpen) close()
    else toggle()
  }

  const renderClosedTrigger = () => {
    if (values.length === 0) {
      return (
        <span className="flex-1 truncate text-left text-[var(--ds-color-placeholder)]">
          {placeholder}
        </span>
      )
    }

    if (selectedOptions.length <= maxChipsVisible) {
      return (
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedOptions.map((opt) => (
            <SelectChip
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              onRemove={() => removeChipImmediate(opt.value)}
              disabled={disabled}
            />
          ))}
        </span>
      )
    }

    const tooltipContent = selectedOptions.map((o) => o.label).join(', ')
    return (
      <Tooltip content={tooltipContent} position="bottom">
        <span className="flex-1 truncate text-left text-[var(--ds-color-text)]">
          [{values.length} selecionados]
        </span>
      </Tooltip>
    )
  }

  const resolvedEmptyMessage =
    emptyMessage ?? `Nenhum resultado para '${query}'`

  return (
    <SelectFieldWrapper
      label={label}
      error={error}
      disabled={disabled}
      isOpen={isOpen}
      id={id}
      className={className}
    >
      <div ref={ref} className="relative">
        <SelectTrigger
          id={id}
          open={isOpen}
          error={Boolean(error)}
          disabled={disabled}
          multiline
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? (
            <span className="flex-1 truncate text-left text-[var(--ds-color-text)]">
              {pendingValues.length} de {options.length} selecionados
            </span>
          ) : (
            renderClosedTrigger()
          )}
          <SelectChevron open={isOpen} />
        </SelectTrigger>

        {isOpen && (
          <div className={selectDropdownVariants()} role="listbox">
            <SelectSearchBox
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              onClear={() => setQuery('')}
            />

            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="sm" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <Search size={40} className="text-[var(--ds-color-primary)] opacity-40" />
                  <p className="text-sm text-[var(--ds-color-text)]">{resolvedEmptyMessage}</p>
                  <p className="text-xs text-[var(--ds-color-text-secondary)]">{emptySubtitle}</p>
                </div>
              ) : (
                filtered.map((option) => {
                  const checked = pendingValues.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={checked}
                      onClick={() => togglePending(option.value)}
                      className={cn(
                        'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
                        'transition-colors duration-[var(--ds-transition-fast)]',
                        checked ? 'text-[var(--ds-color-primary-light)]' : 'text-[var(--ds-color-text)]'
                      )}
                    >
                      <SelectCheckbox checked={checked} />
                      {option.icon && (
                        <span className="inline-flex shrink-0" style={{ color: option.iconColor }}>
                          {option.icon}
                        </span>
                      )}
                      <span className="flex-1 truncate">{option.label}</span>
                    </button>
                  )
                })
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[var(--ds-color-border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selectAllPending}
                  className="text-xs text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-primary)]"
                >
                  Selecionar todos
                </button>
                <span className="text-[var(--ds-color-border)]">|</span>
                <button
                  type="button"
                  onClick={clearPending}
                  className="text-xs text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-primary)]"
                >
                  Limpar seleção
                </button>
              </div>
              <Button size="sm" variant="primary" onClick={apply}>
                Aplicar
              </Button>
            </div>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
