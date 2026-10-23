import 'package:flutter/material.dart';

final _sufixoModo = RegExp(
  r'\s+(?:pessoa\s+f[ií]sica|estagi[aá]rio|clt|pj)\s*$',
  caseSensitive: false,
);

/// Mesma limpeza de nome exibido nos cards de grupo da web.
String limparNomeGrupoMembro(String? nome) {
  return (nome ?? '')
      .replaceAll(RegExp(r'\s*\([^)]*\)\s*'), ' ')
      .replaceAll(_sufixoModo, '')
      .trim()
      .replaceAll(RegExp(r'\s{2,}'), ' ');
}

String formatGrupoMembroDisplayNome(String? nome, {bool souEu = false}) {
  final base = limparNomeGrupoMembro(nome);
  final visivel = base.isEmpty ? (nome ?? '').trim() : base;
  return souEu ? '$visivel (você)' : visivel;
}

String groupActivityLabel(String? iso, {DateTime? agora}) {
  if (iso == null || iso.trim().isEmpty) return 'Sem atividade recente';
  final date = DateTime.tryParse(iso);
  if (date == null) return 'Sem atividade recente';
  final now = agora ?? DateTime.now();
  final diff = now.difference(date.toLocal());
  if (diff.isNegative || diff.inMinutes < 1) return 'Há menos de um minuto';
  if (diff.inHours < 1) {
    final n = diff.inMinutes;
    return 'Há $n min';
  }
  if (diff.inDays < 1) {
    final n = diff.inHours;
    return 'Há $n h';
  }
  if (diff.inDays < 30) {
    final n = diff.inDays;
    return n == 1 ? 'Há 1 dia' : 'Há $n dias';
  }
  final meses = diff.inDays ~/ 30;
  return meses == 1 ? 'Há 1 mês' : 'Há $meses meses';
}

class GroupPapelVisual {
  const GroupPapelVisual({
    required this.label,
    required this.icon,
    required this.admin,
  });

  final String label;
  final IconData icon;
  final bool admin;
}

GroupPapelVisual groupPapelVisual(String? papel) {
  if (papel == 'ADMIN') {
    return const GroupPapelVisual(
      label: 'Admin',
      icon: Icons.shield_outlined,
      admin: true,
    );
  }
  return const GroupPapelVisual(
    label: 'Membro',
    icon: Icons.person_outline,
    admin: false,
  );
}

String formatCodigoConvite(String? codigo) {
  final raw = (codigo ?? '').trim().toUpperCase();
  if (raw.isEmpty) return '';
  return raw;
}
