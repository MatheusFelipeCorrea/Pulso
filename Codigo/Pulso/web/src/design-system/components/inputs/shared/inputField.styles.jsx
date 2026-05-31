import { cva } from 'class-variance-authority'

/** Wrapper externo do campo */
export const inputWrapperVariants = cva('ds-input-wrapper')

/** Label acima do campo */
export const inputLabelVariants = cva('ds-input-label', {
  variants: {
    state: {
      default: 'ds-input-label--default',
      focused: 'ds-input-label--focused',
      error: 'ds-input-label--error',
      disabled: 'ds-input-label--disabled',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

/** Container do input — estilos em components.css (.ds-input-container) */
export const inputContainerVariants = cva('ds-input-container', {
  variants: {
    focused: {
      true: '',
      false: '',
    },
    error: {
      true: 'ds-input-container--error',
      false: '',
    },
    disabled: {
      true: 'ds-input-container--disabled',
      false: '',
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
})

/** Mensagem de erro / helper abaixo */
export const inputHelperVariants = cva('ds-input-helper', {
  variants: {
    type: {
      error: 'ds-input-helper--error',
      helper: 'ds-input-helper--muted',
    },
  },
  defaultVariants: {
    type: 'helper',
  },
})
