import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
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
            title: 'Planejamento de Compra',
            subtitle: 'Planeje suas compras de forma inteligente e sem comprometer seu futuro.',
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
                child: Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: PulsoColors.warningOf(Theme.of(context).brightness)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Suas parcelas atuais comprometem ${resumo.mediaImpactoRenda.toStringAsFixed(0)}% da sua renda. Cuidado ao assumir novas parcelas.',
                      ),
                    ),
                  ],
                ),
              ),
            const PulsoSectionHeader(title: 'Resumo do planejamento', icon: Icons.description_outlined),
            PulsoHScroll(
              height: 148,
              itemWidth: 176,
              children: [
                _MiniStat(
                  label: 'Total dos itens',
                  value: formatBrl(resumo.totalValor),
                  icon: Icons.shopping_bag_outlined,
                  color: PulsoColors.accent(Theme.of(context).brightness),
                ),
                _MiniStat(
                  label: 'Impacto na renda',
                  value: '${resumo.mediaImpactoRenda.toStringAsFixed(0)}%',
                  icon: Icons.percent,
                  color: resumo.mediaImpactoRenda > 30
                      ? PulsoColors.dangerOf(Theme.of(context).brightness)
                      : resumo.mediaImpactoRenda > 20
                          ? PulsoColors.warningOf(Theme.of(context).brightness)
                          : PulsoColors.successOf(Theme.of(context).brightness),
                ),
                _MiniStat(
                  label: 'Itens',
                  value: '${resumo.totalItens}',
                  icon: Icons.inventory_2_outlined,
                  color: PulsoColors.infoOf(Theme.of(context).brightness),
                ),
                _MiniStat(
                  label: 'Sobra mensal',
                  value: formatBrl(resumo.sobraMensal),
                  icon: Icons.savings_outlined,
                  color: PulsoColors.successOf(Theme.of(context).brightness),
                ),
              ],
            ),
            if (resumo.categorias.isNotEmpty) ...[
              const SizedBox(height: PulsoTokens.space3),
              const PulsoSectionHeader(title: 'Breakdown por categoria', icon: Icons.pie_chart_outline),
              _CategoryBreakdown(categorias: resumo.categorias),
            ],
            const SizedBox(height: PulsoTokens.space4),
            const PulsoSectionHeader(title: 'Itens desejados', icon: Icons.favorite_outline),
            if (painel.itens.isEmpty)
              const PulsoEmptyState(
                title: 'Nenhum item na lista',
                description: 'Adicione o que você deseja comprar e acompanhe quanto tempo levará para realizar.',
                icon: Icons.shopping_cart_outlined,
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
            const SizedBox(height: PulsoTokens.space5),
            const Divider(),
            const SizedBox(height: PulsoTokens.space4),
            const PulsoSectionHeader(title: 'Comprados recentemente', icon: Icons.history),
            if (painel.comprados.isEmpty)
              PulsoSurface(
                child: Text(
                  'Nenhuma compra registrada ainda. Marque um item como “Comprei!” para vê-lo aqui.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              )
            else
              PulsoSurface(
                padding: EdgeInsets.zero,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(minWidth: 560),
                    child: DataTable(
                      headingTextStyle: Theme.of(context).textTheme.labelSmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.4,
                          ),
                      columns: const [
                        DataColumn(label: Text('Item')),
                        DataColumn(label: Text('Categoria')),
                        DataColumn(label: Text('Valor')),
                        DataColumn(label: Text('Comprado em')),
                      ],
                      rows: [
                        for (final item in painel.comprados.take(8))
                          DataRow(
                            cells: [
                              DataCell(
                                Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: _ProductThumb(url: item.imagemUrl, categoria: item.categoria, size: 32),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(item.nome),
                                  ],
                                ),
                              ),
                              DataCell(Text(item.categoriaLabel ?? purchaseCategorias[item.categoria] ?? item.categoria)),
                              DataCell(Text(formatBrl(item.valorEstimado))),
                              DataCell(Text(formatShortDate(item.compradoEm))),
                            ],
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            if (resumo.dicas.isNotEmpty) ...[
              const PulsoSectionHeader(title: 'Dicas inteligentes', icon: Icons.lightbulb_outline),
              ...resumo.dicas.map(
                (dica) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.check_circle_outline, size: 16, color: PulsoColors.successOf(Theme.of(context).brightness)),
                      const SizedBox(width: 8),
                      Expanded(child: Text(dica)),
                    ],
                  ),
                ),
              ),
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
  const _MiniStat({required this.label, required this.value, required this.icon, required this.color});
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
    final look = purchaseLook(item.categoria);
    final brightness = Theme.of(context).brightness;
    final prioridade = badgeKindFromPrioridade(item.prioridade);
    final nivelIcon = switch (item.comprometimentoNivel) {
      'arriscado' => Icons.cancel_outlined,
      'atencao' => Icons.warning_amber_rounded,
      _ => Icons.check_circle_outline,
    };
    final nivelColor = switch (item.comprometimentoNivel) {
      'arriscado' => PulsoColors.dangerOf(brightness),
      'atencao' => PulsoColors.warningOf(brightness),
      _ => PulsoColors.successOf(brightness),
    };

    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: _ProductThumb(url: item.imagemUrl, categoria: item.categoria, size: 72),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.nome, style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 4),
                    if (prioridade != null) PulsoBadge.kind(kind: prioridade, brightness: brightness, compact: true),
                    const SizedBox(height: 6),
                    Text(formatBrl(item.valorEstimado), style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                    Text(item.categoriaLabel ?? purchaseCategorias[item.categoria] ?? item.categoria),
                  ],
                ),
              ),
            ],
          ),
          if (item.mesesParaComprar != null) ...[
            const SizedBox(height: 8),
            Text('Compra à vista em ~${item.mesesParaComprar} ${item.mesesParaComprar == 1 ? 'mês' : 'meses'}'),
          ],
          if (item.simulacoes.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text('Simulação de parcelamento', style: Theme.of(context).textTheme.labelSmall),
            ...item.simulacoes.take(3).map(
                  (sim) => Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Row(
                      children: [
                        Expanded(child: Text('${sim.parcelas}x de ${formatBrl(sim.parcela)} · ${sim.percentual.toStringAsFixed(0)}% da renda')),
                        Icon(
                          sim.nivel == 'arriscado'
                              ? Icons.cancel_outlined
                              : sim.nivel == 'atencao'
                                  ? Icons.warning_amber_rounded
                                  : Icons.check_circle_outline,
                          size: 16,
                          color: sim.nivel == 'arriscado'
                              ? PulsoColors.dangerOf(brightness)
                              : sim.nivel == 'atencao'
                                  ? PulsoColors.warningOf(brightness)
                                  : PulsoColors.successOf(brightness),
                        ),
                      ],
                    ),
                  ),
                ),
          ],
          if (item.meta != null) ...[
            const SizedBox(height: 8),
            Text('Meta vinculada: ${item.meta!.nome}'),
            LinearProgressIndicator(value: (item.meta!.percentual / 100).clamp(0, 1), color: look.color),
          ],
          if (item.observacoes != null && item.observacoes!.trim().isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(item.observacoes!.trim(), style: Theme.of(context).textTheme.bodySmall),
          ],
          if (item.linkProduto != null && item.linkProduto!.trim().isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.open_in_new, size: 14, color: PulsoColors.infoOf(brightness)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Ver produto',
                    style: TextStyle(color: PulsoColors.infoOf(brightness), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ],
          if (item.comprometimentoPercentual != null) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(nivelIcon, size: 16, color: nivelColor),
                const SizedBox(width: 6),
                Text('Compromete ${item.comprometimentoPercentual!.toStringAsFixed(0)}% da renda', style: TextStyle(color: nivelColor)),
              ],
            ),
          ],
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: [
              FilledButton.icon(onPressed: onBuy, icon: const Icon(Icons.check_circle_outline, size: 16), label: const Text('Comprei!')),
              IconButton.outlined(onPressed: onEdit, tooltip: 'Editar', icon: const Icon(Icons.edit_outlined)),
              IconButton.outlined(onPressed: onDelete, tooltip: 'Excluir', icon: const Icon(Icons.delete_outline)),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProductThumb extends StatelessWidget {
  const _ProductThumb({required this.categoria, this.url, this.size = 72});

  final String? url;
  final String categoria;
  final double size;

  @override
  Widget build(BuildContext context) {
    final look = purchaseLook(categoria);
    return SizedBox(
      width: size,
      height: size,
      child: url != null && url!.trim().isNotEmpty
          ? Image.network(
              url!,
              fit: BoxFit.cover,
              webHtmlElementStrategy: WebHtmlElementStrategy.prefer,
              errorBuilder: (_, _, _) => CategoryGlyph(icone: look.lucide, color: look.color, size: size),
            )
          : CategoryGlyph(icone: look.lucide, color: look.color, size: size),
    );
  }
}

class _CategoryBreakdown extends StatelessWidget {
  const _CategoryBreakdown({required this.categorias});

  final Map<String, PurchaseCategoriaShare> categorias;

  @override
  Widget build(BuildContext context) {
    final entries = purchaseCategorias.keys
        .map((key) => (key: key, share: categorias[key], look: purchaseLook(key)))
        .where((item) => (item.share?.total ?? 0) > 0 || (item.share?.quantidade ?? 0) > 0)
        .toList();
    final sum = entries.fold<double>(0, (acc, item) => acc + (item.share?.total ?? 0));

    return PulsoSurface(
      child: Column(
        children: [
          for (final item in entries)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                children: [
                  CategoryGlyph(icone: item.look.lucide, color: item.look.color, size: 32),
                  const SizedBox(width: 10),
                  Expanded(child: Text(item.share?.label ?? purchaseCategorias[item.key] ?? item.key)),
                  Text(
                    sum > 0 ? '${(((item.share?.total ?? 0) / sum) * 100).round()}%' : '0%',
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          Text('Baseado no valor total dos itens desejados', style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
