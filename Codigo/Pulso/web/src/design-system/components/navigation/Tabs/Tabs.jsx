import { useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn.js'
import { tabsListVariants, tabButtonVariants } from './Tabs.styles.jsx'

/**
 * Tabs — navegação por abas (controlado)
 */
export const Tabs = ({
  tabs = [],
  activeKey,
  onChange,
  variant = 'underline',
  orientation = 'horizontal',
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Abas',
}) => {
  const listRef = useRef(null)
  const tabRefs = useRef({})

  useEffect(() => {
    if (orientation !== 'horizontal') return
    const el = tabRefs.current[activeKey]
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [activeKey, orientation])

  return (
    <div
      className={cn(
        'ds-tabs',
        `ds-tabs--${variant}`,
        `ds-tabs--${orientation}`,
        className
      )}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={tabsListVariants({ variant, orientation, size })}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey
          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[tab.key] = node
              }}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              className={tabButtonVariants({
                variant,
                orientation,
                active: isActive,
                disabled: !!tab.disabled,
              })}
              onClick={() => !tab.disabled && onChange?.(tab.key)}
            >
              {tab.icon && (
                <span className="ds-tab__icon shrink-0" aria-hidden>
                  {tab.icon}
                </span>
              )}
              <span className="ds-tab__label">{tab.label}</span>
              {tab.count != null && (
                <span className="ds-tab__count" aria-label={`${tab.count} itens`}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
