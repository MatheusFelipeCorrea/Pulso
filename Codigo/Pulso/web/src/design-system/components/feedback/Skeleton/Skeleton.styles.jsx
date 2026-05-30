import { cva } from 'class-variance-authority'

/**
 * Skeleton Variants
 *
 * Placeholders animados com shimmer para estados de loading.
 * variant: text | title | avatar | card | button
 */
export const skeletonVariants = cva('ds-skeleton', {
  variants: {
    variant: {
      text: 'ds-skeleton--text',
      title: 'ds-skeleton--title',
      avatar: 'ds-skeleton--avatar',
      card: 'ds-skeleton--card',
      button: 'ds-skeleton--button',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
})
