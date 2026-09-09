import { cva } from 'class-variance-authority'

/**
 * Button Variants usando CVA
 * 
 * 6 variantes: Primary, Secondary, Outline, Ghost, Danger, Success
 * 3 tamanhos: Small (sm), Medium (md), Large (lg)
 * 5 estados: Default, Hover, Active, Disabled, Loading
 */

export const buttonVariants = cva(
  [
    'focus:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
      },

      size: {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
      },

      fullWidth: {
        true: 'btn-full',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)
