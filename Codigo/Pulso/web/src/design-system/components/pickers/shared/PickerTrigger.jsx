import { cn } from '../../../utils/cn.js'
import {
  pickerTriggerContainerVariants,
  pickerTriggerButtonVariants,
} from './picker.styles.jsx'

/** Trigger compartilhado dos pickers — container + botão interno transparente */
export const PickerTrigger = ({
  open,
  error,
  disabled,
  className,
  id,
  children,
  leftIcon,
  rightIcon,
  onClick,
  onKeyDown,
  ...rest
}) => (
  <div
    className={cn(
      pickerTriggerContainerVariants({
        open,
        error,
        disabled,
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
      className={pickerTriggerButtonVariants()}
      {...rest}
    >
      {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
    </button>
  </div>
)
