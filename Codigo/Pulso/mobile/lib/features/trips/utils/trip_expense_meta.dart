import 'package:flutter/material.dart';

class TripExpenseMeta {
  const TripExpenseMeta({
    required this.label,
    required this.icon,
    required this.color,
  });

  final String label;
  final IconData icon;
  final Color color;
}

const tripExpenseCatalog = <String, TripExpenseMeta>{
  'TRANSPORTE': TripExpenseMeta(
    label: 'Passagens',
    icon: Icons.flight,
    color: Color(0xFF3B82F6),
  ),
  'HOSPEDAGEM': TripExpenseMeta(
    label: 'Hospedagem',
    icon: Icons.hotel_outlined,
    color: Color(0xFF8B5CF6),
  ),
  'ALIMENTACAO': TripExpenseMeta(
    label: 'Alimentação',
    icon: Icons.restaurant,
    color: Color(0xFFF59E0B),
  ),
  'PASSEIOS': TripExpenseMeta(
    label: 'Passeios',
    icon: Icons.place_outlined,
    color: Color(0xFF10B981),
  ),
  'COMPRAS': TripExpenseMeta(
    label: 'Compras',
    icon: Icons.shopping_bag_outlined,
    color: Color(0xFFEC4899),
  ),
  'DOCUMENTACAO': TripExpenseMeta(
    label: 'Documentação',
    icon: Icons.description_outlined,
    color: Color(0xFF06B6D4),
  ),
  'SAUDE': TripExpenseMeta(
    label: 'Saúde',
    icon: Icons.favorite_outline,
    color: Color(0xFFEF4444),
  ),
  'EMERGENCIAS': TripExpenseMeta(
    label: 'Emergências',
    icon: Icons.health_and_safety_outlined,
    color: Color(0xFFF97316),
  ),
  'ENTRETENIMENTO': TripExpenseMeta(
    label: 'Entretenimento',
    icon: Icons.movie_outlined,
    color: Color(0xFFA855F7),
  ),
  'OUTROS': TripExpenseMeta(
    label: 'Outros',
    icon: Icons.more_horiz,
    color: Color(0xFF64748B),
  ),
};

TripExpenseMeta tripExpenseMeta(String? key) {
  return tripExpenseCatalog[key] ?? tripExpenseCatalog['OUTROS']!;
}
