import { cva } from 'class-variance-authority'

export const modalOverlayVariants = cva(
  'fixed inset-0 z-[var(--ds-z-modal)] overflow-y-auto bg-[var(--ds-color-overlay)] p-4 sm:p-6 animate-[fade-in_var(--ds-transition-fast)_ease]'
)

export const modalContentVariants = cva(
  [
    'relative my-auto w-full',
    'flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden',
    'rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border)]',
    'bg-[var(--ds-color-modal-bg)] shadow-[var(--ds-shadow-lg)]',
    'animate-[scale-in_var(--ds-transition-normal)_ease]',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-[600px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)
