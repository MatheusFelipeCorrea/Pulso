import { cva } from 'class-variance-authority'

/** Container do trigger */
export const selectTriggerContainerVariants = cva('ds-select-container', {
  variants: {
    open: {
      true: 'ds-select-container--open',
      false: '',
    },
    error: {
      true: 'ds-select-container--error',
      false: '',
    },
    disabled: {
      true: 'ds-select-container--disabled',
      false: '',
    },
    multiline: {
      true: 'ds-select-container--multiline',
      false: '',
    },
  },
  defaultVariants: {
    open: false,
    error: false,
    disabled: false,
    multiline: false,
  },
})

/** Botão interno do trigger */
export const selectTriggerButtonVariants = cva('ds-select-trigger', {
  variants: {
    multiline: {
      true: 'ds-select-trigger--multiline',
      false: '',
    },
  },
  defaultVariants: { multiline: false },
})

/** @deprecated use selectTriggerContainerVariants */
export const selectTriggerVariants = selectTriggerContainerVariants

export const selectDropdownVariants = cva('ds-select-dropdown')

export const selectOptionVariants = cva('ds-select-option', {
  variants: {
    selected: {
      true: 'ds-select-option--selected',
      false: '',
    },
    highlighted: {
      true: 'ds-select-option--highlighted',
      false: '',
    },
  },
  defaultVariants: { selected: false, highlighted: false },
})
