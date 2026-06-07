import * as LucideIcons from 'lucide-react'

/**
 * Resolve nome Lucide (string) → componente de ícone.
 */
export function resolveSidebarIcon(name, fallback = LucideIcons.Circle) {
  if (!name) return fallback
  return LucideIcons[name] ?? fallback
}

export function SidebarIcon({ name, size = 20, className = '', strokeWidth = 1.75 }) {
  const Icon = resolveSidebarIcon(name)
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
}
