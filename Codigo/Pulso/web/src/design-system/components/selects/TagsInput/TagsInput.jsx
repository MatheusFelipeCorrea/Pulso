import { useId, useState, useRef, useMemo, useCallback } from 'react'
import { Tag, Plus, Info } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { useClickOutside } from '../../../hooks/useClickOutside.js'
import { inputHelperVariants } from '../../inputs/shared/inputField.styles.jsx'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectChip } from '../shared/SelectChip.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'

/** TagsInput — input de tags com chips, sugestões e limite máximo */
export const TagsInput = ({
  tags = [],
  onAdd,
  onRemove,
  placeholder = 'Digite e aperte Enter...',
  max,
  suggestions = [],
  error,
  disabled = false,
  label,
  helperText,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const atMax = max !== undefined && tags.length >= max
  const showSuggestions = suggestions.length > 0 && inputValue.length > 0 && !atMax

  const filteredSuggestions = useMemo(
    () =>
      suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((t) => t.toLowerCase() === s.toLowerCase())
      ),
    [suggestions, inputValue, tags]
  )

  const closeSuggestions = useCallback(() => setIsFocused(false), [])

  useClickOutside(wrapperRef, closeSuggestions)

  const addTag = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('')
      return
    }
    if (atMax) return
    onAdd?.(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemove?.(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      closeSuggestions()
    }
  }

  const labelText = max !== undefined && atMax ? `${label} (${tags.length}/${max})` : label

  const headerExtra =
    atMax && max !== undefined ? (
      <span className="flex items-center gap-1 text-xs text-[var(--ds-color-warning)]">
        <Info size={14} />
        Máximo de {max} tags
      </span>
    ) : null

  const resolvedHelper =
    atMax && max !== undefined
      ? `Você atingiu o limite máximo de ${max} tags. Remova alguma para adicionar novas.`
      : helperText ??
        (tags.length > 0
          ? 'Edite ou remova as tags quando quiser.'
          : 'Digite o nome da tag e aperte Enter para adicionar.')

  return (
    <SelectFieldWrapper
      label={labelText}
      error={error}
      disabled={disabled}
      isOpen={isFocused && showSuggestions}
      id={id}
      className={className}
      headerExtra={headerExtra}
    >
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            'ds-select-container flex min-h-11 flex-wrap items-center gap-1.5',
            'rounded-[var(--ds-radius-md)] border px-3 py-2.5',
            'bg-[var(--ds-color-select-bg)]',
            'transition-[border-color,box-shadow] duration-[var(--ds-transition-fast)]',
            isFocused && !error && 'border-[var(--ds-color-input-focus)] shadow-[0_0_0_1px_var(--ds-color-input-focus)]',
            !isFocused && !error && 'border-[var(--ds-color-select-border)] hover:border-[var(--ds-color-text-secondary)]',
            error && 'border-[var(--ds-color-danger)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => !disabled && inputRef.current?.focus()}
        >
          {tags.map((tag) => (
            <SelectChip
              key={tag}
              label={tag}
              onRemove={() => onRemove?.(tag)}
              disabled={disabled}
            />
          ))}

          {tags.length > 0 && (
            <span className="h-4 w-px shrink-0 bg-[var(--ds-color-border)]" aria-hidden="true" />
          )}

          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            disabled={disabled || atMax}
            placeholder={tags.length === 0 ? placeholder : placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-w-[80px] flex-1 bg-transparent text-sm text-[var(--ds-color-text)]',
              'placeholder:text-[var(--ds-color-placeholder)]',
              'border-0 outline-none focus:outline-none focus-visible:outline-none',
              'disabled:cursor-not-allowed'
            )}
          />
        </div>

        {showSuggestions && isFocused && (
          <div className={selectDropdownVariants()}>
            <div className="max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => { addTag(suggestion); closeSuggestions() }}
                  className={cn(
                    'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
                    'text-[var(--ds-color-text)]',
                    'transition-colors duration-[var(--ds-transition-fast)]'
                  )}
                >
                  <Tag size={16} className="shrink-0 text-[var(--ds-color-text-secondary)]" />
                  <span className="flex-1 truncate">{suggestion}</span>
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Existente</span>
                </button>
              ))}

              {!tags.some((t) => t.toLowerCase() === inputValue.trim().toLowerCase()) &&
                inputValue.trim() && (
                  <button
                    type="button"
                    onClick={() => { addTag(inputValue); closeSuggestions() }}
                    className={cn(
                      'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
                      'text-[var(--ds-color-text)]',
                      'transition-colors duration-[var(--ds-transition-fast)]'
                    )}
                  >
                    <Plus size={16} className="shrink-0 text-[var(--ds-color-primary)]" />
                    <span className="flex-1 truncate">
                      Criar nova tag &apos;{inputValue.trim()}&apos;
                    </span>
                    <span className="text-xs text-[var(--ds-color-text-secondary)]">
                      Pressione Enter ou ,
                    </span>
                  </button>
                )}
            </div>
          </div>
        )}
      </div>

      {!error && resolvedHelper && (
        <p
          className={cn(
            inputHelperVariants({ type: atMax ? 'helper' : 'helper' }),
            atMax && 'text-[var(--ds-color-warning)]'
          )}
        >
          {resolvedHelper}
        </p>
      )}
    </SelectFieldWrapper>
  )
}
