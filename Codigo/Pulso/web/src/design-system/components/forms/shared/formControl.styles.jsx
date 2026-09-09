import { cva } from 'class-variance-authority'

export const formLabelVariants = cva('text-sm font-medium text-[var(--ds-color-text)]')
export const formDescriptionVariants = cva('text-xs text-[var(--ds-color-text-secondary)]')
export const formErrorVariants = cva('text-xs text-[var(--ds-color-danger)]')

export const formControlRowVariants = cva('flex gap-3', {
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
    },
  },
  defaultVariants: { align: 'start' },
})
