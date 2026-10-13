import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/utils/password_strength.dart';

class PasswordStrengthHints extends StatelessWidget {
  const PasswordStrengthHints({super.key, required this.password});

  final String password;

  @override
  Widget build(BuildContext context) {
    final strength = getPasswordStrength(password);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Força da senha: ${strength.label}',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: Color(strength.colorValue),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: List.generate(4, (index) {
            final filled = index < strength.segments;
            return Expanded(
              child: Container(
                height: 6,
                margin: EdgeInsets.only(right: index == 3 ? 0 : 6),
                decoration: BoxDecoration(
                  color: filled
                      ? Color(strength.fillValue)
                      : PulsoColors.lightBorder,
                  borderRadius: BorderRadius.circular(99),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 12),
        Text(
          'Sua senha deve conter:',
          style: Theme.of(context).textTheme.bodySmall
              ?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 12,
          runSpacing: 6,
          children: passwordRules.map((rule) {
            final ok = rule.test(password);
            return SizedBox(
              width: 160,
              child: Row(
                children: [
                  Icon(
                    ok ? Icons.check_circle : Icons.radio_button_unchecked,
                    size: 16,
                    color: ok
                        ? PulsoColors.success
                        : PulsoColors.lightSecondary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      rule.label,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
