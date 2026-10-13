import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/goals/state/goals_controller.dart';
import 'package:pulso/features/goals/widgets/goal_tile.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  final _busca = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<GoalsController>().bootstrap();
    });
  }

  @override
  void dispose() {
    _busca.dispose();
    super.dispose();
  }

  Future<void> _openForm({PulsoMeta? meta}) async {
    await context.push('/goals/form', extra: meta);
    if (!mounted) return;
    await context.read<GoalsController>().reload();
  }

  Future<void> _aporte(PulsoMeta meta) async {
    final valorCtrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Registrar aporte'),
          content: TextField(
            controller: valorCtrl,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor (R\$)'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancelar'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Salvar'),
            ),
          ],
        );
      },
    );
    final valor = parseMoney(valorCtrl.text);
    valorCtrl.dispose();
    if (ok != true || valor == null || !mounted) return;
    try {
      await context.read<GoalRepository>().registrarAporte(
        meta.id,
        valor: valor,
        data: DateTime.now(),
      );
      if (!mounted) return;
      showPulsoSnack(context, 'Aporte registrado');
      await context.read<GoalsController>().reload();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _delete(PulsoMeta meta) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir meta',
      message: 'Excluir “${meta.nome}”? Os aportes também saem.',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<GoalsController>().excluir(meta);
      if (!mounted) return;
      showPulsoSnack(context, 'Meta excluída');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GoalsController>();
    final resumo = controller.resumo;

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
            title: 'Metas financeiras',
            subtitle:
                'Defina objetivos e acompanhe o progresso dos seus aportes.',
            icon: Icons.gps_fixed,
          ),
          if (resumo != null) ...[
            PulsoSurface(
              padding: const EdgeInsets.all(PulsoTokens.space4),
              child: Column(
                children: [
                  _GoalStat(
                    icon: Icons.gps_fixed,
                    color: PulsoColors.accent(Theme.of(context).brightness),
                    label: 'Total em metas',
                    value: formatBrl(resumo.totalEmMetas),
                  ),
                  const SizedBox(height: PulsoTokens.space3),
                  _GoalStat(
                    icon: Icons.attach_money,
                    color: PulsoColors.successOf(Theme.of(context).brightness),
                    label: 'Total acumulado',
                    value: formatBrl(resumo.totalAcumulado),
                  ),
                  const SizedBox(height: PulsoTokens.space3),
                  _GoalStat(
                    icon: Icons.trending_up,
                    color: PulsoColors.infoOf(Theme.of(context).brightness),
                    label: 'Progresso médio',
                    value: '${resumo.progressoMedio.toStringAsFixed(1)}%',
                  ),
                  const SizedBox(height: PulsoTokens.space3),
                  _GoalStat(
                    icon: Icons.pie_chart_outline,
                    color: PulsoColors.cyanOf(Theme.of(context).brightness),
                    label: 'Metas ativas',
                    value: '${resumo.metasAtivas}',
                  ),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            PulsoAlert(
              type: PulsoAlertType.info,
              icon: Icons.info_outline,
              title: 'Sugestão de economia',
              message:
                  'Para atingir todas as suas metas no prazo, você precisa guardar ${formatBrl(resumo.sugestaoMensal)}/mês.',
            ),
            const SizedBox(height: PulsoTokens.space3),
            PulsoSurface(
              padding: const EdgeInsets.all(PulsoTokens.space4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.bar_chart,
                        size: 16,
                        color: PulsoColors.accent(Theme.of(context).brightness),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Categorias das metas',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                    ],
                  ),
                  const SizedBox(height: PulsoTokens.space3),
                  _CategoryLegend(
                    color: PulsoColors.primary,
                    label: 'Curto prazo',
                    slice: resumo.curtoPrazo,
                  ),
                  _CategoryLegend(
                    color: PulsoColors.info,
                    label: 'Longo prazo',
                    slice: resumo.longoPrazo,
                  ),
                  _CategoryLegend(
                    color: PulsoColors.success,
                    label: 'Concluídas',
                    slice: resumo.concluidas,
                  ),
                  _CategoryLegend(
                    color: PulsoColors.warning,
                    label: 'Pausadas',
                    slice: resumo.pausadas,
                  ),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space4),
          ],
          TextField(
            controller: _busca,
            decoration: const InputDecoration(
              labelText: 'Buscar',
              prefixIcon: Icon(Icons.search),
            ),
            textInputAction: TextInputAction.search,
            onSubmitted: controller.search,
          ),
          const SizedBox(height: PulsoTokens.space3),
          Wrap(
            spacing: PulsoTokens.space2,
            runSpacing: PulsoTokens.space2,
            children: [
              ChoiceChip(
                avatar: const Icon(Icons.list, size: 16),
                label: Text(
                  'Todas${resumo == null ? '' : ' (${resumo.curtoPrazo.quantidade + resumo.longoPrazo.quantidade + resumo.concluidas.quantidade + resumo.pausadas.quantidade})'}',
                ),
                selected: controller.filters.status == null,
                onSelected: (_) => controller.applyTab(null),
              ),
              ChoiceChip(
                avatar: Icon(
                  Icons.play_arrow_outlined,
                  size: 16,
                  color: PulsoColors.accent(Theme.of(context).brightness),
                ),
                label: Text(
                  'Ativas${resumo == null ? '' : ' (${resumo.metasAtivas})'}',
                ),
                selected: controller.filters.status == 'ATIVA',
                onSelected: (_) => controller.applyTab('ATIVA'),
              ),
              ChoiceChip(
                avatar: Icon(
                  Icons.pause_outlined,
                  size: 16,
                  color: PulsoColors.warningOf(Theme.of(context).brightness),
                ),
                label: Text(
                  'Pausadas${resumo == null ? '' : ' (${resumo.pausadas.quantidade})'}',
                ),
                selected: controller.filters.status == 'PAUSADA',
                onSelected: (_) => controller.applyTab('PAUSADA'),
              ),
              ChoiceChip(
                avatar: Icon(
                  Icons.check_circle_outline,
                  size: 16,
                  color: PulsoColors.successOf(Theme.of(context).brightness),
                ),
                label: Text(
                  'Concluídas${resumo == null ? '' : ' (${resumo.concluidas.quantidade})'}',
                ),
                selected: controller.filters.status == 'CONCLUIDA',
                onSelected: (_) => controller.applyTab('CONCLUIDA'),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space4),
          if (controller.loading && controller.metas.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Não foi possível carregar',
              description: controller.error!,
            )
          else if (controller.metas.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma meta ainda',
              description: 'Crie uma meta para acompanhar o valor guardado, como na web.',
              icon: Icons.flag_outlined,
              actionLabel: 'Nova meta',
              onAction: () => _openForm(),
            )
          else
            ...controller.metas.map(
              (meta) => GoalTile(
                meta: meta,
                onOpen: () => _openForm(meta: meta),
                onContribute: () => _aporte(meta),
                onDelete: () => _delete(meta),
                onTogglePause: () => controller.togglePause(meta),
              ),
            ),
        ],
      ),
    );
  }
}

class _GoalStat extends StatelessWidget {
  const _GoalStat({
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
    return Row(
      children: [
        PulsoSoftIcon(icon: icon, color: color, size: 36),
        const SizedBox(width: PulsoTokens.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: Theme.of(context).textTheme.bodySmall),
              Text(value, style: Theme.of(context).textTheme.titleSmall),
            ],
          ),
        ),
      ],
    );
  }
}

class _CategoryLegend extends StatelessWidget {
  const _CategoryLegend({
    required this.color,
    required this.label,
    required this.slice,
  });

  final Color color;
  final String label;
  final GoalCategorySlice slice;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              '$label (${slice.quantidade})',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          Text(
            formatBrl(slice.total),
            style: Theme.of(context).textTheme.labelSmall
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
