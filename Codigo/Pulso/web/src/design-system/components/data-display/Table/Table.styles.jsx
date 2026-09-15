import { cva } from 'class-variance-authority'

export const tableWrapperVariants = cva('ds-table-wrapper', {
  variants: {
    density: {
      comfortable: 'ds-table-wrapper--comfortable',
      compact: 'ds-table-wrapper--compact',
    },
  },
  defaultVariants: { density: 'comfortable' },
})
