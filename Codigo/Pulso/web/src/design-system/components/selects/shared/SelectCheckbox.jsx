import { cn } from '../../../utils/cn.js'

/** Checkbox 20×20 para MultiSelect */
export const SelectCheckbox = ({ checked, disabled, className, ...rest }) => (
  <span
    className={cn(
      'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border',
      'transition-colors duration-[var(--ds-transition-fast)]',
      checked
        ? 'border-[var(--ds-color-primary)] bg-[var(--ds-color-primary)] text-white'
        : 'border-[var(--ds-color-border)] bg-transparent',
      disabled && 'opacity-50',
      className
    )}
    {...rest}
  >
    {checked && (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
)
