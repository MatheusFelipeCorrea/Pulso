import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';

class PulsoBadgeStyle {
  const PulsoBadgeStyle({
    required this.label,
    required this.icon,
    required this.color,
  });

  final String label;
  final IconData icon;
  final Color color;
}

PulsoBadgeStyle badgeFromModoUso(String? modoUso) {
  switch (modoUso) {
    case 'ESTAGIARIO':
      return const PulsoBadgeStyle(
        label: 'Estagiário',
        icon: Icons.school_outlined,
        color: PulsoColors.primary,
      );
    case 'PJ':
      return const PulsoBadgeStyle(
        label: 'PJ/Freelancer',
        icon: Icons.laptop_mac,
        color: Color(0xFF06B6D4),
      );
    case 'PESSOA_FISICA':
      return const PulsoBadgeStyle(
        label: 'Pessoa Física',
        icon: Icons.person_outline,
        color: PulsoColors.lightSecondary,
      );
    case 'CLT':
    default:
      return const PulsoBadgeStyle(
        label: 'CLT',
        icon: Icons.work_outline,
        color: Color(0xFF3B82F6),
      );
  }
}

PulsoBadgeStyle? badgeFromRecurso(String? recurso) {
  switch (recurso) {
    case 'DINHEIRO':
      return const PulsoBadgeStyle(label: 'Dinheiro', icon: Icons.attach_money, color: PulsoColors.primary);
    case 'VA':
      return const PulsoBadgeStyle(label: 'VA', icon: Icons.apple, color: PulsoColors.success);
    case 'VR':
      return const PulsoBadgeStyle(label: 'VR', icon: Icons.restaurant, color: Color(0xFFEA580C));
    case 'VT':
      return const PulsoBadgeStyle(label: 'VT', icon: Icons.directions_bus, color: Color(0xFF3B82F6));
    case 'POUPANCA':
      return const PulsoBadgeStyle(label: 'Poupança', icon: Icons.savings_outlined, color: Color(0xFF06B6D4));
    default:
      return null;
  }
}

class PulsoBadge extends StatelessWidget {
  const PulsoBadge({super.key, required this.style, this.compact = false});

  final PulsoBadgeStyle style;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: compact ? 8 : 10, vertical: compact ? 4 : 5),
      decoration: BoxDecoration(
        color: style.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: style.color.withValues(alpha: 0.18)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(style.icon, size: compact ? 12 : 14, color: style.color),
          const SizedBox(width: 6),
          Text(
            style.label,
            style: TextStyle(
              color: style.color,
              fontSize: compact ? 11 : 12,
              fontWeight: FontWeight.w600,
              height: 1,
            ),
          ),
        ],
      ),
    );
  }
}
