import { cva } from 'class-variance-authority'

/**
 * Spinner Variants usando CVA
 * 
 * Indicador de loading circular animado
 * Suporta 4 tamanhos e múltiplas variantes de cor
 */

export const spinnerVariants = cva(
  // Base styles
  [
    'inline-block',
    'animate-spin',
    'rounded-full',
    'border-2',
    'border-current',
    'border-t-transparent',
  ],
  {
    variants: {
      // ============================================================
      // TAMANHOS
      // ============================================================
      size: {
        xs: 'w-4 h-4',      // 16px
        sm: 'w-5 h-5',      // 20px
        md: 'w-6 h-6',      // 24px
        lg: 'w-8 h-8',      // 32px
        xl: 'w-12 h-12',    // 48px
      },

      // ============================================================
      // VARIANTES DE COR
      // ============================================================
      variant: {
        primary: 'text-[var(--ds-color-primary)]',
        white: 'text-white',
        current: 'text-current',
        success: 'text-[var(--ds-color-success)]',
        danger: 'text-[var(--ds-color-danger)]',
        warning: 'text-[var(--ds-color-warning)]',
      },
    },

    // Valores padrão
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
)
