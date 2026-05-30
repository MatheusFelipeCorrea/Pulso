import {
  Tag,
  DollarSign,
  Apple,
  Utensils,
  Bus,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ArrowUp,
  Minus,
  ArrowDown,
  GraduationCap,
  Briefcase,
  Laptop,
  User,
  Crown,
  CalendarCheck,
  Hourglass,
  RefreshCw,
  Sprout,
  BarChart3,
  Star,
  Diamond,
  Info,
} from 'lucide-react'

/**
 * Mapa nome → ícone Lucide (mesmo padrão de `Categoria.icone` no backend).
 * Ao criar uma badge nova no Pulso, registre o ícone aqui ou via registerBadgeIcon.
 */
const ICON_REGISTRY = {
  Tag,
  DollarSign,
  Apple,
  Utensils,
  Bus,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ArrowUp,
  Minus,
  ArrowDown,
  GraduationCap,
  Briefcase,
  Laptop,
  User,
  Crown,
  CalendarCheck,
  Hourglass,
  RefreshCw,
  Sprout,
  BarChart3,
  Star,
  Diamond,
  Info,
}

const ICON_SIZES = { sm: 12, md: 14, lg: 16 }

/** Registra ícone para uso em badges customizadas (ex.: após criar tipo no admin) */
export function registerBadgeIcon(name, IconComponent) {
  if (!name || !IconComponent) return
  ICON_REGISTRY[name] = IconComponent
}

/** Resolve string do backend (ex. "Apple") para elemento React */
export function resolveBadgeIcon(iconName, { size = 'md' } = {}) {
  if (!iconName) return null
  const Icon = ICON_REGISTRY[iconName] ?? ICON_REGISTRY.Tag
  const dim = ICON_SIZES[size] ?? 14
  return <Icon size={dim} aria-hidden />
}

export function listRegisteredBadgeIcons() {
  return Object.keys(ICON_REGISTRY)
}
