import { cva } from 'class-variance-authority'

export const errorStateRootVariants = cva('w-full', {
  variants: {
    variant: {
      fullpage: 'flex flex-col items-center justify-center text-center gap-3 p-8',
      inline:
        'flex flex-col gap-3 rounded-[var(--ds-radius-md)] border p-4 sm:flex-row sm:items-center bg-[var(--ds-color-error-inline-bg)] border-[var(--ds-color-error-inline-border)]',
      card: 'flex flex-col gap-4 rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)] p-5 sm:flex-row sm:items-start',
    },
    size: {
      default: '',
      compact: 'p-4 gap-2',
    },
  },
  defaultVariants: { variant: 'fullpage', size: 'default' },
})

export const errorStateIconWrapVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full bg-[var(--ds-color-error-surface)] text-[var(--ds-color-danger)]',
  {
    variants: {
      variant: {
        fullpage: 'h-[72px] w-[72px] [&_svg]:h-8 [&_svg]:w-8',
        inline: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
        card: 'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',
      },
      size: {
        default: '',
        compact: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: { variant: 'fullpage', size: 'default' },
  }
)
