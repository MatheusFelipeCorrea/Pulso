import { cva } from 'class-variance-authority'

export const badgeVariants = cva('ds-badge', {
  variants: {
    variant: {
      default: 'ds-badge--default',
      primary: 'ds-badge--primary',
      success: 'ds-badge--success',
      warning: 'ds-badge--warning',
      danger: 'ds-badge--danger',
      info: 'ds-badge--info',
      neutral: 'ds-badge--neutral',
      cyan: 'ds-badge--cyan',
      orange: 'ds-badge--orange',
    },
    appearance: {
      soft: 'ds-badge--soft',
      outline: 'ds-badge--outline',
    },
    shape: {
      pill: 'ds-badge--pill',
      rounded: 'ds-badge--rounded',
    },
    size: {
      sm: 'ds-badge--sm',
      md: 'ds-badge--md',
      lg: 'ds-badge--lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    appearance: 'soft',
    shape: 'pill',
    size: 'md',
  },
})
