import { useEffect, useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { useSelectDropdown } from '@/design-system/components/selects/shared/useSelectDropdown.js'
import { SelectTrigger } from '@/design-system/components/selects/shared/SelectTrigger.jsx'
import { SelectChevron } from '@/design-system/components/selects/shared/SelectChevron.jsx'
import { selectDropdownVariants } from '@/design-system/components/selects/shared/select.styles.jsx'
import { buildCurrencySelectOptions } from '@/components/features/trips/CurrencyFlag.jsx'

export function CurrencySearchPicker({
  catalog = [],
  value = '',
  onChange,
  exclude = [],
  filterItems,
  label = null,
  className = '',
  listMaxHeight,
  searchPlaceholder = 'Buscar por código ou nome...',
}) {
  const [query, setQuery] = useState('')
  const { isOpen, toggle, close, ref } = useSelectDropdown()

  const options = useMemo(() => {
    const items = typeof filterItems === 'function' ? catalog.filter(filterItems) : catalog
    return buildCurrencySelectOptions(items, { exclude })
  }, [catalog, exclude, filterItems])

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return options

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) || option.value.toLowerCase().includes(term)
    )
  }, [options, query])

  useEffect(() => {
    setQuery('')
  }, [catalog.length, exclude.join(',')])

  useEffect(() => {
    if (!options.length) return
    if (value && options.some((option) => option.value === value)) return
    onChange?.(options[0].value)
  }, [value, options])

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  const selectedOption = options.find((option) => option.value === value)
  const listStyle = listMaxHeight ? { maxHeight: listMaxHeight } : undefined

  const handleSelect = (optionValue) => {
    onChange?.(optionValue)
    close()
  }

  return (
    <div className={`trip-currency-picker ${className}`.trim()}>
      {label}

      <div ref={ref} className="relative">
        <SelectTrigger open={isOpen} onClick={toggle}>
          {selectedOption ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              <span className="ds-select-option__icon">{selectedOption.icon}</span>
              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="flex-1 truncate text-left text-[var(--ds-color-placeholder)]">
              Selecione uma moeda
            </span>
          )}
          <SelectChevron open={isOpen} />
        </SelectTrigger>

        {isOpen && (
          <div className={selectDropdownVariants()} role="listbox" aria-label="Moedas disponíveis">
            <div className="trip-currency-picker__search">
              <InputText
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                placeholder={searchPlaceholder}
                leftIcon={<Search size={18} />}
                autoFocus
              />
            </div>

            <div className="trip-currency-picker__list" style={listStyle}>
              {filteredOptions.length === 0 ? (
                <div className="trip-currency-picker__empty">
                  <Search size={28} aria-hidden />
                  <p>Nenhuma moeda encontrada</p>
                  <span>Tente outro código ou nome.</span>
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const selected = option.value === value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`ds-select-option trip-currency-picker__option${selected ? ' ds-select-option--selected' : ''}`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="ds-select-option__icon">{option.icon}</span>
                      <span className="flex-1 truncate">{option.label}</span>
                      {selected ? (
                        <Check size={16} className="shrink-0 text-[var(--ds-color-primary-light)]" />
                      ) : null}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
