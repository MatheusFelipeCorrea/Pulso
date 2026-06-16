import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/design-system/utils/cn.js'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'

export function BudgetTruncatedLabel({
  text,
  className,
  as: Tag = 'span',
  position = 'top',
}) {
  const ref = useRef(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const checkTruncation = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth + 1)
    }

    checkTruncation()
    const frame = requestAnimationFrame(checkTruncation)

    const observer = new ResizeObserver(checkTruncation)
    observer.observe(el)

    const parent = el.parentElement
    if (parent) observer.observe(parent)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [text])

  if (!text) return null

  return (
    <Tooltip
      content={text}
      position={position}
      fullWidth
      disabled={!isTruncated}
      wrapperClassName="budget-truncated-label-wrap min-w-0 w-full"
    >
      <Tag
        ref={ref}
        className={cn('budget-truncated-label', className)}
        tabIndex={isTruncated ? 0 : undefined}
      >
        {text}
      </Tag>
    </Tooltip>
  )
}
