import 'package:flutter/material.dart';
import 'package:pulso/core/widgets/category_icon.dart';

class ReminderCategoryMeta {
  const ReminderCategoryMeta({
    required this.label,
    required this.lucide,
    required this.color,
  });

  final String label;
  final String lucide;
  final Color color;

  IconData get icon => iconFromLucide(lucide);
}

const reminderCategoryMeta = <String, ReminderCategoryMeta>{
  'ALUGUEL': ReminderCategoryMeta(
    label: 'Aluguel',
    lucide: 'Home',
    color: Color(0xFFF97316),
  ),
  'CONDOMINIO': ReminderCategoryMeta(
    label: 'Condomínio',
    lucide: 'Building2',
    color: Color(0xFFF97316),
  ),
  'IPTU': ReminderCategoryMeta(
    label: 'IPTU',
    lucide: 'Landmark',
    color: Color(0xFF64748B),
  ),
  'SEGURO_RESIDENCIAL': ReminderCategoryMeta(
    label: 'Seguro residencial',
    lucide: 'Shield',
    color: Color(0xFF3B82F6),
  ),
  'LUZ': ReminderCategoryMeta(
    label: 'Conta de luz',
    lucide: 'Lightbulb',
    color: Color(0xFFEAB308),
  ),
  'AGUA': ReminderCategoryMeta(
    label: 'Água',
    lucide: 'Droplets',
    color: Color(0xFF3B82F6),
  ),
  'GAS': ReminderCategoryMeta(
    label: 'Gás',
    lucide: 'Flame',
    color: Color(0xFFF97316),
  ),
  'INTERNET': ReminderCategoryMeta(
    label: 'Internet',
    lucide: 'Globe',
    color: Color(0xFF6366F1),
  ),
  'TELEFONE': ReminderCategoryMeta(
    label: 'Telefone',
    lucide: 'Phone',
    color: Color(0xFF6366F1),
  ),
  'TV_ASSINATURA': ReminderCategoryMeta(
    label: 'TV / Assinatura',
    lucide: 'Tv',
    color: Color(0xFF8B5CF6),
  ),
  'FATURA_CARTAO': ReminderCategoryMeta(
    label: 'Fatura do cartão',
    lucide: 'CreditCard',
    color: Color(0xFF7C3AED),
  ),
  'EMPRESTIMO': ReminderCategoryMeta(
    label: 'Empréstimo',
    lucide: 'Banknote',
    color: Color(0xFF059669),
  ),
  'FINANCIAMENTO': ReminderCategoryMeta(
    label: 'Financiamento',
    lucide: 'Percent',
    color: Color(0xFF0EA5E9),
  ),
  'INVESTIMENTO': ReminderCategoryMeta(
    label: 'Investimento',
    lucide: 'TrendingUp',
    color: Color(0xFF10B981),
  ),
  'IMPOSTO': ReminderCategoryMeta(
    label: 'Imposto',
    lucide: 'Receipt',
    color: Color(0xFFEF4444),
  ),
  'DECLARACAO_IR': ReminderCategoryMeta(
    label: 'Declaração IR',
    lucide: 'FileText',
    color: Color(0xFFEF4444),
  ),
  'IPVA': ReminderCategoryMeta(
    label: 'IPVA',
    lucide: 'Car',
    color: Color(0xFF64748B),
  ),
  'SEGURO_VEICULO': ReminderCategoryMeta(
    label: 'Seguro do veículo',
    lucide: 'Shield',
    color: Color(0xFF3B82F6),
  ),
  'LICENCIAMENTO': ReminderCategoryMeta(
    label: 'Licenciamento',
    lucide: 'FileCheck',
    color: Color(0xFF64748B),
  ),
  'REVISAO_VEICULO': ReminderCategoryMeta(
    label: 'Revisão do veículo',
    lucide: 'Wrench',
    color: Color(0xFF64748B),
  ),
  'MULTA': ReminderCategoryMeta(
    label: 'Multa',
    lucide: 'Zap',
    color: Color(0xFFEF4444),
  ),
  'PLANO_SAUDE': ReminderCategoryMeta(
    label: 'Plano de saúde',
    lucide: 'HeartPulse',
    color: Color(0xFFEC4899),
  ),
  'CONSULTA': ReminderCategoryMeta(
    label: 'Consulta',
    lucide: 'Stethoscope',
    color: Color(0xFFEC4899),
  ),
  'EXAME': ReminderCategoryMeta(
    label: 'Exame',
    lucide: 'HeartPulse',
    color: Color(0xFFEC4899),
  ),
  'MEDICAMENTO': ReminderCategoryMeta(
    label: 'Medicamento',
    lucide: 'Pill',
    color: Color(0xFFEC4899),
  ),
  'ACADEMIA': ReminderCategoryMeta(
    label: 'Academia',
    lucide: 'Award',
    color: Color(0xFF10B981),
  ),
  'MENSALIDADE_ESCOLA': ReminderCategoryMeta(
    label: 'Mensalidade escola',
    lucide: 'GraduationCap',
    color: Color(0xFF10B981),
  ),
  'MENSALIDADE_FACULDADE': ReminderCategoryMeta(
    label: 'Mensalidade faculdade',
    lucide: 'GraduationCap',
    color: Color(0xFF10B981),
  ),
  'CURSO': ReminderCategoryMeta(
    label: 'Curso',
    lucide: 'BookOpen',
    color: Color(0xFF6366F1),
  ),
  'MATERIAL_ESCOLAR': ReminderCategoryMeta(
    label: 'Material escolar',
    lucide: 'BookOpen',
    color: Color(0xFF6366F1),
  ),
  'STREAMING': ReminderCategoryMeta(
    label: 'Streaming',
    lucide: 'Monitor',
    color: Color(0xFF8B5CF6),
  ),
  'SOFTWARE': ReminderCategoryMeta(
    label: 'Software',
    lucide: 'Monitor',
    color: Color(0xFF0EA5E9),
  ),
  'DOMINIO': ReminderCategoryMeta(
    label: 'Domínio',
    lucide: 'Globe',
    color: Color(0xFF6366F1),
  ),
  'HOSPEDAGEM': ReminderCategoryMeta(
    label: 'Hospedagem',
    lucide: 'Cloud',
    color: Color(0xFF06B6D4),
  ),
  'NUVEM': ReminderCategoryMeta(
    label: 'Nuvem / Storage',
    lucide: 'Cloud',
    color: Color(0xFF06B6D4),
  ),
  'VACINA_PET': ReminderCategoryMeta(
    label: 'Vacina pet',
    lucide: 'PawPrint',
    color: Color(0xFFF97316),
  ),
  'CONSULTA_PET': ReminderCategoryMeta(
    label: 'Consulta pet',
    lucide: 'PawPrint',
    color: Color(0xFFF97316),
  ),
  'RACAO_PET': ReminderCategoryMeta(
    label: 'Ração pet',
    lucide: 'PawPrint',
    color: Color(0xFFF97316),
  ),
  'NOTA_FISCAL': ReminderCategoryMeta(
    label: 'Nota fiscal',
    lucide: 'Receipt',
    color: Color(0xFF475569),
  ),
  'FOLHA_PAGAMENTO': ReminderCategoryMeta(
    label: 'Folha de pagamento',
    lucide: 'Briefcase',
    color: Color(0xFF475569),
  ),
  'CONTRATO': ReminderCategoryMeta(
    label: 'Contrato',
    lucide: 'FileText',
    color: Color(0xFF475569),
  ),
  'RENOVACAO_CONTRATO': ReminderCategoryMeta(
    label: 'Renovação de contrato',
    lucide: 'RefreshCw',
    color: Color(0xFF475569),
  ),
  'CERTIDAO': ReminderCategoryMeta(
    label: 'Certidão',
    lucide: 'FileCheck',
    color: Color(0xFF475569),
  ),
  'ALVARA': ReminderCategoryMeta(
    label: 'Alvará',
    lucide: 'Building2',
    color: Color(0xFF475569),
  ),
  'ANIVERSARIO': ReminderCategoryMeta(
    label: 'Aniversário',
    lucide: 'Cake',
    color: Color(0xFFE11D48),
  ),
  'REUNIAO': ReminderCategoryMeta(
    label: 'Reunião',
    lucide: 'Users',
    color: Color(0xFF71717A),
  ),
  'COMPROMISSO': ReminderCategoryMeta(
    label: 'Compromisso',
    lucide: 'Bell',
    color: Color(0xFF71717A),
  ),
  'VIAGEM': ReminderCategoryMeta(
    label: 'Viagem',
    lucide: 'Plane',
    color: Color(0xFF06B6D4),
  ),
  'RENOVACAO_DOCUMENTO': ReminderCategoryMeta(
    label: 'Renovação de documento',
    lucide: 'FileCheck',
    color: Color(0xFF71717A),
  ),
  'RECORRENTE': ReminderCategoryMeta(
    label: 'Recorrente',
    lucide: 'Repeat',
    color: Color(0xFF7C3AED),
  ),
  'PARCELAMENTO': ReminderCategoryMeta(
    label: 'Parcelamento',
    lucide: 'CreditCard',
    color: Color(0xFF7C3AED),
  ),
  'OUTRO': ReminderCategoryMeta(
    label: 'Outro',
    lucide: 'Box',
    color: Color(0xFF71717A),
  ),
  'FATURA': ReminderCategoryMeta(
    label: 'Fatura do cartão',
    lucide: 'CreditCard',
    color: Color(0xFF7C3AED),
  ),
  'MENSALIDADE': ReminderCategoryMeta(
    label: 'Mensalidade',
    lucide: 'GraduationCap',
    color: Color(0xFF10B981),
  ),
};

ReminderCategoryMeta reminderMeta(String? categoria) {
  final key = switch (categoria) {
    'FATURA' => 'FATURA_CARTAO',
    'MENSALIDADE' => 'MENSALIDADE_FACULDADE',
    _ => categoria,
  };
  return reminderCategoryMeta[key] ?? reminderCategoryMeta['OUTRO']!;
}
