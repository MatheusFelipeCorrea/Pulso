import { cn } from '../../../utils/cn.js'
import { cardVariants, ACCENT_COLORS } from './Card.styles.jsx'

/**
 * Card — container com header, body e footer opcionais
 */
export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  accentColor = 'primary',
  interactive = false,
  onClick,
  className,
  style,
  ...props
}) => {
  const isAccent = variant === 'accent'
  const accentStyle = isAccent
    ? { '--ds-card-accent': ACCENT_COLORS[accentColor] ?? accentColor, ...style }
    : style

  return (
    <div
      role={onClick || interactive ? 'button' : undefined}
      tabIndex={onClick || interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(e)
              }
            }
          : undefined
      }
      className={cn(
        cardVariants({ variant, padding: variant === 'ghost' ? 'none' : padding, interactive: interactive || !!onClick }),
        className
      )}
      style={accentStyle}
      data-accent={isAccent ? accentColor : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className, action, bordered = true }) => (
  <div
    className={cn(
      'flex items-start justify-between gap-3 px-5 pt-5',
      bordered && 'border-b border-[var(--ds-color-border)] pb-4',
      className
    )}
  >
    <div className="min-w-0 flex-1">{children}</div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

export const CardBody = ({ children, className, noPadding }) => (
  <div className={cn(!noPadding && 'px-5 py-4', className)}>{children}</div>
)

export const CardFooter = ({ children, className, bordered = true }) => (
  <div
    className={cn(
      'flex items-center justify-between gap-3 px-5 pb-5 pt-4',
      bordered && 'border-t border-[var(--ds-color-border)]',
      className
    )}
  >
    {children}
  </div>
)
