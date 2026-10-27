import {
    Tag,
    DollarSign,
    Apple,
    Utensils,
    UtensilsCrossed,
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
    Banknote,
    TrendingUp,
    CircleDollarSign,
    Gamepad2,
    Home,
    HeartPulse,
    ShoppingBag,
    Shirt,
    Sparkles,
    Smartphone,
    Landmark,
    PawPrint,
    Plane,
    Gift,
    Car,
    CreditCard,
    Users,
    Building2,
    PiggyBank,
    ArrowLeftRight,
    Receipt,
    Coins,
    Wallet,
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
    UtensilsCrossed,
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
    Banknote,
    TrendingUp,
    CircleDollarSign,
    Gamepad2,
    Home,
    HeartPulse,
    ShoppingBag,
    Shirt,
    Sparkles,
    Smartphone,
    Landmark,
    PawPrint,
    Plane,
    Gift,
    Car,
    CreditCard,
    Users,
    Building2,
    PiggyBank,
    ArrowLeftRight,
    Receipt,
    Coins,
    Wallet,
}

const ICON_SIZES = { sm: 12, md: 14, lg: 16 }

const ICON_REGISTRY_BY_LOWER = Object.fromEntries(
    Object.entries(ICON_REGISTRY).map(([name, Icon]) => [name.toLowerCase(), Icon])
)

/** Registra ícone para uso em badges customizadas (ex.: após criar tipo no admin) */
export function registerBadgeIcon(name, IconComponent) {
    if (!name || !IconComponent) return
    ICON_REGISTRY[name] = IconComponent
    ICON_REGISTRY_BY_LOWER[String(name).toLowerCase()] = IconComponent
}

/** Resolve string do backend (ex. "Apple" ou "receipt") para elemento React */
export function resolveBadgeIcon(iconName, { size = 'md' } = {}) {
    if (!iconName) return null
    const key = String(iconName).trim()
    const Icon =
        ICON_REGISTRY[key] ?? ICON_REGISTRY_BY_LOWER[key.toLowerCase()] ?? ICON_REGISTRY.Tag
    const dim = typeof size === 'number' ? size : (ICON_SIZES[size] ?? 14)
    return <Icon size={dim} aria-hidden />
}

export function listRegisteredBadgeIcons() {
    return Object.keys(ICON_REGISTRY)
}
