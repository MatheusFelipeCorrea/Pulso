import { cva } from 'class-variance-authority'

/**
 * IconButton Variants
 *
 * Sem label: círculo fixo (32/40/48px)
 * Com label: pílula com ícone + texto (padding 8px 16px, gap 6px)
 */
export const iconButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'rounded-full',
    'transition-all duration-[var(--ds-transition-fast)]',
    'focus:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'font-semibold whitespace-nowrap',
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
        sm: '',
        md: '',
        lg: '',
      },
      labeled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Circular — só ícone
      { labeled: false, size: 'sm', class: 'w-8 h-8 shrink-0' },
      { labeled: false, size: 'md', class: 'w-10 h-10 shrink-0' },
      { labeled: false, size: 'lg', class: 'w-12 h-12 shrink-0' },
      // Pílula — ícone + label
      { labeled: true, size: 'sm', class: 'h-8 px-4 gap-1.5 text-xs' },
      { labeled: true, size: 'md', class: 'h-10 px-4 gap-1.5 text-sm' },
      { labeled: true, size: 'lg', class: 'h-12 px-6 gap-1.5 text-base' },
    ],
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
      labeled: false,
    },
  }
)
