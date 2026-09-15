/** Regras padrão de validação de senha */
export const DEFAULT_PASSWORD_RULES = [
  {
    label: 'Mínimo 8 caracteres',
    test: (value) => value.length >= 8,
  },
  {
    label: 'Pelo menos 1 número',
    test: (value) => /\d/.test(value),
  },
  {
    label: 'Pelo menos 1 maiúscula',
    test: (value) => /[A-Z]/.test(value),
  },
]
