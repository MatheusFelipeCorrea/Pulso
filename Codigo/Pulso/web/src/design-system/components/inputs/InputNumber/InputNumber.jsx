import { forwardRef, useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  inputWrapperVariants,
  inputLabelVariants,
  inputHelperVariants,
} from '../shared/inputField.styles.jsx'

/** InputNumber — stepper numérico (− valor +), 160×44px */
export const InputNumber = forwardRef(
  (
    {
      label,
      value = 0,
      onChange,
      min,
      max,
      step = 1,
      error,
      disabled = false,
      id: idProp,
      className,
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const errorId = `${inputId}-error`
    const [hoverSide, setHoverSide] = useState(null)

    const hasError = Boolean(error)
    const atMin = min !== undefined && value <= min
    const atMax = max !== undefined && value >= max

    const clamp = (n) => {
      let v = n
      if (min !== undefined) v = Math.max(min, v)
      if (max !== undefined) v = Math.min(max, v)
      return v
    }

    const stepBtnClass = (side, isAtLimit) =>
      cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'transition-all duration-[var(--ds-transition-fast)]',
        isAtLimit || disabled
          ? 'cursor-not-allowed text-[var(--ds-color-placeholder)]'
          : cn(
              'cursor-pointer text-[var(--ds-color-text-secondary)]',
              hoverSide === side &&
                'bg-[var(--ds-color-hover)] border border-[color-mix(in_srgb,var(--ds-color-primary)_30%,transparent)]'
            )
      )

    return (
      <div className={cn(inputWrapperVariants(), className, disabled && 'opacity-50 pointer-events-none')}>
        {label && (
          <label htmlFor={inputId} className={inputLabelVariants({ state: hasError ? 'error' : 'default' })}>
            {label}
          </label>
        )}

        <div
          className={cn(
            'ds-input-container flex h-11 w-40 items-center justify-between',
            'rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-input-bg)] px-0.5',
            hasError ? 'border-[var(--ds-color-danger)]' : 'border-[var(--ds-color-input-border)]'
          )}
        >
          <button
            type="button"
            disabled={disabled || atMin}
            className={stepBtnClass('minus', atMin)}
            onMouseEnter={() => setHoverSide('minus')}
            onMouseLeave={() => setHoverSide(null)}
            onClick={() => !disabled && !atMin && onChange?.(clamp(value - step))}
            aria-label="Diminuir"
          >
            <Minus size={16} />
          </button>

          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10)
              onChange?.(Number.isNaN(parsed) ? (min ?? 0) : parsed)
            }}
            onBlur={() => onChange?.(clamp(value))}
            disabled={disabled}
            className={cn(
              'ds-input-number-field min-w-0 flex-1 bg-transparent text-center text-sm',
              'text-[var(--ds-color-text)] border-0 outline-none focus:outline-none focus-visible:outline-none'
            )}
          />

          <button
            type="button"
            disabled={disabled || atMax}
            className={stepBtnClass('plus', atMax)}
            onMouseEnter={() => setHoverSide('plus')}
            onMouseLeave={() => setHoverSide(null)}
            onClick={() => !disabled && !atMax && onChange?.(clamp(value + step))}
            aria-label="Aumentar"
          >
            <Plus size={16} />
          </button>
        </div>

        {hasError && (
          <p id={errorId} className={inputHelperVariants({ type: 'error' })} role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

InputNumber.displayName = 'InputNumber'
