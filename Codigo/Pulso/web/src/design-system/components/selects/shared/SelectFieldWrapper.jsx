import { AlertTriangle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { inputWrapperVariants, inputLabelVariants, inputHelperVariants } from '../../inputs/shared/inputField.styles.jsx'

export const SelectFieldWrapper = ({
  label,
  required,
  error,
  disabled,
  isOpen,
  id,
  className,
  children,
  headerExtra,
}) => {
  const hasError = Boolean(error)
  const labelState = disabled ? 'disabled' : hasError ? 'error' : isOpen ? 'focused' : 'default'

  return (
    <div className={cn(inputWrapperVariants(), className)}>
      {(label || headerExtra) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label id={id ? `${id}-label` : undefined} className={inputLabelVariants({ state: labelState })}>
              {label}
              {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
            </label>
          )}
          {headerExtra}
        </div>
      )}
      {children}
      {hasError && (
        <p className={cn(inputHelperVariants({ type: 'error' }), 'flex items-center gap-1')} role="alert">
          <AlertTriangle size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
