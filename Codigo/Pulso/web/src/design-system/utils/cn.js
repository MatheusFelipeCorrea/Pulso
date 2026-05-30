/**
 * cn() - Class Names Utility
 * 
 * Combina clsx + tailwind-merge para composição segura de classes Tailwind.
 * Evita conflitos (ex: "p-4 p-2" → "p-2").
 * 
 * Uso:
 *   cn('base', condition && 'active', 'other')
 *   cn({ 'text-red-500': hasError }, 'font-bold')
 * 
 * Retorna: string com classes mescladas sem conflitos.
 */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
