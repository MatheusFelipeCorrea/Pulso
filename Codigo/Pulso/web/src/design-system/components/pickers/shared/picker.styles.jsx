import { cva } from 'class-variance-authority'

export const pickerTriggerContainerVariants = cva(
  [
    'ds-picker-container w-full overflow-hidden',
    'rounded-[var(--ds-radius-md)] border',
    'bg-[var(--ds-color-select-bg)]',
    'transition-[border-color,box-shadow] duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      open: {
        true: [
          'border-[var(--ds-color-input-focus)]',
          'shadow-[0_0_0_1px_var(--ds-color-input-focus)]',
        ],
        false: 'border-[var(--ds-color-select-border)]',
      },
      error: {
        true: 'border-[var(--ds-color-danger)] shadow-none',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50 pointer-events-none',
        false: '',
      },
      hoverable: {
        true: 'hover:border-[var(--ds-color-text-secondary)]',
        false: '',
      },
    },
    compoundVariants: [
      { open: true, error: false, class: 'hover:border-[var(--ds-color-input-focus)]' },
      { disabled: true, class: 'hover:border-[var(--ds-color-select-border)]' },
    ],
    defaultVariants: { open: false, error: false, disabled: false, hoverable: true },
  }
)

export const pickerTriggerButtonVariants = cva(
  [
    'flex w-full items-center gap-2 px-4 text-sm text-left',
    'bg-transparent border-0 outline-none h-11',
    'cursor-pointer select-none disabled:cursor-not-allowed',
  ]
)

export const pickerDropdownVariants = cva(
  [
    'ds-picker-dropdown absolute left-0 top-full z-[var(--ds-z-dropdown)] mt-1',
    'overflow-hidden rounded-[var(--ds-radius-md)]',
    'border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)]',
    'shadow-[var(--ds-shadow-md)]',
    'animate-[ds-picker-enter_150ms_ease]',
  ]
)

export const dayCellVariants = cva(
  [
    'relative flex h-9 w-9 items-center justify-center rounded-full text-sm',
    'transition-colors duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      variant: {
        default: 'text-[var(--ds-color-text)]',
        outside: 'text-[var(--ds-color-text-secondary)] opacity-60',
        disabled: 'cursor-not-allowed opacity-30',
        selected: 'bg-[var(--ds-color-primary)] text-white font-medium',
        today: 'border border-[var(--ds-color-primary)] text-[var(--ds-color-text)]',
        inRange: 'rounded-none bg-[color-mix(in_srgb,var(--ds-color-primary)_10%,transparent)]',
        rangeStart: 'rounded-l-full bg-[var(--ds-color-primary)] text-white font-medium',
        rangeEnd: 'rounded-r-full bg-[var(--ds-color-primary)] text-white font-medium',
        rangeSingle: 'bg-[var(--ds-color-primary)] text-white font-medium rounded-full',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--ds-color-hover)]',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', interactive: true },
  }
)

export const monthCellVariants = cva(
  [
    'flex h-11 items-center justify-center rounded-[var(--ds-radius-md)] text-sm',
    'transition-colors duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      variant: {
        default: 'text-[var(--ds-color-text)]',
        selected: 'bg-[var(--ds-color-primary)] text-white font-medium',
        current: 'border border-[var(--ds-color-primary)] text-[var(--ds-color-text)]',
        disabled: 'cursor-not-allowed opacity-30 text-[var(--ds-color-text-secondary)]',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--ds-color-hover)]',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', interactive: true },
  }
)
