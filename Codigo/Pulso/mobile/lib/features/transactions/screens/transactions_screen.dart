import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/widgets/delete_transaction_dialog.dart';
import 'package:pulso/features/transactions/widgets/filters_sheet.dart';
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

  Future<void> _openFilters() async {
    final controller = context.read<TransactionsController>();
    final next = await showTransactionFiltersSheet(
      context: context,
      current: controller.filters,
      options: controller.options,
    );
    if (next != null && mounted) await controller.applyFilters(next);
  }

  Future<void> _confirmDelete(PulsoTransacao tx) async {
    final choice = await showDeleteTransactionDialog(context: context, transacao: tx);
    if (choice == null || !mounted) return;
    try {
      await context.read<TransactionsController>().excluir(tx, excluirFuturas: choice.excluirFuturas);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            choice.excluirFuturas
                ? 'Recorrência encerrada. O histórico anterior foi mantido.'
                : 'Transação excluída',
          ),
        ),
      );
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
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

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openForm(),
        icon: const Icon(Icons.add),
        label: const Text('Nova'),
      ),
      body: RefreshIndicator(
        onRefresh: controller.reload,
        child: ListView(
          controller: _scroll,
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
          children: [
            Text(
              'Transações',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                IconButton(
                  onPressed: () => controller.shiftPeriod(-1),
                  icon: const Icon(Icons.chevron_left),
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      TransactionPeriod.label(controller.filters.periodo),
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () => controller.shiftPeriod(1),
                  icon: const Icon(Icons.chevron_right),
                ),
                IconButton(
                  tooltip: 'Filtros',
                  onPressed: _openFilters,
                  icon: const Icon(Icons.tune),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TransactionSummaryCards(resumo: controller.resumo),
            const SizedBox(height: 16),
            if (controller.loading && controller.transacoes.isEmpty)
              const Padding(
                padding: EdgeInsets.only(top: 48),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (controller.error != null && controller.transacoes.isEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 32),
                child: Column(
                  children: [
                    Text(controller.error!, textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    FilledButton(onPressed: controller.bootstrap, child: const Text('Tentar de novo')),
                  ],
                ),
              )
            else if (controller.transacoes.isEmpty)
              const Padding(
                padding: EdgeInsets.only(top: 48),
                child: Center(child: Text('Nenhuma transação neste período.')),
              )
            else
              ..._groupedTiles(controller.transacoes),
            if (controller.loadingMore)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Center(child: CircularProgressIndicator()),
              ),
          ],
        ),
      ),
    );
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
          padding: const EdgeInsets.fromLTRB(4, 16, 4, 4),
          child: Text(entry.key, style: Theme.of(context).textTheme.labelLarge),
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
