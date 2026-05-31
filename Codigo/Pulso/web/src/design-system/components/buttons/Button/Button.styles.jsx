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
    'inline-flex items-center justify-center gap-2',
    'font-medium',
    'rounded-lg',
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
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger',
        success: 'btn-success',
      },

      // ============================================================
      // TAMANHOS (padding horizontal fixo de 17px para todos)
      // ============================================================
      size: {
        sm: 'h-8 px-[17px] text-sm',     // 32px altura, 17px lateral
        md: 'h-10 px-[17px] text-base',  // 40px altura, 17px lateral (padrão)
        lg: 'h-12 px-[17px] text-lg',    // 48px altura, 17px lateral
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
