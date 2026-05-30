import { cva } from 'class-variance-authority'

export const tabsListVariants = cva('ds-tabs__list', {
  variants: {
    variant: {
      underline: 'ds-tabs__list--underline',
      pill: 'ds-tabs__list--pill',
    },
    orientation: {
      horizontal: 'ds-tabs__list--horizontal',
      vertical: 'ds-tabs__list--vertical',
    },
    size: {
      sm: 'ds-tabs__list--sm',
      md: 'ds-tabs__list--md',
    },
  },
  defaultVariants: {
    variant: 'underline',
    orientation: 'horizontal',
    size: 'md',
  },
})

export const tabButtonVariants = cva('ds-tab', {
  variants: {
    variant: {
      underline: 'ds-tab--underline',
      pill: 'ds-tab--pill',
    },
    orientation: {
      horizontal: 'ds-tab--horizontal',
      vertical: 'ds-tab--vertical',
    },
    active: {
      true: 'ds-tab--active',
      false: '',
    },
    disabled: {
      true: 'ds-tab--disabled',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'underline',
    orientation: 'horizontal',
    active: false,
    disabled: false,
  },
})
