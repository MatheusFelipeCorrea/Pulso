import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TransactionSummaryCards extends StatelessWidget {
  const TransactionSummaryCards({super.key, required this.resumo});

  final TransactionResumo? resumo;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _Card(
            label: 'Receitas',
            value: formatBrl(resumo?.receitas ?? 0),
            color: PulsoColors.success,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _Card(
            label: 'Despesas',
            value: formatBrl(resumo?.despesas ?? 0),
            color: PulsoColors.danger,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _Card(
            label: 'Saldo',
            value: formatBrl(resumo?.saldo ?? 0),
            color: PulsoColors.primary,
          ),
        ),
      ],
    );
  }
}

class _Card extends StatelessWidget {
  const _Card({required this.label, required this.value, required this.color});

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: color,
                    fontWeight: FontWeight.w700,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
