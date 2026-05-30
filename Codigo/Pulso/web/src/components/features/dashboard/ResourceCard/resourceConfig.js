import { Banknote, Apple, Utensils, Bus, Coins } from 'lucide-react'

/** @typedef {'DINHEIRO' | 'VA' | 'VR' | 'VT' | 'SALDO_TOTAL'} ResourceType */

export const RESOURCE_TYPES = /** @type {const} */ ({
  DINHEIRO: 'DINHEIRO',
  VA: 'VA',
  VR: 'VR',
  VT: 'VT',
  SALDO_TOTAL: 'SALDO_TOTAL',
})

/** @type {Record<ResourceType, { label: string, icon: import('lucide-react').LucideIcon, colorVar: string, filled?: boolean }>} */
export const resourceConfig = {
  [RESOURCE_TYPES.DINHEIRO]: {
    label: 'Dinheiro',
    icon: Banknote,
    colorVar: '--ds-color-primary',
  },
  [RESOURCE_TYPES.VA]: {
    label: 'Vale-Alimentação',
    icon: Apple,
    colorVar: '--ds-resource-va',
  },
  [RESOURCE_TYPES.VR]: {
    label: 'Vale-Refeição',
    icon: Utensils,
    colorVar: '--ds-resource-vr',
  },
  [RESOURCE_TYPES.VT]: {
    label: 'Vale-Transporte',
    icon: Bus,
    colorVar: '--ds-resource-vt',
  },
  [RESOURCE_TYPES.SALDO_TOTAL]: {
    label: 'Saldo total disponível',
    icon: Coins,
    colorVar: '--ds-color-primary',
    filled: true,
  },
}

export function getResourceConfig(type) {
  return resourceConfig[type] ?? resourceConfig[RESOURCE_TYPES.DINHEIRO]
}
