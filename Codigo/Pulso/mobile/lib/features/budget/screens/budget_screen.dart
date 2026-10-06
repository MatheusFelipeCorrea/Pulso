import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
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

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
        children: [
          PulsoPageHeader(
            title: 'Orçamento mensal',
            subtitle: 'Limites por categoria, progresso e rollover opcional.',
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
                child: Text(
                  'O orçamento total ultrapassa a renda planejada (${formatBrl(status.rendaMensalPlanejada)}).',
                  style: TextStyle(color: PulsoColors.warningOf(Theme.of(context).brightness)),
                ),
              ),
            Row(
              children: [
                Expanded(child: _Stat(label: 'Limite', value: formatBrl(resumo.orcamentoTotal))),
                const SizedBox(width: PulsoTokens.space2),
                Expanded(child: _Stat(label: 'Gasto', value: formatBrl(resumo.gastoTotal))),
                const SizedBox(width: PulsoTokens.space2),
                Expanded(child: _Stat(label: 'Restante', value: formatBrl(resumo.restanteTotal))),
              ],
            ),
            const SizedBox(height: PulsoTokens.space4),
            if (status.categorias.isEmpty)
              PulsoEmptyState(
                title: 'Sem limites neste mês',
                description: 'Copie o mês anterior ou defina os limites das categorias de despesa.',
                icon: Icons.pie_chart_outline,
                actionLabel: 'Copiar mês anterior',
                onAction: _copiar,
              )
            else
              ...status.categorias.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
                    child: _CategoryCard(item: item),
                  )),
            if (status.categoriasSemOrcamento.isNotEmpty) ...[
              const SizedBox(height: PulsoTokens.space3),
              const PulsoSectionHeader(title: 'Sem limite', icon: Icons.category_outlined),
              ...status.categoriasSemOrcamento.map(
                (item) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(item.nome),
                  trailing: TextButton(onPressed: () => context.push('/budget/edit'), child: const Text('Definir')),
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

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: 6),
          Text(value, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
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
    final scheme = Theme.of(context).colorScheme;
    final color = switch (item.status) {
      'estourado' => PulsoColors.dangerOf(Theme.of(context).brightness),
      'alerta' => PulsoColors.warningOf(Theme.of(context).brightness),
      _ => PulsoColors.accent(Theme.of(context).brightness),
    };
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(item.categoriaNome, style: Theme.of(context).textTheme.titleSmall)),
              Text('${item.percentualUsado.round()}%', style: TextStyle(color: color, fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: (item.percentualUsado / 100).clamp(0, 1),
            color: color,
            backgroundColor: scheme.surfaceContainerHighest,
          ),
          const SizedBox(height: 8),
          Text('${formatBrl(item.gastoValor)} de ${formatBrl(item.limiteValor)} · resta ${formatBrl(item.restanteValor)}'),
          if (item.valorRollover > 0)
            Text('Rollover ${formatBrl(item.valorRollover)}', style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
  }
}
