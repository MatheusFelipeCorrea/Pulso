import {
  Bed,
  Clapperboard,
  FileText,
  HeartPulse,
  MapPin,
  MoreHorizontal,
  Plane,
  ShieldAlert,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'

export const TRIP_EXPENSE_CATEGORY_ICONS = {
  Plane,
  Bed,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  FileText,
  HeartPulse,
  ShieldAlert,
  Clapperboard,
  MoreHorizontal,
}

export const TRIP_EXPENSE_CATEGORIES = [
  { key: 'TRANSPORTE', label: 'Passagens', tableLabel: 'Transporte', icon: 'Plane' },
  { key: 'HOSPEDAGEM', label: 'Hospedagem', tableLabel: 'Hospedagem', icon: 'Bed' },
  { key: 'ALIMENTACAO', label: 'Alimentação', tableLabel: 'Alimentação', icon: 'UtensilsCrossed' },
  { key: 'PASSEIOS', label: 'Passeios', tableLabel: 'Passeios', icon: 'MapPin' },
  { key: 'COMPRAS', label: 'Compras', tableLabel: 'Compras', icon: 'ShoppingBag' },
  { key: 'DOCUMENTACAO', label: 'Documentação', tableLabel: 'Documentação', icon: 'FileText' },
  { key: 'SAUDE', label: 'Saúde', tableLabel: 'Saúde', icon: 'HeartPulse' },
  { key: 'EMERGENCIAS', label: 'Emergências', tableLabel: 'Emergências', icon: 'ShieldAlert' },
  { key: 'ENTRETENIMENTO', label: 'Entretenimento', tableLabel: 'Entretenimento', icon: 'Clapperboard' },
  { key: 'OUTROS', label: 'Outros', tableLabel: 'Outros', icon: 'MoreHorizontal' },
]

export const TRIP_EXPENSE_CATEGORY_MAP = Object.fromEntries(
  TRIP_EXPENSE_CATEGORIES.map((item) => [item.key, item])
)

export const TRIP_EXPENSE_CATEGORY_COLORS = {
  TRANSPORTE: '#3b82f6',
  HOSPEDAGEM: '#8b5cf6',
  ALIMENTACAO: '#f59e0b',
  PASSEIOS: '#10b981',
  COMPRAS: '#ec4899',
  DOCUMENTACAO: '#06b6d4',
  SAUDE: '#ef4444',
  EMERGENCIAS: '#f97316',
  ENTRETENIMENTO: '#a855f7',
  OUTROS: '#64748b',
}

export function getTripExpenseCategoryIcon(key) {
  const meta = TRIP_EXPENSE_CATEGORY_MAP[key]
  return TRIP_EXPENSE_CATEGORY_ICONS[meta?.icon] ?? MapPin
}

export function getTripExpenseCategoryColor(key) {
  return TRIP_EXPENSE_CATEGORY_COLORS[key] ?? '#7c3aed'
}
