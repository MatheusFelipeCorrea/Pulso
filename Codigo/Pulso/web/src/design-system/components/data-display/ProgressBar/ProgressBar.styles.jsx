import { cva } from 'class-variance-authority'

export const progressBarTrackVariants = cva('ds-progress__track w-full overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'ds-progress__track--sm',
      md: 'ds-progress__track--md',
      lg: 'ds-progress__track--lg',
    },
  },
  defaultVariants: { size: 'md' },
})

export const progressBarFillVariants = cva('ds-progress__fill h-full rounded-full transition-[width] duration-300 ease-out', {
  variants: {
    variant: {
      primary: 'ds-progress__fill--primary',
      success: 'ds-progress__fill--success',
      warning: 'ds-progress__fill--warning',
      danger: 'ds-progress__fill--danger',
      info: 'ds-progress__fill--info',
    },
  },
  defaultVariants: { variant: 'primary' },
})
