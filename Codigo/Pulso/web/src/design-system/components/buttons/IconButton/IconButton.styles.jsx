import { cva } from 'class-variance-authority'

/**
 * IconButton Variants usando CVA
 * 
 * Botão circular apenas com ícone (sem texto)
 * Mesmas 5 variantes e 3 tamanhos do Button padrão
 */

export const iconButtonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'rounded-full',
    'transition-all',
    'focus:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      // ============================================================
      // VARIANTES DE TIPO (usando classes customizadas do base.css)
      // ============================================================
      variant: {
        primary: 'iconbtn-primary',
        secondary: 'iconbtn-secondary',
        ghost: 'iconbtn-ghost',
        danger: 'iconbtn-danger',
        success: 'iconbtn-success',
      },

      // ============================================================
      // TAMANHOS (quadrados perfeitos)
      // ============================================================
      size: {
        sm: 'w-8 h-8',      // 32px
        md: 'w-10 h-10',    // 40px (padrão)
        lg: 'w-12 h-12',    // 48px
      },
    },

    // Valores padrão
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
