import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'ds-badge inline-flex max-w-full items-center gap-1.5 font-semibold leading-none',
  {
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
        pill: 'rounded-full',
        rounded: 'rounded-md',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs [&_svg]:size-3',
        md: 'px-2.5 py-1 text-xs [&_svg]:size-3.5',
        lg: 'px-3 py-1.5 text-sm [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      appearance: 'soft',
      shape: 'pill',
      size: 'md',
    },
  }
)
