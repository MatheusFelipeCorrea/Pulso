import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';
import 'package:pulso/features/trips/utils/trip_expense_meta.dart';

class TripDetailScreen extends StatefulWidget {
  const TripDetailScreen({super.key, required this.viagemId, this.viagem});

  final String viagemId;
  final PulsoViagem? viagem;

  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> {
  PulsoViagem? viagem;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    viagem = widget.viagem;
    _load();
  }

  Future<void> _load() async {
    try {
      viagem = await context.read<TripRepository>().obter(widget.viagemId);
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _addExpense() async {
    final desc = TextEditingController();
    final valor = TextEditingController();
    var categoria = 'OUTROS';
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Nova pretensão'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: categoria,
                decoration: const InputDecoration(labelText: 'Categoria'),
                items: tripExpenseCatalog.entries
                    .map(
                      (entry) => DropdownMenuItem(
                        value: entry.key,
                        child: Row(
                          children: [
                            Icon(
                              entry.value.icon,
                              size: 18,
                              color: entry.value.color,
                            ),
                            const SizedBox(width: 8),
                            Text(entry.value.label),
                          ],
                        ),
                      ),
                    )
                    .toList(),
                onChanged: (value) => categoria = value ?? categoria,
              ),
              const SizedBox(height: PulsoTokens.space3),
              TextField(
                controller: desc,
                decoration: const InputDecoration(labelText: 'Descrição'),
              ),
              const SizedBox(height: PulsoTokens.space3),
              TextField(
                controller: valor,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(labelText: 'Valor (R\$)'),
              ),
            ],
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
    final amount = parseMoney(valor.text);
    final descricao = desc.text.trim();
    desc.dispose();
    valor.dispose();
    if (ok != true || amount == null || !mounted) return;
    try {
      viagem = await context.read<TripRepository>().criarDespesa(
        widget.viagemId,
        categoria: categoria,
        valorEstimado: amount,
        descricao: descricao.isEmpty ? null : descricao,
      );
      setState(() {});
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _addNote() async {
    final titulo = TextEditingController();
    final conteudo = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nova observação'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titulo,
              decoration: const InputDecoration(labelText: 'Título'),
            ),
            const SizedBox(height: PulsoTokens.space3),
            TextField(
              controller: conteudo,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Conteúdo'),
            ),
          ],
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
      ),
    );
    final title = titulo.text.trim();
    final body = conteudo.text.trim();
    titulo.dispose();
    conteudo.dispose();
    if (ok != true || title.isEmpty || !mounted) return;
    try {
      viagem = await context.read<TripRepository>().criarObservacao(
        widget.viagemId,
        titulo: title,
        conteudo: body,
      );
      setState(() {});
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _deleteExpense(TripExpense item) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir pretensão',
      message:
          'Excluir “${item.descricao?.isNotEmpty == true ? item.descricao : tripExpenseMeta(item.categoria).label}”?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<TripRepository>().excluirDespesa(
        widget.viagemId,
        item.id,
      );
      await _load();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _deleteTrip() async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir viagem',
      message: 'Excluir a viagem para ${viagem?.destino ?? 'este destino'}?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<TripRepository>().excluir(widget.viagemId);
      if (!mounted) return;
      context.go('/trips');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final current = viagem;
    return Scaffold(
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : current == null
          ? const PulsoEmptyState(
              title: 'Viagem não encontrada',
              description: 'Ela pode ter sido excluída.',
            )
          : CustomScrollView(
              slivers: [
                SliverAppBar(
                  expandedHeight: 220,
                  pinned: true,
                  actions: [
                    IconButton(
                      tooltip: 'Editar',
                      onPressed: () => context.push(
                        '/trips/${current.id}/edit',
                        extra: current,
                      ),
                      icon: const Icon(Icons.edit_outlined),
                    ),
                    IconButton(
                      tooltip: 'Excluir',
                      onPressed: _deleteTrip,
                      icon: const Icon(Icons.delete_outline),
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    title: Text(
                      current.destino,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    background: _Cover(
                      url: current.coverImageUrl,
                      destino: current.destino,
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    PulsoTokens.space4,
                    PulsoTokens.space4,
                    PulsoTokens.space4,
                    96,
                  ),
                  sliver: SliverList.list(
                    children: [
                      Row(
                        children: [
                          _Chip(
                            icon: Icons.calendar_today_outlined,
                            label: formatDayHeader(current.dataPrevista),
                          ),
                          const SizedBox(width: PulsoTokens.space2),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.surface,
                              borderRadius: BorderRadius.circular(
                                PulsoTokens.radiusFull,
                              ),
                              border: Border.all(
                                color: Theme.of(context).colorScheme.outline,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CurrencyFlag(code: current.moeda, size: 16),
                                const SizedBox(width: 6),
                                Text(
                                  current.moeda,
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: PulsoTokens.space3),
                      PulsoSurface(
                        child: Row(
                          children: [
                            const PulsoSoftIcon(
                              icon: Icons.savings_outlined,
                              color: PulsoColors.primary,
                            ),
                            const SizedBox(width: PulsoTokens.space3),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Total estimado',
                                    style: Theme.of(context)
                                        .textTheme
                                        .labelSmall,
                                  ),
                                  Text(
                                    formatBrl(current.totalBrl),
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: PulsoTokens.space5),
                      PulsoSectionHeader(
                        title: 'Pretensões de gastos',
                        icon: Icons.receipt_long_outlined,
                        actionLabel: 'Adicionar',
                        onAction: _addExpense,
                      ),
                      if (current.despesas.isEmpty)
                        PulsoSurface(
                          child: Text(
                            'Nenhuma pretensão cadastrada ainda.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        )
                      else
                        ...current.despesas.map(
                          (item) => Padding(
                            padding: const EdgeInsets.only(
                              bottom: PulsoTokens.space2,
                            ),
                            child: PulsoSurface(
                              padding: const EdgeInsets.symmetric(
                                horizontal: PulsoTokens.space3,
                                vertical: PulsoTokens.space3,
                              ),
                              child: Row(
                                children: [
                                  PulsoSoftIcon(
                                    icon: tripExpenseMeta(item.categoria).icon,
                                    color: tripExpenseMeta(item.categoria)
                                        .color,
                                    size: 36,
                                  ),
                                  const SizedBox(width: PulsoTokens.space3),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.descricao?.isNotEmpty == true
                                              ? item.descricao!
                                              : tripExpenseMeta(item.categoria)
                                                    .label,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleSmall,
                                        ),
                                        Text(
                                          tripExpenseMeta(item.categoria).label,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    formatBrl(item.valorEstimado),
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleSmall,
                                  ),
                                  IconButton(
                                    tooltip: 'Excluir pretensão',
                                    onPressed: () => _deleteExpense(item),
                                    icon: Icon(
                                      Icons.delete_outline,
                                      color: Theme.of(context)
                                          .colorScheme
                                          .error,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      const SizedBox(height: PulsoTokens.space5),
                      PulsoSectionHeader(
                        title: 'Observações',
                        icon: Icons.notes_outlined,
                        actionLabel: 'Adicionar',
                        onAction: _addNote,
                      ),
                      if (current.observacoes.isEmpty)
                        PulsoSurface(
                          child: Text(
                            'Nenhuma observação ainda. Use para links, checklists e notas da viagem.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        )
                      else
                        ...current.observacoes.map(
                          (note) => Padding(
                            padding: const EdgeInsets.only(
                              bottom: PulsoTokens.space2,
                            ),
                            child: PulsoSurface(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    note.titulo,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleSmall,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    note.conteudo,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyMedium,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
      floatingActionButton: current == null
          ? null
          : FloatingActionButton.extended(
              onPressed: _addExpense,
              icon: const Icon(Icons.add),
              label: const Text('Pretensão'),
            ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusFull),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14),
          const SizedBox(width: 6),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
  }
}

class _Cover extends StatelessWidget {
  const _Cover({required this.url, required this.destino});

  final String? url;
  final String destino;

  @override
  Widget build(BuildContext context) {
    final fallback = DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [PulsoColors.primary, PulsoColors.primaryDark],
        ),
      ),
      child: Center(
        child: Text(
          destino.isEmpty ? '✈' : destino.characters.first.toUpperCase(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 56,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
    if (url == null || url!.isEmpty) return fallback;
    return Image.network(
      url!,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) => fallback,
    );
  }
}
