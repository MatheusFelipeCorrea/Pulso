import 'package:flutter/material.dart';

class SplitVisual {
  const SplitVisual({
    required this.label,
    required this.tone,
    required this.icon,
  });

  final String label;
  final String tone;
  final IconData icon;
}

SplitVisual splitStatusVisual(String status) {
  if (status == 'QUITADA') {
    return const SplitVisual(
      label: 'Quitada',
      tone: 'success',
      icon: Icons.check_circle_outline,
    );
  }
  return const SplitVisual(
    label: 'Em aberto',
    tone: 'warning',
    icon: Icons.timelapse,
  );
}

SplitVisual participanteStatusVisual(String status) {
  if (status == 'PAGO') {
    return const SplitVisual(label: 'Pago', tone: 'success', icon: Icons.check);
  }
  return const SplitVisual(
    label: 'Pendente',
    tone: 'warning',
    icon: Icons.schedule,
  );
}

String splitTipoLabel(String tipo) {
  return tipo == 'PERSONALIZADA' ? 'Personalizada' : 'Igual';
}

List<String> nomesParticipantes(String raw) {
  final vistos = <String>{};
  final nomes = <String>[];
  for (final parte in raw.split(RegExp(r'[,;\n]'))) {
    final nome = parte.trim().replaceAll(RegExp(r'\s{2,}'), ' ');
    if (nome.isEmpty) continue;
    final chave = nome.toLowerCase();
    if (chave == 'você' || chave == 'voce' || vistos.contains(chave)) continue;
    vistos.add(chave);
    nomes.add(nome);
  }
  return nomes;
}
