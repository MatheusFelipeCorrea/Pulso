import { cn } from '@/design-system/utils/cn.js'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'

/** Label de campo VT — delega ao FormFieldLabel do design system */
export function VtFieldLabel(props) {
  return <FormFieldLabel {...props} />
}

export function VtFieldHint({ icon: Icon, className, children }) {
  return (
    <p className={cn('vt-field-hint', className)}>
      {Icon ? <Icon size={14} strokeWidth={2} aria-hidden /> : null}
      <span>{children}</span>
    </p>
  )
}
