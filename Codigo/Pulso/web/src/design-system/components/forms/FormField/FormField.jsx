import { cn } from '../../../utils/cn.js'
import { inputLabelVariants, inputHelperVariants } from '../../inputs/shared/inputField.styles.jsx'

/** FormField — wrapper genérico com label, helper e erro */
export const FormField = ({
  label,
  required = false,
  helperText,
  error,
  htmlFor,
  children,
  className,
}) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <label
        htmlFor={htmlFor}
        className={inputLabelVariants({ state: error ? 'error' : 'default' })}
      >
        {label}
        {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className={inputHelperVariants({ type: 'error' })} role="alert">
        {error}
      </p>
    ) : (
      helperText && <p className={inputHelperVariants({ type: 'helper' })}>{helperText}</p>
    )}
  </div>
)
