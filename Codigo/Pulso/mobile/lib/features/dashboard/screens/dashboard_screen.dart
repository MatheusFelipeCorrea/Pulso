import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/dashboard/state/dashboard_controller.dart';
import 'package:pulso/features/dashboard/utils/dashboard_labels.dart';
import 'package:pulso/features/dashboard/widgets/dashboard_charts.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<DashboardController>().bootstrap();
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<DashboardController>();
    final dados = controller.dados;
    final brightness = Theme.of(context).brightness;

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(
          PulsoTokens.space4,
          PulsoTokens.space2,
          PulsoTokens.space4,
          96,
        ),
        children: [
          const PulsoPageHeader(
            title: 'Dashboard',
            subtitle: 'O pulso do mês: saldo, categorias, alertas e metas.',
            icon: Icons.space_dashboard_outlined,
          ),
          Row(
            children: [
              IconButton(
                tooltip: 'Mês anterior',
                onPressed: controller.loading
                    ? null
                    : () => controller.mudarMes(-1),
                icon: const Icon(Icons.chevron_left),
              ),
              Expanded(
                child: Text(
                  TransactionPeriod.label(controller.mes),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              IconButton(
                tooltip: 'Próximo mês',
                onPressed: controller.loading
                    ? null
                    : () => controller.mudarMes(1),
                icon: const Icon(Icons.chevron_right),
              ),
            ],
          ),
          if (controller.loading && dados == null)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null && dados == null)
            PulsoEmptyState(
              title: 'Dashboard indisponível',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.reload,
            )
          else if (dados != null) ...[
            PulsoSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Saldo disponível',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: PulsoTokens.space1),
                  Text(
                    formatBrl(dados.saldoTotal),
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: PulsoTokens.space2),
                  _VariacaoBadge(
                    tipo: dados.variacao.tipo,
                    valor: dados.variacao.valor,
                  ),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            Row(
              children: [
                Expanded(
                  child: _StatCard(
                    icon: Icons.south_west,
                    color: PulsoColors.successOf(brightness),
                    label: 'Receitas',
                    value: formatBrl(dados.receitas),
                  ),
                ),
                const SizedBox(width: PulsoTokens.space3),
                Expanded(
                  child: _StatCard(
                    icon: Icons.north_east,
                    color: PulsoColors.dangerOf(brightness),
                    label: 'Despesas',
                    value: formatBrl(dados.despesas),
                  ),
                ),
              ],
            ),
            const SizedBox(height: PulsoTokens.space3),
            DashboardIncomeExpenseBars(
              receitas: dados.receitas,
              despesas: dados.despesas,
            ),
            const SizedBox(height: PulsoTokens.space5),
            const PulsoSectionHeader(
              title: 'Recursos',
              icon: Icons.account_balance_wallet_outlined,
            ),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: dados.recursos.map((recurso) {
                final kind = badgeKindFromRecurso(recurso.tipo);
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (kind != null)
                      PulsoBadge.kind(
                        kind: kind,
                        brightness: brightness,
                        compact: true,
                      )
                    else
                      PulsoBadge.custom(
                        label: recurso.tipo,
                        icon: Icons.payments_outlined,
                        color: PulsoColors.accent(brightness),
                        compact: true,
                      ),
                    const SizedBox(height: 4),
                    Text(
                      formatBrl(recurso.saldo),
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                  ],
                );
              }).toList(),
            ),
            if (dados.alertas.isNotEmpty) ...[
              const SizedBox(height: PulsoTokens.space5),
              const PulsoSectionHeader(
                title: 'Alertas de orçamento',
                icon: Icons.warning_amber_outlined,
              ),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: dados.alertas.map((alerta) {
                  final color = alerta.estourou
                      ? PulsoColors.dangerOf(brightness)
                      : PulsoColors.warningOf(brightness);
                  return PulsoBadge.custom(
                    label:
                        '${alerta.categoriaNome} · ${dashboardAlertaLabel(alerta.percentualUsado)}',
                    icon: alerta.estourou
                        ? Icons.error_outline
                        : Icons.timelapse,
                    color: color,
                  );
                }).toList(),
              ),
            ],
            const SizedBox(height: PulsoTokens.space5),
            const PulsoSectionHeader(
              title: 'Gastos por categoria',
              icon: Icons.donut_large_outlined,
            ),
            DashboardCategoryDonut(categorias: dados.categorias),
            const SizedBox(height: PulsoTokens.space4),
            PulsoSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      PulsoSoftIcon(
                        icon: Icons.favorite_outline,
                        color: PulsoColors.accent(brightness),
                      ),
                      const SizedBox(width: PulsoTokens.space3),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Saúde financeira',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            Text(
                              '${dados.saude.label} · ${dados.saude.score}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      PulsoBadge.custom(
                        label: dados.saude.label,
                        icon: Icons.monitor_heart_outlined,
                        color: _saudeColor(brightness, dados.saude.score),
                        compact: true,
                      ),
                    ],
                  ),
                  if (dados.saude.mensagem.isNotEmpty) ...[
                    const SizedBox(height: PulsoTokens.space3),
                    Text(dados.saude.mensagem),
                  ],
                  for (final item in dados.saude.checklist) ...[
                    const SizedBox(height: PulsoTokens.space2),
                    Row(
                      children: [
                        Icon(
                          item.ok
                              ? Icons.check_circle_outline
                              : Icons.cancel_outlined,
                          size: 16,
                          color: item.ok
                              ? PulsoColors.successOf(brightness)
                              : PulsoColors.dangerOf(brightness),
                        ),
                        const SizedBox(width: 8),
                        Expanded(child: Text(item.texto)),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            if (dados.metas.isNotEmpty) ...[
              const SizedBox(height: PulsoTokens.space5),
              const PulsoSectionHeader(
                title: 'Metas ativas',
                icon: Icons.gps_fixed,
              ),
              ...dados.metas.map(
                (meta) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.flag_outlined),
                  title: Text(meta.nome),
                  subtitle: LinearProgressIndicator(
                    value: (meta.progresso.clamp(0, 100)) / 100,
                  ),
                  trailing: Text('${meta.progresso.round()}%'),
                ),
              ),
            ],
            const SizedBox(height: PulsoTokens.space4),
            const PulsoSectionHeader(
              title: 'Últimas transações',
              icon: Icons.receipt_long_outlined,
            ),
            if (dados.transacoes.isEmpty)
              Text(
                'Nenhuma transação recente.',
                style: Theme.of(context).textTheme.bodySmall,
              )
            else
              ...dados.transacoes.take(5).map((tx) {
                final receita = tx.tipo == 'RECEITA';
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    receita ? Icons.south_west : Icons.north_east,
                    color: receita
                        ? PulsoColors.successOf(brightness)
                        : PulsoColors.dangerOf(brightness),
                  ),
                  title: Text(
                    (tx.descricao ?? '').trim().isEmpty
                        ? tx.tipo
                        : tx.descricao!,
                  ),
                  subtitle: tx.categoriaNome == null
                      ? null
                      : Text(tx.categoriaNome!),
                  trailing: Text(formatBrl(tx.valor)),
                );
              }),
          ],
        ],
      ),
    );
  }

  Color _saudeColor(Brightness brightness, int score) {
    switch (dashboardSaudeTom(score)) {
      case 'excelente':
      case 'bom':
        return PulsoColors.successOf(brightness);
      case 'atencao':
        return PulsoColors.dangerOf(brightness);
      default:
        return PulsoColors.warningOf(brightness);
    }
  }
}

class _VariacaoBadge extends StatelessWidget {
  const _VariacaoBadge({required this.tipo, required this.valor});

  final String tipo;
  final double valor;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final visual = dashboardVariacaoVisual(tipo, valor);
    final color = switch (visual.tom) {
      'alta' => PulsoColors.successOf(brightness),
      'queda' => PulsoColors.dangerOf(brightness),
      _ => PulsoColors.secondaryText(brightness),
    };
    return PulsoBadge.custom(
      label: dashboardVariacaoLabel(tipo, valor),
      icon: visual.icon,
      color: color,
      compact: true,
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.color,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final Color color;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PulsoSoftIcon(icon: icon, color: color, size: 36),
          const SizedBox(height: PulsoTokens.space2),
          Text(label, style: Theme.of(context).textTheme.labelMedium),
          Text(value, style: Theme.of(context).textTheme.titleMedium),
        ],
      ),
    );
  }
}
