import { forwardRef, useId, useState } from 'react'
import { LockKeyhole, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  inputWrapperVariants,
  inputLabelVariants,
  inputContainerVariants,
  inputHelperVariants,
} from '../shared/inputField.styles.jsx'
import { DEFAULT_PASSWORD_RULES } from './passwordRules.js'

/**
 * InputPassword — campo de senha com toggle de visibilidade
 *
 * Suporta checklist de validação em tempo real (showValidation)
 */
export const InputPassword = forwardRef(
  (
    {
      label,
      placeholder = '••••••••',
      value = '',
      onChange,
      error,
      disabled = false,
      required = false,
      showValidation = false,
      validationRules = DEFAULT_PASSWORD_RULES,
      helperText,
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
    const [isVisible, setIsVisible] = useState(false)

    const hasError = Boolean(error)

    const labelState = disabled
      ? 'disabled'
      : hasError
        ? 'error'
        : isFocused
          ? 'focused'
          : 'default'

    const handleFocus = (e) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const fieldBlock = (
      <>
        <div
          className={inputContainerVariants({
            focused: isFocused && !hasError,
            error: hasError,
            disabled,
          })}
        >
          <span className="ds-input-icon">
            <LockKeyhole size={20} />
          </span>

          <input
            ref={ref}
            id={inputId}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            autoComplete="current-password"
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={cn('ds-input-field', !isVisible && 'ds-input-masked')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          <button
            type="button"
            onClick={() => !disabled && setIsVisible((v) => !v)}
            disabled={disabled}
            className="ds-input-action"
            aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {hasError && (
          <p id={errorId} className={inputHelperVariants({ type: 'error' })} role="alert">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p className={inputHelperVariants({ type: 'helper' })}>{helperText}</p>
        )}
      </>
    )

    return (
      <div className={cn(inputWrapperVariants(), className)}>
        {label && (
          <label htmlFor={inputId} className={inputLabelVariants({ state: labelState })}>
            {label}
            {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
          </label>
        )}

        {showValidation && !disabled ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="min-w-0 flex-1 space-y-1.5">{fieldBlock}</div>
            <ul className="flex flex-col gap-2 sm:min-w-[220px] sm:pt-2.5" aria-live="polite">
              {validationRules.map((rule) => {
                const passed = rule.test(value)
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      'flex items-center gap-2 text-xs transition-colors duration-[var(--ds-transition-fast)]',
                      passed
                        ? 'text-[var(--ds-color-success)]'
                        : 'text-[var(--ds-color-danger)]'
                    )}
                  >
                    {passed ? (
                      <CheckCircle size={16} className="shrink-0" />
                    ) : (
                      <XCircle size={16} className="shrink-0" />
                    )}
                    <span>{rule.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className="space-y-1.5">{fieldBlock}</div>
        )}
      </div>
    )
  }
)

InputPassword.displayName = 'InputPassword'
