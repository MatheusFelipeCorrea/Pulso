import 'package:flutter/material.dart';

class DebtStatusVisual {
  const DebtStatusVisual({
    required this.label,
    required this.tone,
    required this.icon,
  });

  final String label;
  final String tone;
  final IconData icon;
}

String debtDirecaoLabel(String direcao) {
  return direcao == 'ME_DEVEM' ? 'Me devem' : 'Eu devo';
}

String _dataCurta(DateTime? data) {
  if (data == null) return '—';
  final local = data.toLocal();
  final d = local.day.toString().padLeft(2, '0');
  final m = local.month.toString().padLeft(2, '0');
  return '$d/$m/${local.year}';
}

int _dias(DateTime prazo, DateTime hoje) {
  final a = DateTime(prazo.year, prazo.month, prazo.day);
  final b = DateTime(hoje.year, hoje.month, hoje.day);
  return a.difference(b).inDays;
}

DebtStatusVisual debtStatusVisual({
  required bool quitada,
  DateTime? dataQuitacao,
  DateTime? prazoDevolucao,
  required double valorPago,
  required double valorRestante,
  required double valorTotal,
  DateTime? hoje,
}) {
  if (quitada) {
    return DebtStatusVisual(
      label: 'Quitada em ${_dataCurta(dataQuitacao)}',
      tone: 'success',
      icon: Icons.check_circle_outline,
    );
  }

  final parcial = valorPago > 0 && valorRestante > 0;
  if (prazoDevolucao == null) {
    if (parcial) {
      return DebtStatusVisual(
        label: 'Parcialmente pago',
        tone: 'warning',
        icon: Icons.hourglass_bottom,
      );
    }
    return const DebtStatusVisual(
      label: 'Sem prazo definido',
      tone: 'neutral',
      icon: Icons.remove,
    );
  }

  final dias = _dias(prazoDevolucao, hoje ?? DateTime.now());
  late final String prazoLabel;
  late final String tone;
  if (dias < 0) {
    final atraso = dias.abs();
    prazoLabel = 'Vencida há $atraso ${atraso == 1 ? 'dia' : 'dias'}';
    tone = 'danger';
  } else if (dias == 0) {
    prazoLabel = 'Vence hoje';
    tone = 'danger';
  } else if (dias <= 2) {
    prazoLabel = 'Vence em $dias ${dias == 1 ? 'dia' : 'dias'}';
    tone = 'warning';
  } else {
    prazoLabel = 'Vence em $dias dias';
    tone = 'success';
  }

  final percentual = valorTotal > 0
      ? ((valorPago / valorTotal) * 100).round()
      : 0;
  return DebtStatusVisual(
    label: parcial ? '$prazoLabel · pago $percentual%' : prazoLabel,
    tone: tone,
    icon: tone == 'danger' ? Icons.circle : Icons.hourglass_bottom,
  );
}
