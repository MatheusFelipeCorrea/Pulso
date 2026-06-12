import { afterEach, describe, expect, it, vi } from 'vitest'

describe('themeSlice', () => {
  afterEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('lê tema inicial do localStorage', async () => {
    localStorage.setItem('theme', 'dark')
    const { default: reducer } = await import('@/store/slices/themeSlice.js')
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ mode: 'dark' })
  })

  it('toggleTheme alterna tema e persiste no localStorage', async () => {
    const mod = await import('@/store/slices/themeSlice.js')
    const state = mod.default({ mode: 'light' }, mod.toggleTheme())
    expect(state.mode).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('setTheme define tema explícito e persiste', async () => {
    const mod = await import('@/store/slices/themeSlice.js')
    const state = mod.default({ mode: 'light' }, mod.setTheme('dark'))
    expect(state.mode).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
