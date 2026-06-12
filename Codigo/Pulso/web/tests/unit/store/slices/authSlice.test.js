import { describe, expect, it } from 'vitest'
import reducer, { clearUser, setUser } from '@/store/slices/authSlice.js'

describe('authSlice', () => {
  it('retorna estado inicial', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
    })
  })

  it('define e limpa usuário', () => {
    const user = { id: '1', nome: 'Ana' }
    const withUser = reducer(undefined, setUser(user))
    expect(withUser).toEqual({
      user,
      isAuthenticated: true,
    })

    expect(reducer(withUser, clearUser())).toEqual({
      user: null,
      isAuthenticated: false,
    })
  })

  it('setUser com payload vazio mantém isAuthenticated false', () => {
    const next = reducer(undefined, setUser(null))
    expect(next).toEqual({
      user: null,
      isAuthenticated: false,
    })
  })
})
