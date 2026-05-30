import { cva } from 'class-variance-authority'

export const modalOverlayVariants = cva(
  'fixed inset-0 z-[var(--ds-z-modal)] flex items-center justify-center bg-[var(--ds-color-overlay)] p-4 animate-[fade-in_var(--ds-transition-fast)_ease]'
)

export const modalContentVariants = cva(
  [
    'relative w-full rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border)]',
    'bg-[var(--ds-color-modal-bg)] shadow-[var(--ds-shadow-lg)]',
    'animate-[scale-in_var(--ds-transition-normal)_ease]',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: { size: 'md' },
  }
)
