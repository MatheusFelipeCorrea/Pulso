import { z } from 'zod'

const senhaForteRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export const registerSchema = z
  .object({
    nome: z.string().min(1, 'Este campo é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().min(1, 'Este campo é obrigatório').email('Email inválido'),
    senha: z
      .string()
      .min(1, 'Este campo é obrigatório')
      .regex(
        senhaForteRegex,
        'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.'
      ),
    confirmarSenha: z.string().min(1, 'Este campo é obrigatório'),
    aceitarTermos: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos',
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarSenha'],
  })

export const loginSchema = z.object({
  identificador: z.string().min(1, 'Este campo é obrigatório'),
  senha: z.string().min(1, 'Este campo é obrigatório'),
  lembrarMe: z.boolean().optional().default(false),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Este campo é obrigatório').email('Email inválido'),
})

export const resetPasswordSchema = z
  .object({
    senha: z
      .string()
      .min(1, 'Este campo é obrigatório')
      .regex(
        senhaForteRegex,
        'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.'
      ),
    confirmarSenha: z.string().min(1, 'Este campo é obrigatório'),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem.',
    path: ['confirmarSenha'],
  })
