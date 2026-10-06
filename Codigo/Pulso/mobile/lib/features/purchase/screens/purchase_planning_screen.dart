import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/purchase/state/purchase_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class PurchasePlanningScreen extends StatefulWidget {
  const PurchasePlanningScreen({super.key});

  @override
  State<PurchasePlanningScreen> createState() => _PurchasePlanningScreenState();
}

class _PurchasePlanningScreenState extends State<PurchasePlanningScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<PurchaseController>().bootstrap();
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<PurchaseController>();
    final painel = controller.painel;
    final resumo = painel?.resumo;

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
        children: [
          const PulsoPageHeader(
            title: 'Planejamento de compra',
            subtitle: 'Lista de desejos, simulação de parcelas e “Comprei!”.',
            icon: Icons.shopping_cart_outlined,
          ),
          if (controller.loading && painel == null)
            const Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator()))
          else if (controller.error != null)
            PulsoEmptyState(title: 'Não foi possível carregar', description: controller.error!, icon: Icons.error_outline)
          else if (painel != null && resumo != null) ...[
            if (resumo.mediaImpactoRenda > 20)
              PulsoSurface(
                margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
                child: Text(
                  'As parcelas comprometem ${resumo.mediaImpactoRenda.toStringAsFixed(0)}% da renda. ${resumo.mediaImpactoRenda > 30 ? 'Risco alto.' : 'Atenção.'}',
                  style: TextStyle(color: PulsoColors.warningOf(Theme.of(context).brightness)),
                ),
              ),
            Row(
              children: [
                Expanded(child: _MiniStat(label: 'Lista', value: formatBrl(resumo.totalValor))),
                const SizedBox(width: PulsoTokens.space2),
                Expanded(child: _MiniStat(label: 'Itens', value: '${resumo.totalItens}')),
                const SizedBox(width: PulsoTokens.space2),
                Expanded(child: _MiniStat(label: 'Sobra', value: formatBrl(resumo.sobraMensal))),
              ],
            ),
            const SizedBox(height: PulsoTokens.space4),
            const PulsoSectionHeader(title: 'Desejados', icon: Icons.favorite_outline),
            if (painel.itens.isEmpty)
              const PulsoEmptyState(
                title: 'Lista vazia',
                description: 'Adicione um item desejado para simular o impacto na renda.',
                icon: Icons.shopping_bag_outlined,
              )
            else
              ...painel.itens.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
                  child: _ItemCard(
                    item: item,
                    onEdit: () => context.push('/purchase-planning/form', extra: item),
                    onBuy: () => _comprar(item),
                    onDelete: () => _excluir(item),
                  ),
                ),
              ),
            if (painel.comprados.isNotEmpty) ...[
              const PulsoSectionHeader(title: 'Histórico', icon: Icons.history),
              ...painel.comprados.take(8).map(
                    (item) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(item.nome),
                      subtitle: Text('${item.categoriaLabel ?? ''} · ${formatBrl(item.valorEstimado)}'),
                      trailing: item.diasNaLista == null ? null : Text('${item.diasNaLista} dias na lista'),
                    ),
                  ),
            ],
            if (resumo.dicas.isNotEmpty) ...[
              const PulsoSectionHeader(title: 'Dicas', icon: Icons.lightbulb_outline),
              ...resumo.dicas.map((dica) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text('• $dica'),
                  )),
            ],
          ],
        ],
      ),
    );
  }

  Future<void> _comprar(PurchaseItem item) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Marcar como comprado',
      message: 'Isso cria uma despesa e conclui a meta vinculada, se houver.',
      confirmLabel: 'Comprei!',
      danger: false,
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<PurchaseController>().comprar(item);
      if (!mounted) return;
      showPulsoSnack(context, 'Item comprado');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _excluir(PurchaseItem item) async {
    final ok = await showPulsoConfirm(context: context, title: 'Excluir item', message: 'Excluir “${item.nome}” da lista?');
    if (ok != true || !mounted) return;
    try {
      await context.read<PurchaseController>().excluir(item);
      if (!mounted) return;
      showPulsoSnack(context, 'Item excluído');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value});
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

class _ItemCard extends StatelessWidget {
  const _ItemCard({required this.item, required this.onEdit, required this.onBuy, required this.onDelete});

  final PurchaseItem item;
  final VoidCallback onEdit;
  final VoidCallback onBuy;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final nivel = item.comprometimentoNivel;
    final color = switch (nivel) {
      'arriscado' => PulsoColors.dangerOf(Theme.of(context).brightness),
      'atencao' => PulsoColors.warningOf(Theme.of(context).brightness),
      _ => PulsoColors.successOf(Theme.of(context).brightness),
    };
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(item.nome, style: Theme.of(context).textTheme.titleSmall)),
              Text(item.prioridade, style: Theme.of(context).textTheme.labelSmall),
            ],
          ),
          const SizedBox(height: 6),
          Text('${formatBrl(item.valorEstimado)} · ${item.categoriaLabel ?? item.categoria}'),
          if (item.mesesParaComprar != null) Text('Tempo estimado: ${item.mesesParaComprar} meses'),
          if (item.meta != null) Text('Meta: ${item.meta!.nome}'),
          if (item.comprometimentoPercentual != null)
            Text('Comprometimento ${item.comprometimentoPercentual!.toStringAsFixed(0)}%', style: TextStyle(color: color)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              FilledButton.tonal(onPressed: onBuy, child: const Text('Comprei!')),
              TextButton(onPressed: onEdit, child: const Text('Editar')),
              TextButton(onPressed: onDelete, child: const Text('Excluir')),
            ],
          ),
        ],
      ),
    );
  }
}
