import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';

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

enum PulsoBadgeKind {
  perfilEstagiario,
  perfilClt,
  perfilPj,
  perfilPf,
  recursoDinheiro,
  recursoVa,
  recursoVr,
  recursoVt,
  recursoPoupanca,
  transacaoRecorrente,
}

PulsoBadgeStyle badgeStyleForKind(PulsoBadgeKind kind, Brightness brightness) {
  Color primary() => brightness == Brightness.dark ? PulsoColors.primaryLight : PulsoColors.primary;
  Color info() => PulsoColors.infoOf(brightness);
  Color cyan() => PulsoColors.cyanOf(brightness);
  Color orange() => PulsoColors.orangeOf(brightness);
  Color success() => PulsoColors.successOf(brightness);
  Color neutral() => PulsoColors.secondaryText(brightness);

  return switch (kind) {
    PulsoBadgeKind.perfilEstagiario => PulsoBadgeStyle(
        label: 'Estagiário',
        icon: Icons.school_outlined,
        color: primary(),
      ),
    PulsoBadgeKind.perfilClt => PulsoBadgeStyle(
        label: 'CLT',
        icon: Icons.work_outline,
        color: info(),
      ),
    PulsoBadgeKind.perfilPj => PulsoBadgeStyle(
        label: 'PJ/Freelancer',
        icon: Icons.laptop_mac,
        color: cyan(),
      ),
    PulsoBadgeKind.perfilPf => PulsoBadgeStyle(
        label: 'Pessoa Física',
        icon: Icons.person_outline,
        color: neutral(),
      ),
    PulsoBadgeKind.recursoDinheiro => PulsoBadgeStyle(
        label: 'Dinheiro',
        icon: Icons.attach_money,
        color: primary(),
      ),
    PulsoBadgeKind.recursoVa => PulsoBadgeStyle(
        label: 'VA',
        icon: Icons.apple,
        color: success(),
      ),
    PulsoBadgeKind.recursoVr => PulsoBadgeStyle(
        label: 'VR',
        icon: Icons.restaurant,
        color: orange(),
      ),
    PulsoBadgeKind.recursoVt => PulsoBadgeStyle(
        label: 'VT',
        icon: Icons.directions_bus,
        color: info(),
      ),
    PulsoBadgeKind.recursoPoupanca => PulsoBadgeStyle(
        label: 'Poupança',
        icon: Icons.savings_outlined,
        color: cyan(),
      ),
    PulsoBadgeKind.transacaoRecorrente => PulsoBadgeStyle(
        label: 'Recorrente',
        icon: Icons.autorenew,
        color: info(),
      ),
  };
}

PulsoBadgeKind? badgeKindFromModoUso(String? modoUso) {
  return switch (modoUso) {
    'ESTAGIARIO' => PulsoBadgeKind.perfilEstagiario,
    'PJ' => PulsoBadgeKind.perfilPj,
    'PESSOA_FISICA' => PulsoBadgeKind.perfilPf,
    'CLT' => PulsoBadgeKind.perfilClt,
    _ => PulsoBadgeKind.perfilClt,
  };
}

/// Compatível com testes que leem `.label` sem BuildContext.
PulsoBadgeStyle badgeFromModoUso(String? modoUso) {
  return badgeStyleForKind(badgeKindFromModoUso(modoUso) ?? PulsoBadgeKind.perfilClt, Brightness.light);
}

PulsoBadgeKind? badgeKindFromRecurso(String? recurso) {
  return switch (recurso) {
    'DINHEIRO' => PulsoBadgeKind.recursoDinheiro,
    'VA' => PulsoBadgeKind.recursoVa,
    'VR' => PulsoBadgeKind.recursoVr,
    'VT' => PulsoBadgeKind.recursoVt,
    'POUPANCA' => PulsoBadgeKind.recursoPoupanca,
    _ => null,
  };
}

PulsoBadgeStyle? badgeFromRecurso(String? recurso) {
  final kind = badgeKindFromRecurso(recurso);
  if (kind == null) return null;
  return badgeStyleForKind(kind, Brightness.light);
}

class PulsoBadge extends StatelessWidget {
  const PulsoBadge({super.key, required this.style, this.compact = false});

  factory PulsoBadge.kind({
    Key? key,
    required PulsoBadgeKind kind,
    required Brightness brightness,
    bool compact = false,
  }) {
    return PulsoBadge(
      key: key,
      style: badgeStyleForKind(kind, brightness),
      compact: compact,
    );
  }

  final PulsoBadgeStyle style;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? PulsoTokens.space2 : 10,
        vertical: compact ? PulsoTokens.space1 : 5,
      ),
      decoration: BoxDecoration(
        color: style.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(PulsoTokens.radiusFull),
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
              fontSize: PulsoTokens.fontXs,
              fontWeight: PulsoTokens.weightSemibold,
              height: 1,
            ),
          ),
        ],
      ),
    );
  }
}
