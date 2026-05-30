import { cva } from 'class-variance-authority'

/** Layout only — cores/estados em base.css (.ds-radio-circle) */
export const radioCircleVariants = cva('ds-radio-circle')

export const radioDotVariants = cva('ds-radio-dot')

export const radioCardVariants = cva(
  [
    'flex cursor-pointer rounded-[var(--ds-radius-md)] border p-3 transition-colors duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      checked: {
        true: 'border-2 border-[var(--ds-color-primary)] bg-[color-mix(in_srgb,var(--ds-color-primary)_10%,transparent)]',
        false: 'border border-[var(--ds-color-border)] hover:bg-[var(--ds-color-hover)]',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-40',
        false: '',
      },
    },
    defaultVariants: { checked: false, disabled: false },
  }
)
