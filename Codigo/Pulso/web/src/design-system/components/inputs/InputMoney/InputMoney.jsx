import { forwardRef, useId, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  inputWrapperVariants,
  inputLabelVariants,
  inputHelperVariants,
} from '../shared/inputField.styles.jsx'
import { formatMoneyMask, digitsToNumber } from '../../../utils/formatMoneyInput.js'

/**
 * InputMoney — campo monetário com máscara BRL (#.##0,00)
 * onChange retorna number (ex: 1500.00)
 */
export const InputMoney = forwardRef(
  (
    {
      label,
      value = 0,
      onChange,
      error,
      disabled = false,
      required = false,
      size = 'default',
      prefix = 'R$',
      locale = 'pt-BR',
      placeholder = '0,00',
      helperText,
      conversionText,
      id: idProp,
      className,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const errorId = `${inputId}-error`
    const [isFocused, setIsFocused] = useState(false)

    const hasError = Boolean(error)
    const isLarge = size === 'large'

    const labelState = disabled
      ? 'disabled'
      : hasError
        ? 'error'
        : isFocused
          ? 'focused'
          : 'default'

    const displayValue = value > 0 || isFocused ? formatMoneyMask(value, locale) : ''

    const borderClass = hasError
      ? 'border-[var(--ds-color-danger)]'
      : isLarge
        ? 'border-[var(--ds-color-input-focus)]'
        : isFocused
          ? 'border-[var(--ds-color-input-focus)]'
          : 'border-[var(--ds-color-input-border)]'

    const handleChange = (e) => {
      onChange?.(digitsToNumber(e.target.value))
    }

    const inputClass = cn(
      'bg-transparent text-[var(--ds-color-text)] placeholder:text-[var(--ds-color-placeholder)]',
      'border-0 outline-none focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed'
    )

    return (
      <div className={cn(inputWrapperVariants(), className)}>
        {label && (
          <label htmlFor={inputId} className={inputLabelVariants({ state: labelState })}>
            {label}
            {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
          </label>
        )}

        {isLarge ? (
          <div
            className={cn(
              'ds-input-container flex h-14 flex-col items-center justify-center gap-0.5',
              'rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-input-bg)] px-4',
              'transition-colors duration-[var(--ds-transition-fast)]',
              borderClass,
              disabled && 'cursor-not-allowed bg-[var(--ds-color-input-disabled)] opacity-50'
            )}
          >
            <span className="text-sm text-[var(--ds-color-text-secondary)]">{prefix}</span>
            <input
              ref={ref}
              id={inputId}
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={hasError || undefined}
              className={cn(inputClass, 'w-full text-center text-[32px] font-bold leading-tight')}
              onFocus={(e) => { setIsFocused(true); onFocus?.(e) }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e) }}
              {...rest}
            />
          </div>
        ) : (
          <div
            className={cn(
              'ds-input-container flex h-11 items-center',
              'rounded-[var(--ds-radius-md)] border bg-[var(--ds-color-input-bg)]',
              'transition-colors duration-[var(--ds-transition-fast)]',
              borderClass,
              disabled && 'cursor-not-allowed bg-[var(--ds-color-input-disabled)] opacity-50'
            )}
          >
            <span className="shrink-0 select-none border-r border-[var(--ds-color-border)] px-4 text-sm font-medium text-[var(--ds-color-text-secondary)]">
              {prefix}
            </span>
            <input
              ref={ref}
              id={inputId}
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={hasError || undefined}
              className={cn(inputClass, 'min-w-0 flex-1 px-4 text-right text-sm')}
              onFocus={(e) => { setIsFocused(true); onFocus?.(e) }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e) }}
              {...rest}
            />
          </div>
        )}

        {hasError && (
          <p id={errorId} className={cn(inputHelperVariants({ type: 'error' }), 'flex items-center gap-1')} role="alert">
            <AlertTriangle size={14} className="shrink-0" />
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className={inputHelperVariants({ type: 'helper' })}>{helperText}</p>
        )}
        {!hasError && conversionText && (
          <p className="text-xs text-[var(--ds-color-info)]">{conversionText}</p>
        )}
      </div>
    )
  }
)

InputMoney.displayName = 'InputMoney'
