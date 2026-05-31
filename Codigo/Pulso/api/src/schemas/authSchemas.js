const { z } = require('zod');

const senhaForteRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const registerSchema = z
    .object({
        body: z
            .object({
                nome: z
                    .string()
                    .min(3, 'Nome deve ter no mínimo 3 caracteres')
                    .max(120),
                email: z.string().email('Email inválido'),
                senha: z.string().regex(
                    senhaForteRegex,
                    'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.'
                ),
                confirmarSenha: z.string(),
            })
            .refine((data) => data.senha === data.confirmarSenha, {
                message: 'As senhas não conferem.',
                path: ['confirmarSenha'],
            }),
    });

const verifyEmailSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token de verificação inválido.'),
    }),
});

const resendVerificationSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().min(1, 'Email ou usuário é obrigatório'),
        senha: z.string().min(1, 'Senha é obrigatória'),
        lembrarMe: z.boolean().optional().default(false),
    }),
});

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
});

const logoutSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
    }),
});

const resetPasswordTokenSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token inválido'),
    }),
});

const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string().min(1, 'Token inválido'),
    }),
    body: z
        .object({
            senha: z.string().regex(
                senhaForteRegex,
                'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.'
            ),
            confirmarSenha: z.string(),
        })
        .refine((data) => data.senha === data.confirmarSenha, {
            message: 'As senhas não conferem.',
            path: ['confirmarSenha'],
        }),
});

module.exports = {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    refreshSchema,
    logoutSchema,
    forgotPasswordSchema,
    resetPasswordTokenSchema,
    resetPasswordSchema,
};
