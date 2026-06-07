import { cva } from 'class-variance-authority'

export const pickerTriggerContainerVariants = cva('ds-picker-container', {
  variants: {
    open: {
      true: 'ds-picker-container--open',
      false: '',
    },
    error: {
      true: 'ds-picker-container--error',
      false: '',
    },
    disabled: {
      true: 'ds-picker-container--disabled',
      false: '',
    },
  },
  defaultVariants: { open: false, error: false, disabled: false },
})

export const pickerTriggerButtonVariants = cva('ds-picker-trigger')

export const pickerDropdownVariants = cva('ds-picker-dropdown')

export const dayCellVariants = cva('ds-picker-day', {
  variants: {
    variant: {
      default: 'ds-picker-day--default',
      outside: 'ds-picker-day--outside',
      disabled: 'ds-picker-day--disabled',
      selected: 'ds-picker-day--selected',
      today: 'ds-picker-day--today',
      inRange: 'ds-picker-day--in-range',
      rangeStart: 'ds-picker-day--range-start',
      rangeEnd: 'ds-picker-day--range-end',
      rangeSingle: 'ds-picker-day--range-single',
    },
    interactive: {
      true: 'ds-picker-day--interactive',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', interactive: true },
})

export const monthCellVariants = cva('ds-month-cell', {
  variants: {
    variant: {
      default: '',
      selected: '',
      current: '',
      disabled: '',
    },
  },
  defaultVariants: { variant: 'default' },
})
