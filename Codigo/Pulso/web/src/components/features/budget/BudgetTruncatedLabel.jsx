import { cn } from '@/design-system/utils/cn.js'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'

export function BudgetTruncatedLabel({ text, className, as: Tag = 'span' }) {
  if (!text) return null

  return (
    <Tooltip content={text} position="top" fullWidth wrapperClassName="budget-truncated-label-wrap">
      <Tag className={cn('budget-truncated-label', className)} tabIndex={0}>
        {text}
      </Tag>
    </Tooltip>
  )
}
