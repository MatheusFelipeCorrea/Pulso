import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TransactionSummaryCards extends StatelessWidget {
  const TransactionSummaryCards({super.key, required this.resumo, this.loading = false});

  final TransactionResumo? resumo;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    if (loading && resumo == null) {
      return Semantics(
        label: 'Carregando resumo',
        child: const Padding(
          padding: EdgeInsets.symmetric(vertical: PulsoTokens.space6),
          child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
        ),
      );
    }

    final brightness = Theme.of(context).brightness;
    final receitas = resumo?.receitas ?? 0;
    final despesas = resumo?.despesas ?? 0;
    final saldo = resumo?.saldo ?? 0;

    return Column(
      children: [
        _BalanceCard(label: 'Saldo', value: formatBrl(saldo), color: PulsoColors.accent(brightness)),
        const SizedBox(height: PulsoTokens.space2),
        Row(
          children: [
            Expanded(
              child: _MiniStat(
                label: 'Receitas',
                value: formatBrl(receitas),
                color: PulsoColors.successOf(brightness),
              ),
            ),
            const SizedBox(width: PulsoTokens.space2),
            Expanded(
              child: _MiniStat(
                label: 'Despesas',
                value: formatBrl(despesas),
                color: PulsoColors.dangerOf(brightness),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _BalanceCard extends StatelessWidget {
  const _BalanceCard({required this.label, required this.value, required this.color});

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(PulsoTokens.space5),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: Theme.of(context).textTheme.labelLarge?.copyWith(color: color)),
                const SizedBox(height: PulsoTokens.space1),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: color,
                        fontSize: PulsoTokens.fontXl,
                      ),
                ),
              ],
            ),
          ),
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.16), shape: BoxShape.circle),
            child: Icon(Icons.account_balance_wallet_outlined, color: color, size: 20),
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value, required this.color});

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        border: Border.all(color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.7)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelSmall?.copyWith(color: color)),
          const SizedBox(height: PulsoTokens.space1),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(color: color, fontWeight: PulsoTokens.weightBold),
          ),
        ],
      ),
    );
  }
}
