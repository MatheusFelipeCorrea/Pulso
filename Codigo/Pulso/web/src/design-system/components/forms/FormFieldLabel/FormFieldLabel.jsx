import { cn } from '../../../utils/cn.js'

/**
 * Label de campo com ícone colorido — padrão dos modais Pulso (lembrete, transação, VT, etc.)
 */
export function FormFieldLabel({
  icon: Icon,
  tone = 'purple',
  htmlFor,
  className,
  children,
}) {
  const Tag = htmlFor ? 'label' : 'span'

  return (
    <Tag
      htmlFor={htmlFor}
      className={cn('ds-form-field-label', `ds-form-field-label--${tone}`, className)}
    >
      {Icon ? (
        <Icon size={16} strokeWidth={2} aria-hidden className="ds-form-field-label__icon" />
      ) : null}
      <span>{children}</span>
    </Tag>
  )
}
