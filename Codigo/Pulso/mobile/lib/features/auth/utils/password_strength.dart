class PasswordRule {
  PasswordRule(this.label, this.test);
  final String label;
  final bool Function(String value) test;
}

final passwordRules = <PasswordRule>[
  PasswordRule('Mínimo de 8 caracteres', (value) => value.length >= 8),
  PasswordRule(
    'Uma letra minúscula',
    (value) => RegExp(r'[a-z]').hasMatch(value),
  ),
  PasswordRule(
    'Uma letra maiúscula',
    (value) => RegExp(r'[A-Z]').hasMatch(value),
  ),
  PasswordRule('Um número', (value) => RegExp(r'\d').hasMatch(value)),
  PasswordRule(
    r'Um caractere especial (@$!%*?&#)',
    (value) => RegExp(r'[@$!%*?&#]').hasMatch(value),
  ),
];

final senhaForteRegex = RegExp(
  r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$',
);

class PasswordStrength {
  const PasswordStrength({
    required this.label,
    required this.colorValue,
    required this.segments,
    required this.fillValue,
  });

  final String label;
  final int colorValue;
  final int segments;
  final int fillValue;
}

PasswordStrength getPasswordStrength(String password) {
  final passed = passwordRules.where((rule) => rule.test(password)).length;
  if (password.isEmpty) {
    return const PasswordStrength(
      label: 'Fraca',
      colorValue: 0xFFEF4444,
      segments: 0,
      fillValue: 0xFFEF4444,
    );
  }
  if (passed <= 2) {
    return const PasswordStrength(
      label: 'Fraca',
      colorValue: 0xFFEF4444,
      segments: 1,
      fillValue: 0xFFEF4444,
    );
  }
  if (passed <= 4) {
    return const PasswordStrength(
      label: 'Média',
      colorValue: 0xFFF59E0B,
      segments: 2,
      fillValue: 0xFF7C3AED,
    );
  }
  return const PasswordStrength(
    label: 'Forte',
    colorValue: 0xFF10B981,
    segments: 4,
    fillValue: 0xFF10B981,
  );
}

bool allPasswordRulesPassed(String password) =>
    passwordRules.every((rule) => rule.test(password));
