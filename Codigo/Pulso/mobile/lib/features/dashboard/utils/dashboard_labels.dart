import 'package:flutter/material.dart';

String dashboardVariacaoLabel(String tipo, double valor) {
  switch (tipo) {
    case 'igual':
      return 'Estável no mês';
    case 'sem_base':
      return 'Sem base anterior';
    case 'valor_novo':
      return 'Saldo novo neste mês';
    case 'percentual':
      final sinal = valor > 0 ? '+' : '';
      return '$sinal${valor.toStringAsFixed(1)}% vs mês anterior';
    default:
      return 'Variação indisponível';
  }
}

({IconData icon, String tom}) dashboardVariacaoVisual(
  String tipo,
  double valor,
) {
  if (tipo == 'percentual' && valor < 0) {
    return (icon: Icons.trending_down, tom: 'queda');
  }
  if (tipo == 'percentual' && valor > 0) {
    return (icon: Icons.trending_up, tom: 'alta');
  }
  return (icon: Icons.trending_flat, tom: 'neutro');
}

String dashboardSaudeTom(int score) {
  if (score >= 81) return 'excelente';
  if (score >= 61) return 'bom';
  if (score <= 40) return 'atencao';
  return 'regular';
}

String dashboardAlertaLabel(double percentual) {
  final valor = percentual.round();
  if (percentual >= 100) return 'Estourou · $valor%';
  return 'Em alerta · $valor%';
}
