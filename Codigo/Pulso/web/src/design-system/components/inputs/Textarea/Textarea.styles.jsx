import { cva } from 'class-variance-authority'

/** Container do textarea — borda e fundo no wrapper (textarea interno fica transparente) */
export const textareaContainerVariants = cva('ds-textarea-container', {
  variants: {
    focused: {
      true: 'ds-textarea-container--focused',
      false: '',
    },
    error: {
      true: 'ds-textarea-container--error',
      false: '',
    },
    disabled: {
      true: 'ds-textarea-container--disabled',
      false: '',
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
})

/** Campo interno — herda reset transparente de base.css */
export const textareaFieldVariants = cva('ds-textarea-field', {
  variants: {
    resize: {
      none: 'ds-textarea-field--resize-none',
      vertical: 'ds-textarea-field--resize-vertical',
      both: 'ds-textarea-field--resize-both',
    },
    hasCounter: {
      true: 'ds-textarea-field--has-counter',
      false: '',
    },
  },
  defaultVariants: {
    resize: 'vertical',
    hasCounter: false,
  },
})

/** Label do textarea — reutiliza os estados semânticos de .ds-input-label */
export const textareaLabelVariants = cva('ds-input-label', {
  variants: {
    state: {
      default: 'ds-input-label--default',
      focused: 'ds-input-label--focused',
      error: 'ds-input-label--error',
      disabled: 'ds-input-label--disabled',
    },
  },
  defaultVariants: { state: 'default' },
})
