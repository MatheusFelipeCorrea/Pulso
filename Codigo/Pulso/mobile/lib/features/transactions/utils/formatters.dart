import 'package:flutter/material.dart';

class TransactionPeriod {
  static String current() {
    final now = DateTime.now();
    return '${now.year}-${now.month.toString().padLeft(2, '0')}';
  }

  static String shift(String periodo, int deltaMonths) {
    final parts = periodo.split('-');
    var year = int.parse(parts[0]);
    var month = int.parse(parts[1]) + deltaMonths;
    while (month < 1) {
      month += 12;
      year -= 1;
    }
    while (month > 12) {
      month -= 12;
      year += 1;
    }
    return '$year-${month.toString().padLeft(2, '0')}';
  }

  static String label(String periodo) {
    final parts = periodo.split('-');
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];
    final month = int.parse(parts[1]);
    return '${months[month - 1]}/${parts[0]}';
  }
}

String formatBrl(num value) {
  final negative = value < 0;
  final cents = (value.abs() * 100).round();
  final inteiro = cents ~/ 100;
  final frac = (cents % 100).toString().padLeft(2, '0');
  final digits = inteiro.toString();
  final buf = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    final fromEnd = digits.length - i;
    buf.write(digits[i]);
    if (fromEnd > 1 && fromEnd % 3 == 1) buf.write('.');
  }
  return '${negative ? '-' : ''}R\$ $buf,$frac';
}

String formatDayHeader(DateTime date) {
  final d = date.day.toString().padLeft(2, '0');
  final m = date.month.toString().padLeft(2, '0');
  return '$d/$m/${date.year}';
}

String isoDate(DateTime date) {
  final local = DateTime(date.year, date.month, date.day, 12);
  return local.toUtc().toIso8601String();
}

String recursoLabel(String value) {
  switch (value) {
    case 'DINHEIRO':
      return 'Dinheiro';
    case 'VA':
      return 'VA';
    case 'VR':
      return 'VR';
    case 'VT':
      return 'VT';
    case 'POUPANCA':
      return 'Poupança';
    default:
      return value;
  }
}

Color? parseHexColor(String? hex) {
  if (hex == null || hex.isEmpty) return null;
  final cleaned = hex.replaceFirst('#', '');
  if (cleaned.length != 6 && cleaned.length != 8) return null;
  final value = int.tryParse(cleaned.length == 6 ? 'FF$cleaned' : cleaned, radix: 16);
  if (value == null) return null;
  return Color(value);
}

double? parseMoney(String raw) {
  final cleaned = raw
      .trim()
      .replaceAll('R\$', '')
      .replaceAll(' ', '')
      .replaceAll('.', '')
      .replaceAll(',', '.');
  if (cleaned.isEmpty) return null;
  return double.tryParse(cleaned);
}
