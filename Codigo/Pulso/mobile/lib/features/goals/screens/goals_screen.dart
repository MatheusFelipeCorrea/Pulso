import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
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
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Salvar')),
          ],
        );
      },
    );
    final valor = parseMoney(valorCtrl.text);
    valorCtrl.dispose();
    if (ok != true || valor == null || !mounted) return;
    try {
      await context.read<GoalRepository>().registrarAporte(meta.id, valor: valor, data: DateTime.now());
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
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, PulsoTokens.space8),
        children: [
          if (resumo != null) ...[
            Text('Em metas ${formatBrl(resumo.totalEmMetas)}', style: Theme.of(context).textTheme.titleSmall),
            Text(
              'Acumulado ${formatBrl(resumo.totalAcumulado)} · ${resumo.metasAtivas} ativas',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: PulsoTokens.space3),
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
            children: [
              ChoiceChip(
                label: const Text('Todas'),
                selected: controller.filters.status == null,
                onSelected: (_) => controller.applyTab(null),
              ),
              ChoiceChip(
                label: const Text('Ativas'),
                selected: controller.filters.status == 'ATIVA',
                onSelected: (_) => controller.applyTab('ATIVA'),
              ),
              ChoiceChip(
                label: const Text('Pausadas'),
                selected: controller.filters.status == 'PAUSADA',
                onSelected: (_) => controller.applyTab('PAUSADA'),
              ),
              ChoiceChip(
                label: const Text('Concluídas'),
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
            PulsoEmptyState(title: 'Não foi possível carregar', description: controller.error!)
          else if (controller.metas.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma meta ainda',
              description: 'Crie uma meta para acompanhar o valor guardado.',
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
