import { cn } from '../../../utils/cn.js'
import { Avatar } from './Avatar.jsx'

const OVERLAP = {
  xs: '-ml-1.5',
  sm: '-ml-2',
  md: '-ml-2.5',
  lg: '-ml-3',
  xl: '-ml-4',
}

/**
 * AvatarGroup — avatares sobrepostos com contador +N
 */
export const AvatarGroup = ({
  avatars = [],
  max = 4,
  size = 'md',
  className,
}) => {
  const visible = avatars.slice(0, max)
  const extra = avatars.length - max

  return (
    <div className={cn('flex items-center', className)} role="group">
      {visible.map((item, i) => (
        <div
          key={item.id ?? item.name ?? i}
          className={cn(
            'rounded-full ring-2 ring-[var(--ds-color-background)]',
            i > 0 && OVERLAP[size]
          )}
          style={{ zIndex: visible.length - i }}
        >
          <Avatar
            src={item.src}
            name={item.name}
            size={size}
            status={item.status}
          />
        </div>
      ))}
      {extra > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[var(--ds-color-surface-elevated)] font-medium text-[var(--ds-color-text-secondary)] ring-2 ring-[var(--ds-color-background)]',
            OVERLAP[size],
            size === 'xs' && 'h-6 w-6 text-[10px]',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-16 w-16 text-lg',
            size === 'xl' && 'h-24 w-24 text-xl'
          )}
          style={{ zIndex: 0 }}
          aria-label={`Mais ${extra} membros`}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
