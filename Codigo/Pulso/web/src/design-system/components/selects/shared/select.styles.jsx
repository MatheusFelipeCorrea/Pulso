import { cva } from 'class-variance-authority'

/** Container do trigger — borda e fundo no wrapper (botão interno fica transparente) */
export const selectTriggerContainerVariants = cva(
  [
    'ds-select-container w-full overflow-hidden',
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
      multiline: {
        true: 'min-h-11',
        false: 'h-11',
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
    defaultVariants: {
      open: false,
      error: false,
      disabled: false,
      multiline: false,
      hoverable: true,
    },
  }
)

/** Botão interno do trigger — herda reset transparente de base.css */
export const selectTriggerButtonVariants = cva(
  [
    'ds-select-trigger flex w-full items-center gap-2 px-4 text-sm text-left',
    'bg-transparent border-0 outline-none',
    'cursor-pointer select-none',
    'h-11 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      multiline: {
        true: 'h-auto min-h-11 py-2',
        false: '',
      },
    },
    defaultVariants: { multiline: false },
  }
)

/** @deprecated use selectTriggerContainerVariants + selectTriggerButtonVariants */
export const selectTriggerVariants = selectTriggerContainerVariants

export const selectDropdownVariants = cva(
  [
    'absolute left-0 right-0 top-full z-[var(--ds-z-dropdown)] mt-1',
    'overflow-hidden rounded-[var(--ds-radius-md)]',
    'border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)]',
    'shadow-[var(--ds-shadow-md)]',
  ]
)

export const selectOptionVariants = cva(
  [
    'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
    'transition-colors duration-[var(--ds-transition-fast)]',
    'cursor-pointer',
  ],
  {
    variants: {
      selected: {
        true: 'text-[var(--ds-color-primary-light)]',
        false: 'text-[var(--ds-color-text)]',
      },
      highlighted: {
        true: 'bg-[var(--ds-color-hover)]',
        false: '',
      },
    },
    defaultVariants: { selected: false, highlighted: false },
  }
)
