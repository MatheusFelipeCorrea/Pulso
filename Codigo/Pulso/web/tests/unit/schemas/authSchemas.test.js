import { describe, expect, it } from 'vitest'
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/schemas/authSchemas.js'

describe('authSchemas', () => {
  it('valida registro com dados corretos', () => {
    const result = registerSchema.safeParse({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: 'Senha@123',
      confirmarSenha: 'Senha@123',
      aceitarTermos: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejeita registro quando senhas não conferem', () => {
    const result = registerSchema.safeParse({
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: 'Senha@123',
      confirmarSenha: 'Senha@124',
      aceitarTermos: true,
    })
    expect(result.success).toBe(false)
  })

  it('aplica defaults e obrigatoriedade no login', () => {
    const valid = loginSchema.safeParse({ identificador: 'maria', senha: 'x' })
    expect(valid.success).toBe(true)
    expect(valid.data.lembrarMe).toBe(false)

    const invalid = loginSchema.safeParse({ identificador: '', senha: '' })
    expect(invalid.success).toBe(false)
  })

  it('valida forgot/reset password', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'foo@bar.com' }).success).toBe(true)
    expect(forgotPasswordSchema.safeParse({ email: 'email-invalido' }).success).toBe(false)

    expect(
      resetPasswordSchema.safeParse({
        senha: 'Senha@123',
        confirmarSenha: 'Senha@123',
      }).success
    ).toBe(true)
  })
})
