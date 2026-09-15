import { cn } from '../../../utils/cn.js'
import {
  selectTriggerContainerVariants,
  selectTriggerButtonVariants,
} from './select.styles.jsx'

/** Trigger compartilhado — container com borda/fundo + botão interno transparente */
export const SelectTrigger = ({
  open,
  error,
  disabled,
  multiline = false,
  className,
  id,
  children,
  onClick,
  onKeyDown,
  ...rest
}) => (
  <div
    className={cn(
      selectTriggerContainerVariants({
        open,
        error,
        disabled,
        multiline,
      }),
      className
    )}
  >
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={selectTriggerButtonVariants({ multiline })}
      {...rest}
    >
      {children}
    </button>
  </div>
)
