import { cn } from '@/design-system/utils/cn.js'

/** Label de campo VT com ícone colorido (protótipo Pulso) */
export function VtFieldLabel({ icon: Icon, tone = 'purple', htmlFor, className, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('vt-field-label', `vt-field-label--${tone}`, className)}
    >
      {Icon ? <Icon size={16} strokeWidth={2} aria-hidden className="vt-field-label__icon" /> : null}
      <span>{children}</span>
    </label>
  )
}

export function VtFieldHint({ icon: Icon, className, children }) {
  return (
    <p className={cn('vt-field-hint', className)}>
      {Icon ? <Icon size={14} strokeWidth={2} aria-hidden /> : null}
      <span>{children}</span>
    </p>
  )
}
