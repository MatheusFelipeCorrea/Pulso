import { cva } from 'class-variance-authority'

export const SIZE_PX = {
  sm: 40,
  md: 80,
  lg: 120,
  xl: 160,
}

export const progressCircleVariants = cva('ds-progress-circle inline-flex flex-col items-center', {
  variants: {
    size: {
      sm: 'ds-progress-circle--sm',
      md: 'ds-progress-circle--md',
      lg: 'ds-progress-circle--lg',
      xl: 'ds-progress-circle--xl',
    },
  },
  defaultVariants: { size: 'md' },
})

export const progressCircleLabelVariants = cva('mt-2 text-center text-sm font-medium', {
  variants: {
    variant: {
      primary: 'text-[var(--ds-color-primary)]',
      success: 'text-[var(--ds-color-success)]',
      warning: 'text-[var(--ds-color-warning)]',
      danger: 'text-[var(--ds-color-danger)]',
      info: 'text-[var(--ds-color-info)]',
    },
  },
  defaultVariants: { variant: 'primary' },
})
