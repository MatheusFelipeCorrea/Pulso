import { Badge } from '../../design-system/components/data-display/Badge/Badge.jsx'
import { cn } from '../../design-system/utils/cn.js'
import { getBadgeDefinition, normalizeBadgeDefinition } from './badgeCatalog.js'
import { resolveBadgeIcon } from './iconRegistry.jsx'

/**
 * PulsoBadge — badge de domínio com ícone associado por catálogo ou definição custom.
 *
 * @example
 * // Semântica do catálogo
 * <PulsoBadge kind="recurso.va" />
 *
 * @example
 * // Criada pelo usuário / API (ícone + cor como em Categoria)
 * <PulsoBadge definition={{ label: 'Side project', icon: 'Laptop', color: '#06B6D4' }} />
 *
 * @example
 * // Props diretas (mesmo contrato que definition)
 * <PulsoBadge label="Freela" icon="Briefcase" variant="cyan" />
 */
export const PulsoBadge = ({
  kind,
  definition,
  label,
  icon,
  variant,
  shape,
  appearance,
  color,
  size = 'md',
  className,
  ...badgeProps
}) => {
  const resolved = normalizeBadgeDefinition(
    definition ?? kind ?? { label, icon, variant, shape, appearance, color }
  )

  if (!resolved?.label) return null

  const iconNode = resolveBadgeIcon(resolved.icon, { size })
  const customStyle = resolved.color
    ? buildCustomColorStyle(resolved.color, appearance ?? badgeProps.appearance ?? 'soft')
    : undefined

  return (
    <Badge
      variant={resolved.variant ?? 'default'}
      shape={resolved.shape ?? 'pill'}
      appearance={resolved.appearance ?? appearance ?? 'soft'}
      size={size}
      icon={iconNode}
      className={cn(resolved.color && 'ds-badge--custom', className)}
      style={customStyle}
      {...badgeProps}
    >
      {resolved.label}
    </Badge>
  )
}

function buildCustomColorStyle(hex, appearance) {
  if (appearance === 'outline') {
    return {
      background: 'transparent',
      color: hex,
      borderColor: `color-mix(in srgb, ${hex} 45%, transparent)`,
    }
  }
  return {
    background: `color-mix(in srgb, ${hex} 14%, transparent)`,
    color: hex,
    borderColor: 'transparent',
  }
}

/** Atalho: só o kind do catálogo */
export function PulsoBadgeByKind({ kind, ...props }) {
  const def = getBadgeDefinition(kind)
  if (!def) return null
  return <PulsoBadge definition={{ ...def, kind }} {...props} />
}
