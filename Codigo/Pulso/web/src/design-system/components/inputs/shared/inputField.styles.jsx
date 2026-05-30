import { cva } from 'class-variance-authority'

/** Wrapper externo do campo */
export const inputWrapperVariants = cva('flex w-full flex-col gap-1.5')

/** Label acima do campo */
export const inputLabelVariants = cva(
  'text-sm font-medium transition-colors duration-[var(--ds-transition-fast)]',
  {
    variants: {
      state: {
        default: 'text-[var(--ds-color-text-secondary)]',
        focused: 'text-[var(--ds-color-primary)]',
        error: 'text-[var(--ds-color-danger)]',
        disabled: 'text-[var(--ds-color-text-secondary)] opacity-50',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

/** Container do input — 44px altura, padding 12px 16px, radius 8px */
export const inputContainerVariants = cva(
  [
    'ds-input-container',
    'flex h-11 items-center gap-3',
    'rounded-[var(--ds-radius-md)] border',
    'bg-[var(--ds-color-input-bg)]',
    'px-4 transition-colors duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      focused: {
        true: 'border-[var(--ds-color-input-focus)]',
        false: 'border-[var(--ds-color-input-border)]',
      },
      error: {
        true: 'border-[var(--ds-color-danger)]',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed bg-[var(--ds-color-input-disabled)] opacity-50',
        false: '',
      },
    },
    compoundVariants: [
      {
        error: true,
        class: 'border-[var(--ds-color-danger)]',
      },
    ],
    defaultVariants: {
      focused: false,
      error: false,
      disabled: false,
    },
  }
)

/** Mensagem de erro / helper abaixo */
export const inputHelperVariants = cva('text-xs', {
  variants: {
    type: {
      error: 'text-[var(--ds-color-danger)]',
      helper: 'text-[var(--ds-color-text-secondary)]',
    },
  },
  defaultVariants: {
    type: 'helper',
  },
})
