import { cva } from 'class-variance-authority'

/**
 * Button Variants usando CVA
 * 
 * 5 variantes: Primary, Secondary, Ghost, Danger, Success
 * 3 tamanhos: Small (sm), Medium (md), Large (lg)
 * 5 estados: Default, Hover, Active, Disabled, Loading
 */

export const buttonVariants = cva(
  // Base styles - aplicados a todos os botões
  [
    'relative inline-flex items-center justify-center gap-2',
    'w-auto max-w-none shrink-0',
    'font-semibold whitespace-nowrap',
    'rounded-[var(--ds-radius-md)]',
    'transition-all duration-[var(--ds-transition-fast)]',
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
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
      },

      // ============================================================
      // TAMANHOS (conforme protótipo: padding intrínseco por conteúdo)
      // sm: 32px / 12px / 8px 12px | md: 40px / 14px / 10px 16px | lg: 48px / 16px / 12px 24px
      // ============================================================
      size: {
        sm: 'h-8 min-h-8 px-3 text-xs leading-none',
        md: 'h-10 min-h-10 px-4 text-sm leading-none',
        lg: 'h-12 min-h-12 px-6 text-base leading-none',
      },

      // ============================================================
      // LARGURA COMPLETA
      // ============================================================
      fullWidth: {
        true: 'w-full',
      },
    },

    // Valores padrão
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)
