import { describe, expect, it } from 'vitest'

import { cn } from '@/design-system/utils/cn.js'

describe('design-system/utils/cn', () => {
  it('combina classes condicionais', () => {
    expect(cn('text-sm', true && 'font-bold', false && 'hidden')).toBe('text-sm font-bold')
  })

  it('resolve conflitos do tailwind com twMerge', () => {
    expect(cn('p-2', 'p-4', 'text-red-500', 'text-blue-500')).toBe('p-4 text-blue-500')
  })

  it('aceita objetos clsx', () => {
    expect(cn({ 'bg-green-500': true, 'bg-red-500': false }, 'rounded')).toBe('bg-green-500 rounded')
  })
})
