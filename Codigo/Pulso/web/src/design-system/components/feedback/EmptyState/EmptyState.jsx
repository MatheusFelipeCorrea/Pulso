import { Inbox, ArrowRight } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Button } from '../../buttons/Button/Button.jsx'

const EmptyLinkAction = ({ label, onClick }) => (
  <button type="button" onClick={onClick} className="ds-empty-link-action">
    <span>{label}</span>
    <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
  </button>
)

const EmptyIconCircle = ({ children }) => (
  <div className="ds-empty-icon-wrap ds-empty-icon-wrap--circle">{children}</div>
)

const ListRow = ({ icon, title, linkAction, compact = false }) => (
  <div className={cn('ds-empty-list__row', compact && 'ds-empty-list__row--compact')}>
    <EmptyIconCircle>{icon}</EmptyIconCircle>
    <p className="ds-empty-list__text">{title}</p>
    {linkAction && <EmptyLinkAction label={linkAction.label} onClick={linkAction.onClick} />}
  </div>
)

/**
 * EmptyState — estados vazios conforme protótipo Pulso
 *
 * variant:
 * - default — centralizado com ilustração
 * - inline-list — várias linhas com divisor (dentro de card)
 * - rows — linhas compactas (variações rápidas)
 * - suggestion — ilustração à esquerda + cards horizontais
 */
export const EmptyState = ({
  variant = 'default',
  icon,
  title = 'Nenhum item encontrado',
  description,
  action,
  secondaryAction,
  linkAction,
  items = [],
  suggestions = [],
  suggestionHeading = 'Que tal começar agora?',
  size = 'default',
  bordered = false,
  className,
}) => {
  const iconNode = icon ?? <Inbox strokeWidth={1.5} />

  const renderAction = (act, defaultVariant = 'primary') => {
    if (!act) return null
    return (
      <Button
        variant={act.variant ?? defaultVariant}
        size={size === 'compact' ? 'sm' : 'md'}
        onClick={act.onClick}
        leftIcon={act.leftIcon}
      >
        {act.label}
      </Button>
    )
  }

  if (variant === 'inline-list') {
    return (
      <div className={cn('ds-empty-list', className)}>
        {items.map((item, index) => (
          <ListRow
            key={`${item.title}-${index}`}
            icon={item.icon}
            title={item.title}
            linkAction={item.linkAction}
          />
        ))}
      </div>
    )
  }

  if (variant === 'rows') {
    return (
      <div className={cn('ds-empty-list ds-empty-list--rows', className)}>
        {items.map((item, index) => (
          <ListRow
            key={`${item.title}-${index}`}
            icon={item.icon}
            title={item.title}
            linkAction={item.linkAction}
            compact
          />
        ))}
      </div>
    )
  }

  if (variant === 'suggestion') {
    return (
      <div className={cn('ds-empty-suggestion', className)}>
        <div className="ds-empty-suggestion__main">
          <div className="ds-empty-suggestion__illus">
            <div className="ds-empty-illustration ds-empty-illustration--hero">{iconNode}</div>
          </div>
          <div className="ds-empty-suggestion__content">
            <h3 className="ds-empty-suggestion__title">{title}</h3>
            {description && <p className="ds-empty-suggestion__desc">{description}</p>}
            {suggestions.length > 0 && (
              <>
                <p className="ds-empty-suggestion__heading">{suggestionHeading}</p>
                <div className="ds-empty-suggestion__cards">
                  {suggestions.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={item.onClick}
                      className="ds-empty-suggestion-card"
                    >
                      {item.icon && (
                        <span className="ds-empty-suggestion-card__icon">{item.icon}</span>
                      )}
                      <span className="ds-empty-suggestion-card__content">
                        <span className="ds-empty-suggestion-card__title">{item.title}</span>
                        {item.description && (
                          <span className="ds-empty-suggestion-card__desc">{item.description}</span>
                        )}
                      </span>
                      <ArrowRight
                        size={16}
                        className="ds-empty-suggestion-card__arrow shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {action && (
          <div className="ds-empty-suggestion__footer">{renderAction(action)}</div>
        )}
      </div>
    )
  }

  const isCompact = size === 'compact'

  return (
    <div
      className={cn(
        'ds-empty-default',
        bordered && 'ds-empty-default--bordered',
        isCompact && 'ds-empty-default--compact',
        className
      )}
    >
      <div
        className={cn(
          'ds-empty-illustration',
          isCompact ? 'ds-empty-illustration--md' : 'ds-empty-illustration--hero'
        )}
      >
        {iconNode}
      </div>
      <h3 className="ds-empty-default__title">{title}</h3>
      {description && <p className="ds-empty-default__desc">{description}</p>}
      {(action || secondaryAction) && (
        <div className="ds-empty-default__actions">
          {renderAction(action)}
          {renderAction(secondaryAction, 'secondary')}
        </div>
      )}
      {linkAction && !action && !secondaryAction && (
        <EmptyLinkAction label={linkAction.label} onClick={linkAction.onClick} />
      )}
    </div>
  )
}
