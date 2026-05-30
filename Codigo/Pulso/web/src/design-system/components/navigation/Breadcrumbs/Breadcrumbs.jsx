import { useRef, useState } from 'react'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { useClickOutside } from '../../../hooks/useClickOutside.js'
import { useIsMobile } from '../../../hooks/useMediaQuery.js'

function getDisplaySegments(items, maxItems, isMobile) {
  const current = items[items.length - 1]
  const collapse = items.length > maxItems || (isMobile && items.length > 3)

  if (!collapse || items.length <= 2) {
    return { links: items.slice(0, -1), current, hidden: [] }
  }

  const first = items[0]
  const penultimate = items[items.length - 2]
  const hidden = items.slice(1, items.length - 2)

  const links = [first]
  if (hidden.length > 0) {
    links.push('ellipsis')
  }
  if (penultimate && penultimate !== first) {
    links.push(penultimate)
  }

  return { links, current, hidden }
}

/**
 * Breadcrumbs — trilha de navegação secundária
 */
export const Breadcrumbs = ({
  items = [],
  separator,
  maxItems = 4,
  showHomeIcon = false,
  className,
}) => {
  const isMobile = useIsMobile()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useClickOutside(menuRef, () => setMenuOpen(false))

  if (!items.length) return null

  const Sep = separator ?? (
    <ChevronRight size={14} className="ds-breadcrumb__sep shrink-0" aria-hidden />
  )

  const { links, current, hidden } = getDisplaySegments(items, maxItems, isMobile)

  const renderLink = (item, index) => {
    const isFirst = index === 0 && item !== 'ellipsis'
    const asHomeOnly = showHomeIcon && isFirst

    return (
      <button
        type="button"
        className="ds-breadcrumb__link"
        onClick={item.onClick}
        disabled={!item.onClick}
      >
        {asHomeOnly ? <Home size={16} aria-hidden /> : item.icon}
        {!asHomeOnly && item.label}
      </button>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('ds-breadcrumbs', className)}>
      <ol className="ds-breadcrumbs__list">
        {links.map((item, index) => (
          <li key={item === 'ellipsis' ? 'ellipsis' : `${item.label}-${index}`} className="ds-breadcrumbs__item">
            {index > 0 && <span className="ds-breadcrumbs__sep-wrap">{Sep}</span>}

            {item === 'ellipsis' ? (
              <div ref={menuRef} className="relative inline-flex">
                <button
                  type="button"
                  className="ds-breadcrumb__ellipsis"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <MoreHorizontal size={16} aria-hidden />
                  <span className="sr-only">Mostrar caminho oculto</span>
                </button>
                {menuOpen && hidden.length > 0 && (
                  <div className="ds-breadcrumb__menu" role="menu">
                    {hidden.map((hiddenItem, i) => (
                      <button
                        key={`${hiddenItem.label}-${i}`}
                        type="button"
                        role="menuitem"
                        className="ds-breadcrumb__menu-item"
                        onClick={() => {
                          hiddenItem.onClick?.()
                          setMenuOpen(false)
                        }}
                      >
                        {hiddenItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              renderLink(item, index)
            )}
          </li>
        ))}

        <li className="ds-breadcrumbs__item">
          {links.length > 0 && <span className="ds-breadcrumbs__sep-wrap">{Sep}</span>}
          <span className="ds-breadcrumb__current" aria-current="page">
            {showHomeIcon && items.length === 1 ? (
              <Home size={16} aria-hidden />
            ) : (
              <>
                {current.icon}
                {current.label}
              </>
            )}
          </span>
        </li>
      </ol>
    </nav>
  )
}
