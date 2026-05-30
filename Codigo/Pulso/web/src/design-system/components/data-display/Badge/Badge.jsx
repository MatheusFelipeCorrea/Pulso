import { isValidElement } from 'react'
import { cn } from '../../../utils/cn.js'
import { badgeVariants } from './Badge.styles.jsx'

/**
 * Badge — tag semântica (somente leitura).
 *
 * O ícone é sempre `ReactNode` (elemento ou componente já instanciado).
 * Cores/categorias Pulso ficam em `src/components/badges/` via catálogo + registro.
 */
export const Badge = ({
  children,
  variant = 'default',
  appearance = 'soft',
  shape = 'pill',
  size = 'md',
  icon,
  leftIcon,
  dot = false,
  className,
  style,
  ...props
}) => {
  const iconNode = resolveIconNode(leftIcon ?? icon, size)

  return (
    <span
      className={cn(badgeVariants({ variant, appearance, shape, size }), className)}
      style={style}
      {...props}
    >
      {dot && (
        <span
          className="size-1.5 shrink-0 rounded-full bg-current"
          aria-hidden
        />
      )}
      {iconNode}
      {children != null && children !== '' && (
        <span className="truncate">{children}</span>
      )}
    </span>
  )
}

/** Aceita ReactNode ou componente Lucide (ex.: icon={DollarSign}) */
function resolveIconNode(icon, size) {
  if (!icon) return null

  if (isValidElement(icon)) {
    return <span className="inline-flex shrink-0 items-center">{icon}</span>
  }

  if (typeof icon === 'function') {
    const Icon = icon
    const dim = size === 'lg' ? 16 : size === 'sm' ? 12 : 14
    return (
      <span className="inline-flex shrink-0 items-center" aria-hidden>
        <Icon size={dim} />
      </span>
    )
  }

  return <span className="inline-flex shrink-0 items-center">{icon}</span>
}
