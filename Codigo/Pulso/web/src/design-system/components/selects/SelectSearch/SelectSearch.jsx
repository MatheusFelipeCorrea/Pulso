import { useId, useState, useMemo, useCallback, useEffect } from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Spinner } from '../../feedback/Spinner/Spinner.jsx'
import { useSelectDropdown } from '../shared/useSelectDropdown.js'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectOption } from '../shared/SelectOption.jsx'
import { SelectChevron } from '../shared/SelectChevron.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'
import { SelectSearchBox } from '../shared/SelectSearchBox.jsx'
import { SelectTrigger } from '../shared/SelectTrigger.jsx'

/** SelectSearch — single-select com campo de busca no topo do dropdown */
export const SelectSearch = ({
  options = [],
  value = null,
  onChange,
  placeholder = 'Selecione uma categoria...',
  searchPlaceholder = 'Buscar...',
  loading = false,
  emptyMessage,
  emptySubtitle = 'Tente outro termo.',
  error,
  disabled = false,
  label,
  required = false,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, close, ref } = useSelectDropdown(disabled)
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const selectedOption = options.find((o) => o.value === value)

  const filtered = useMemo(
    () =>
      query.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options,
    [options, query]
  )

  const enabledFiltered = filtered.filter((o) => !o.disabled)

  const handleSelect = useCallback(
    (optionValue) => {
      onChange?.(optionValue)
      setQuery('')
      close()
    },
    [onChange, close]
  )

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setHighlightIndex(-1)
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (disabled) return
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % enabledFiltered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i <= 0 ? enabledFiltered.length - 1 : i - 1))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(enabledFiltered[highlightIndex].value)
    }
  }

  const resolvedEmptyMessage =
    emptyMessage ?? `Nenhum resultado para '${query}'`

  return (
    <SelectFieldWrapper
      label={label}
      required={required}
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
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          {selectedOption ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-[var(--ds-color-text)]">
              {selectedOption.icon && (
                <span className="inline-flex shrink-0" style={{ color: selectedOption.iconColor }}>
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="flex-1 truncate text-left text-[var(--ds-color-placeholder)]">
              {placeholder}
            </span>
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
            <div className="max-h-60 overflow-y-auto">
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
                  const enabledIdx = enabledFiltered.indexOf(option)
                  return (
                    <SelectOption
                      key={option.value}
                      option={option}
                      selected={option.value === value}
                      highlighted={enabledIdx === highlightIndex}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                    />
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
