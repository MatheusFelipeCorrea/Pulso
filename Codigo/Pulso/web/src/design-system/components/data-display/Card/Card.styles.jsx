import { cva } from 'class-variance-authority'

export const cardVariants = cva('ds-card flex flex-col overflow-hidden', {
  variants: {
    variant: {
      default: 'ds-card--default',
      outlined: 'ds-card--outlined',
      elevated: 'ds-card--elevated',
      ghost: 'ds-card--ghost',
      accent: 'ds-card--accent',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    },
    interactive: {
      true: 'ds-card--interactive cursor-pointer',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
})

export const ACCENT_COLORS = {
  primary: 'var(--ds-color-primary)',
  success: 'var(--ds-color-success)',
  warning: 'var(--ds-color-warning)',
  danger: 'var(--ds-color-danger)',
  info: 'var(--ds-color-info)',
}
