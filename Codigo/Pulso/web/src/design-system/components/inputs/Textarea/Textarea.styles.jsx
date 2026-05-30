import { cva } from 'class-variance-authority'

/** Container do textarea — borda e fundo no wrapper (textarea interno fica transparente) */
export const textareaContainerVariants = cva(
  [
    'ds-textarea-container relative w-full overflow-hidden',
    'rounded-[var(--ds-radius-md)] border',
    'bg-[var(--ds-color-textarea-bg)]',
    'transition-[border-color,box-shadow] duration-[var(--ds-transition-fast)]',
  ],
  {
    variants: {
      focused: {
        true: [
          'border-[var(--ds-color-input-focus)]',
          'shadow-[0_0_0_1px_var(--ds-color-input-focus)]',
        ],
        false: 'border-[var(--ds-color-textarea-border)]',
      },
      error: {
        true: 'border-[var(--ds-color-danger)] shadow-none',
        false: '',
      },
      disabled: {
        true: 'cursor-not-allowed bg-[var(--ds-color-input-disabled)] opacity-50',
        false: '',
      },
      hoverable: {
        true: 'hover:border-[var(--ds-color-text-secondary)]',
        false: '',
      },
    },
    compoundVariants: [
      { error: true, class: 'border-[var(--ds-color-danger)]' },
      { focused: true, error: false, class: 'hover:border-[var(--ds-color-input-focus)]' },
      { disabled: true, class: 'hover:border-[var(--ds-color-textarea-border)]' },
    ],
    defaultVariants: {
      focused: false,
      error: false,
      disabled: false,
      hoverable: true,
    },
  }
)

/** Campo interno — herda reset transparente de base.css */
export const textareaFieldVariants = cva(
  [
    'ds-textarea-field block w-full min-h-[100px] max-h-[300px]',
    'bg-transparent px-4 py-3 text-sm leading-relaxed',
    'text-[var(--ds-color-text)]',
    'placeholder:text-[var(--ds-color-placeholder)]',
    'outline-none focus:outline-none focus-visible:outline-none',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        both: 'resize',
      },
      hasCounter: {
        true: 'pb-8',
        false: '',
      },
    },
    defaultVariants: {
      resize: 'vertical',
      hasCounter: false,
    },
  }
)

/** Label do textarea — texto primário no estado default (protótipo) */
export const textareaLabelVariants = cva(
  'text-sm font-medium transition-colors duration-[var(--ds-transition-fast)]',
  {
    variants: {
      state: {
        default: 'text-[var(--ds-color-text)]',
        focused: 'text-[var(--ds-color-primary)]',
        error: 'text-[var(--ds-color-danger)]',
        disabled: 'text-[var(--ds-color-text-secondary)] opacity-50',
      },
    },
    defaultVariants: { state: 'default' },
  }
)
