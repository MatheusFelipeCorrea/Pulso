import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/widgets/delete_transaction_dialog.dart';
import 'package:pulso/features/transactions/widgets/summary_cards.dart';
import 'package:pulso/features/transactions/widgets/transaction_tile.dart';

class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  final _scroll = ScrollController();

  @override
  void initState() {
    super.initState();
    _scroll.addListener(_onScroll);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<TransactionsController>().bootstrap();
    });
  }

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scroll.hasClients) return;
    if (_scroll.position.pixels > _scroll.position.maxScrollExtent - 240) {
      context.read<TransactionsController>().loadMore();
    }
  }

  Future<void> _confirmDelete(PulsoTransacao tx) async {
    final choice = await showDeleteTransactionDialog(context: context, transacao: tx);
    if (choice == null || !mounted) return;
    try {
      await context.read<TransactionsController>().excluir(tx, excluirFuturas: choice.excluirFuturas);
      if (!mounted) return;
      showPulsoSnack(
        context,
        choice.excluirFuturas
            ? 'Recorrência encerrada. O histórico anterior foi mantido.'
            : 'Transação excluída',
      );
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _openForm({PulsoTransacao? tx}) async {
    final path = tx == null ? '/transactions/new' : '/transactions/${tx.id}';
    await context.push(path, extra: tx);
    if (!mounted) return;
    await context.read<TransactionsController>().reload();
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<TransactionsController>();

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        controller: _scroll,
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
        children: [
          PulsoPageHeader(
            title: 'Transações',
            subtitle: 'Acompanhe receitas, despesas e o saldo do período.',
            icon: Icons.swap_horiz,
          ),
          PulsoSurface(
            padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space2, vertical: PulsoTokens.space1),
            child: Row(
              children: [
                IconButton(
                  tooltip: 'Mês anterior',
                  onPressed: () => controller.shiftPeriod(-1),
                  icon: const Icon(Icons.chevron_left),
                ),
                Expanded(
                  child: Text(
                    TransactionPeriod.label(controller.filters.periodo),
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ),
                IconButton(
                  tooltip: 'Próximo mês',
                  onPressed: () => controller.shiftPeriod(1),
                  icon: const Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space3),
          Wrap(
            spacing: PulsoTokens.space2,
            runSpacing: PulsoTokens.space2,
            children: [
              OutlinedButton.icon(
                onPressed: () => context.push('/tags'),
                icon: const Icon(Icons.label_outline, size: 16),
                label: const Text('Tags'),
              ),
              OutlinedButton.icon(
                onPressed: () => context.push('/categories'),
                icon: const Icon(Icons.layers_outlined, size: 16),
                label: const Text('Categorias'),
              ),
            ],
          ),
          if (controller.filters.hasExtraFilters) ...[
            const SizedBox(height: PulsoTokens.space2),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                if (controller.filters.tipo != 'TODOS')
                  InputChip(label: Text(_tipoLabel(controller.filters.tipo)), onDeleted: () => controller.applyFilters(controller.filters.copyWith(tipo: 'TODOS'))),
                if (controller.filters.recurso != 'TODOS')
                  InputChip(label: Text(recursoLabel(controller.filters.recurso)), onDeleted: () => controller.applyFilters(controller.filters.copyWith(recurso: 'TODOS'))),
                if (controller.filters.categoriaId != null)
                  InputChip(
                    label: const Text('Categoria'),
                    onDeleted: () => controller.applyFilters(controller.filters.copyWith(clearCategoria: true)),
                  ),
                if (controller.filters.busca.trim().isNotEmpty)
                  InputChip(
                    label: Text('“${controller.filters.busca.trim()}”'),
                    onDeleted: () => controller.applyFilters(controller.filters.copyWith(busca: '')),
                  ),
                TextButton(onPressed: controller.clearExtraFilters, child: const Text('Limpar')),
              ],
            ),
          ],
          const SizedBox(height: PulsoTokens.space3),
          TransactionSummaryCards(resumo: controller.resumo, loading: controller.loading && controller.resumo == null),
          const SizedBox(height: PulsoTokens.space4),
          if (controller.loading && controller.transacoes.isEmpty)
            Padding(
              padding: const EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(
                child: Semantics(
                  label: 'Carregando transações',
                  child: const CircularProgressIndicator(),
                ),
              ),
            )
          else if (controller.error != null && controller.transacoes.isEmpty)
            PulsoEmptyState(
              title: 'Não foi possível carregar',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.bootstrap,
            )
          else if (controller.transacoes.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma transação encontrada',
              description: 'Comece registrando uma receita ou despesa neste período.',
              icon: Icons.receipt_long_outlined,
              actionLabel: 'Nova transação',
              onAction: () => _openForm(),
            )
          else
            ..._groupedTiles(controller.transacoes),
          if (controller.loadingMore)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: PulsoTokens.space4),
              child: Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  String _tipoLabel(String tipo) {
    return switch (tipo) {
      'RECEITA' => 'Receita',
      'DESPESA' => 'Despesa',
      'TRANSFERENCIA' => 'Transferência',
      _ => tipo,
    };
  }

  List<Widget> _groupedTiles(List<PulsoTransacao> items) {
    final groups = <String, List<PulsoTransacao>>{};
    for (final tx in items) {
      groups.putIfAbsent(formatDayHeader(tx.data), () => []).add(tx);
    }
    final widgets = <Widget>[];
    for (final entry in groups.entries) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.fromLTRB(4, PulsoTokens.space5, 4, PulsoTokens.space2),
          child: Text(
            entry.key,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
        ),
      );
      widgets.addAll(
        entry.value.map(
          (tx) => TransactionTile(
            transacao: tx,
            onEdit: () => _openForm(tx: tx),
            onDelete: () => _confirmDelete(tx),
          ),
        ),
      );
    }
    return widgets;
  }
}
