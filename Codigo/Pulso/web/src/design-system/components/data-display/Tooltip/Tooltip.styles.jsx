import { cva } from 'class-variance-authority'

/**
 * Tooltip Variants usando CVA
 * 
 * Dica contextual que aparece ao passar o mouse ou focar
 * Suporta 4 posições e tema dark/light
 */

export const tooltipVariants = cva(
  // Base styles
  [
    'absolute',
    'z-[var(--ds-z-tooltip)]',
    'px-3 py-2',
    'text-sm',
    'font-medium',
    'rounded-md',
    'shadow-lg',
    'pointer-events-none',
    'whitespace-nowrap',
    'opacity-0',
    'transition-opacity',
    'duration-[var(--ds-transition-fast)]',
    'bg-[var(--ds-color-tooltip-bg)]',
    'text-[var(--ds-color-tooltip-text)]',
  ],
  {
    variants: {
      // ============================================================
      // POSIÇÕES
      // ============================================================
      position: {
        top: [
          'bottom-full left-1/2 -translate-x-1/2 mb-2',
          'after:content-[""]',
          'after:absolute',
          'after:top-full',
          'after:left-1/2',
          'after:-translate-x-1/2',
          'after:border-4',
          'after:border-transparent',
          'after:border-t-[var(--ds-color-tooltip-bg)]',
        ],
        bottom: [
          'top-full left-1/2 -translate-x-1/2 mt-2',
          'after:content-[""]',
          'after:absolute',
          'after:bottom-full',
          'after:left-1/2',
          'after:-translate-x-1/2',
          'after:border-4',
          'after:border-transparent',
          'after:border-b-[var(--ds-color-tooltip-bg)]',
        ],
        left: [
          'right-full top-1/2 -translate-y-1/2 mr-2',
          'after:content-[""]',
          'after:absolute',
          'after:left-full',
          'after:top-1/2',
          'after:-translate-y-1/2',
          'after:border-4',
          'after:border-transparent',
          'after:border-l-[var(--ds-color-tooltip-bg)]',
        ],
        right: [
          'left-full top-1/2 -translate-y-1/2 ml-2',
          'after:content-[""]',
          'after:absolute',
          'after:right-full',
          'after:top-1/2',
          'after:-translate-y-1/2',
          'after:border-4',
          'after:border-transparent',
          'after:border-r-[var(--ds-color-tooltip-bg)]',
        ],
      },

      // ============================================================
      // ESTADO VISÍVEL
      // ============================================================
      visible: {
        true: 'opacity-100',
        false: 'opacity-0',
      },
    },

    // Valores padrão
    defaultVariants: {
      position: 'top',
      visible: false,
    },
  }
)

export const tooltipWrapperVariants = cva(
  'relative inline-flex',
  {
    variants: {
      // Se o wrapper deve ocupar largura total
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      fullWidth: false,
    },
  }
)
