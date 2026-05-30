import { cn } from '../../../../design-system/utils/cn.js'
import { formatCurrency } from '../../../../design-system/utils/formatCurrency.js'
import { Skeleton } from '../../../../design-system/components/feedback/Skeleton/Skeleton.jsx'
import { getResourceConfig } from './resourceConfig.js'

/**
 * ResourceCard — card de saldo por tipo de recurso financeiro (Pulso)
 *
 * @param {object} props
 * @param {import('./resourceConfig.js').ResourceType} props.type
 * @param {number} props.value
 * @param {string} [props.subtitle]
 * @param {'available' | 'suggestion' | 'growth'} [props.subtitleDot='available']
 * @param {function} [props.onClick]
 * @param {boolean} [props.loading]
 * @param {string} [props.className]
 */
export const ResourceCard = ({
  type,
  value,
  subtitle = 'Disponível',
  subtitleDot = 'available',
  onClick,
  loading = false,
  className,
}) => {
  const config = getResourceConfig(type)
  const Icon = config.icon
  const interactive = typeof onClick === 'function'
  const filled = config.filled === true

  const cardProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(e)
          }
        },
      }
    : {}

  return (
    <article
      {...cardProps}
      className={cn(
        'pulso-resource-card',
        interactive && 'pulso-resource-card--interactive',
        filled && 'pulso-resource-card--filled',
        className
      )}
      style={{ '--pulso-resource-color': `var(${config.colorVar})` }}
      data-type={type}
    >
      <div className="pulso-resource-card__icon-wrap" aria-hidden="true">
        <Icon size={24} strokeWidth={2} />
      </div>

      <p className="pulso-resource-card__label">{config.label}</p>

      {loading ? (
        <Skeleton variant="title" width="60%" className="mt-2" />
      ) : (
        <p className="pulso-resource-card__value">{formatCurrency(value)}</p>
      )}

      {subtitle && !loading && (
        <div className="pulso-resource-card__subtitle">
          <span className="pulso-resource-card__dot" data-dot={subtitleDot} aria-hidden="true" />
          <span
            className={cn(
              'pulso-resource-card__subtitle-text',
              subtitleDot === 'growth' && 'pulso-resource-card__subtitle-text--growth'
            )}
          >
            {subtitle}
          </span>
        </div>
      )}
    </article>
  )
}
