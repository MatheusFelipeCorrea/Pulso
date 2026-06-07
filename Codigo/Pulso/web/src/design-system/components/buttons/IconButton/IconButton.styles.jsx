import { cva } from 'class-variance-authority'

/**
 * IconButton Variants usando CVA
 * 
 * Botão circular apenas com ícone (sem texto)
 * Mesmas 5 variantes e 3 tamanhos do Button padrão
 */

export const iconButtonVariants = cva(
  [
    'focus:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'iconbtn-primary',
        secondary: 'iconbtn-secondary',
        ghost: 'iconbtn-ghost',
        danger: 'iconbtn-danger',
        success: 'iconbtn-success',
      },

      size: {
        sm: 'iconbtn-sm',
        md: 'iconbtn-md',
        lg: 'iconbtn-lg',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
