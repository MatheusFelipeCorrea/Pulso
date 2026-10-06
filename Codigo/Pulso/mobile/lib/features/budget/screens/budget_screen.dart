import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/budget/data/budget_models.dart';
import 'package:pulso/features/budget/state/budget_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class BudgetScreen extends StatefulWidget {
  const BudgetScreen({super.key});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<BudgetController>().bootstrap();
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<BudgetController>();
    final status = controller.status;
    final resumo = status?.resumo;
    final brightness = Theme.of(context).brightness;

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
        children: [
          PulsoPageHeader(
            title: 'Orçamento Mensal',
            subtitle: 'Defina limites por categoria e acompanhe seus gastos no período.',
            icon: Icons.pie_chart_outline,
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(onPressed: () => controller.shiftMonth(-1), icon: const Icon(Icons.chevron_left)),
                Text(TransactionPeriod.label(controller.mes), style: Theme.of(context).textTheme.titleSmall),
                IconButton(onPressed: () => controller.shiftMonth(1), icon: const Icon(Icons.chevron_right)),
              ],
            ),
          ),
          if (controller.loading && status == null)
            const Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator()))
          else if (controller.error != null)
            PulsoEmptyState(title: 'Não foi possível carregar', description: controller.error!, icon: Icons.error_outline)
          else if (status != null && resumo != null) ...[
            if (resumo.orcamentoExcedeRenda)
              PulsoSurface(
                margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
                child: Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: PulsoColors.warningOf(brightness)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Seu orçamento total (${formatBrl(resumo.orcamentoTotal)}) excede a renda planejada (${formatBrl(status.rendaMensalPlanejada)}).',
                      ),
                    ),
                  ],
                ),
              ),
            const PulsoSectionHeader(title: 'Visão geral do orçamento', icon: Icons.insights_outlined),
            PulsoHScroll(
              height: 148,
              itemWidth: 188,
              children: [
                _Metric(
                  label: 'Total do orçamento',
                  value: formatBrl(resumo.orcamentoTotal),
                  icon: Icons.account_balance_wallet_outlined,
                  color: PulsoColors.accent(brightness),
                ),
                _Metric(
                  label: 'Total já gasto',
                  value: formatBrl(resumo.gastoTotal),
                  icon: Icons.trending_down,
                  color: PulsoColors.dangerOf(brightness),
                ),
                _Metric(
                  label: 'Restante disponível',
                  value: formatBrl(resumo.restanteTotal),
                  icon: Icons.savings_outlined,
                  color: PulsoColors.successOf(brightness),
                ),
              ],
            ),
            const SizedBox(height: PulsoTokens.space3),
            PulsoSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  LinearProgressIndicator(
                    value: (resumo.percentualUsado / 100).clamp(0, 1),
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(99),
                    color: PulsoColors.accent(brightness),
                    backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
                  ),
                  const SizedBox(height: 8),
                  Text('${resumo.percentualUsado.round()}% do orçamento utilizado'),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space4),
            if (status.categorias.isEmpty)
              PulsoEmptyState(
                title: 'Nenhum limite definido para este mês',
                description: 'Reaproveite os limites do mês anterior ou comece um orçamento novo.',
                icon: Icons.pie_chart_outline,
                actionLabel: 'Usar limites do mês anterior',
                onAction: _copiar,
              )
            else ...[
              const PulsoSectionHeader(title: 'Orçamento por categoria', icon: Icons.category_outlined),
              ...status.categorias.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
                  child: _CategoryCard(item: item),
                ),
              ),
            ],
            if (status.categoriasSemOrcamento.isNotEmpty) ...[
              const SizedBox(height: PulsoTokens.space3),
              const PulsoSectionHeader(title: 'Categorias sem limite', icon: Icons.add_circle_outline),
              ...status.categoriasSemOrcamento.map(
                (item) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CategoryGlyph(
                    icone: item.icone,
                    color: parseHexColor(item.cor) ?? PulsoColors.accent(brightness),
                    size: 36,
                  ),
                  title: Text(item.nome),
                  trailing: TextButton.icon(
                    onPressed: () => context.push('/budget/edit'),
                    icon: const Icon(Icons.edit_outlined, size: 16),
                    label: const Text('Definir'),
                  ),
                ),
              ),
            ],
          ],
        ],
      ),
    );
  }

  Future<void> _copiar() async {
    try {
      await context.read<BudgetController>().copiarMesAnterior();
      if (!mounted) return;
      showPulsoSnack(context, 'Orçamento copiado');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value, required this.icon, required this.color});
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PulsoSoftIcon(icon: icon, color: color, size: 32),
          const SizedBox(height: PulsoTokens.space3),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: 4),
          Text(value, style: Theme.of(context).textTheme.titleSmall?.copyWith(color: color, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({required this.item});
  final BudgetCategoria item;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final catColor = parseHexColor(item.categoriaCor) ?? PulsoColors.accent(brightness);
    final statusColor = switch (item.status) {
      'estourado' => PulsoColors.dangerOf(brightness),
      'alerta' => PulsoColors.warningOf(brightness),
      _ => catColor,
    };
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CategoryGlyph(icone: item.categoriaIcone, color: catColor, size: 40),
              const SizedBox(width: 12),
              Expanded(child: Text(item.categoriaNome, style: Theme.of(context).textTheme.titleSmall)),
              Text('${item.percentualUsado.round()}%', style: TextStyle(color: statusColor, fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 10),
          LinearProgressIndicator(
            value: (item.percentualUsado / 100).clamp(0, 1),
            minHeight: 8,
            borderRadius: BorderRadius.circular(99),
            color: statusColor,
            backgroundColor: Theme.of(context).colorScheme.surfaceContainerHighest,
          ),
          const SizedBox(height: 8),
          Text('${formatBrl(item.gastoValor)} / ${formatBrl(item.limiteValor)} · resta ${formatBrl(item.restanteValor)}'),
          if (item.valorRollover > 0 || item.status != 'normal') ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                if (item.valorRollover > 0)
                  Chip(
                    avatar: const Icon(Icons.autorenew, size: 14),
                    label: Text('+ ${formatBrl(item.valorRollover)}'),
                    visualDensity: VisualDensity.compact,
                  ),
                if (item.status == 'alerta')
                  Chip(
                    avatar: Icon(Icons.notifications_outlined, size: 14, color: PulsoColors.warningOf(brightness)),
                    label: const Text('80%'),
                    visualDensity: VisualDensity.compact,
                  ),
                if (item.status == 'estourado')
                  Chip(
                    avatar: Icon(Icons.warning_amber_rounded, size: 14, color: PulsoColors.dangerOf(brightness)),
                    label: const Text('Estourou!'),
                    visualDensity: VisualDensity.compact,
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
