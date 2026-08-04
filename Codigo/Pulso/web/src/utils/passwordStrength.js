export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'Mínimo de 8 caracteres',
    test: (value) => value.length >= 8,
  },
  {
    id: 'lower',
    label: 'Uma letra minúscula',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'upper',
    label: 'Uma letra maiúscula',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'number',
    label: 'Um número',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'special',
    label: 'Um caractere especial (@$!%*?&#)',
    test: (value) => /[@$!%*?&#]/.test(value),
  },
]

export function getPasswordStrength(password) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length

  if (!password) {
    return { label: 'Fraca', color: '#EF4444', segments: 0, fillColor: '#EF4444' }
  }

  if (passed <= 2) {
    return { label: 'Fraca', color: '#EF4444', segments: 1, fillColor: '#EF4444' }
  }

  if (passed <= 4) {
    return { label: 'Média', color: '#F59E0B', segments: 2, fillColor: '#7C3AED' }
  }

  return { label: 'Forte', color: '#10B981', segments: 4, fillColor: '#10B981' }
}

export function allPasswordRulesPassed(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password))
}
