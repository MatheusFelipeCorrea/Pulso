import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TransactionSummaryCards extends StatelessWidget {
  const TransactionSummaryCards({
    super.key,
    required this.resumo,
    this.loading = false,
  });

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
    final qtdReceitas = resumo?.quantidadeReceitas ?? 0;
    final qtdDespesas = resumo?.quantidadeDespesas ?? 0;

    return Column(
      children: [
        _HeroBalance(value: formatBrl(saldo)),
        const SizedBox(height: PulsoTokens.space3),
        Row(
          children: [
            Expanded(
              child: _MiniStat(
                label: 'Receitas',
                meta:
                    '$qtdReceitas lançamento${qtdReceitas == 1 ? '' : 's'} no período',
                value: formatBrl(receitas),
                color: PulsoColors.successOf(brightness),
                icon: Icons.arrow_upward,
              ),
            ),
            const SizedBox(width: PulsoTokens.space3),
            Expanded(
              child: _MiniStat(
                label: 'Despesas',
                meta:
                    '$qtdDespesas lançamento${qtdDespesas == 1 ? '' : 's'} no período',
                value: formatBrl(despesas),
                color: PulsoColors.dangerOf(brightness),
                icon: Icons.arrow_downward,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _HeroBalance extends StatelessWidget {
  const _HeroBalance({required this.value});

  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(PulsoTokens.space5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [PulsoColors.primary, PulsoColors.primaryDark],
        ),
        boxShadow: PulsoTokens.shadowLg(false),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Saldo do período',
                  style: Theme.of(context).textTheme.labelLarge
                      ?.copyWith(color: Colors.white70),
                ),
                const SizedBox(height: PulsoTokens.space1),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const PulsoSoftIcon(
            icon: Icons.account_balance_wallet_outlined,
            color: Colors.white,
            size: 48,
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({
    required this.label,
    required this.meta,
    required this.value,
    required this.color,
    required this.icon,
  });

  final String label;
  final String meta;
  final String value;
  final Color color;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PulsoSoftIcon(icon: icon, color: color, size: 32),
              const Spacer(),
            ],
          ),
          const SizedBox(height: PulsoTokens.space3),
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall
                ?.copyWith(color: color),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.titleSmall
                ?.copyWith(color: color, fontWeight: PulsoTokens.weightBold),
          ),
          Text(meta, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
