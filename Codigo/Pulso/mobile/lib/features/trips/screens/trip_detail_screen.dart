import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

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
                items: const [
                  DropdownMenuItem(value: 'TRANSPORTE', child: Text('Transporte')),
                  DropdownMenuItem(value: 'HOSPEDAGEM', child: Text('Hospedagem')),
                  DropdownMenuItem(value: 'ALIMENTACAO', child: Text('Alimentação')),
                  DropdownMenuItem(value: 'OUTROS', child: Text('Outros')),
                ],
                onChanged: (value) => categoria = value ?? categoria,
              ),
              TextField(controller: desc, decoration: const InputDecoration(labelText: 'Descrição')),
              TextField(
                controller: valor,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Valor (R\$)'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Salvar')),
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

  Future<void> _delete() async {
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
      appBar: AppBar(
        title: Text(current?.destino ?? 'Viagem'),
        actions: [
          IconButton(
            onPressed: current == null ? null : () => context.push('/trips/${current.id}/edit', extra: current),
            icon: const Icon(Icons.edit),
          ),
          IconButton(onPressed: _delete, icon: const Icon(Icons.delete_outline)),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : current == null
              ? const PulsoEmptyState(title: 'Viagem não encontrada', description: 'Ela pode ter sido excluída.')
              : ListView(
                  padding: const EdgeInsets.all(PulsoTokens.space4),
                  children: [
                    Text('${current.moeda} · ${formatDayHeader(current.dataPrevista)}'),
                    Text('Total estimado ${formatBrl(current.totalBrl)}'),
                    const SizedBox(height: PulsoTokens.space4),
                    Row(
                      children: [
                        Text('Pretensões de gastos', style: Theme.of(context).textTheme.titleSmall),
                        const Spacer(),
                        TextButton(onPressed: _addExpense, child: const Text('Adicionar')),
                      ],
                    ),
                    if (current.despesas.isEmpty)
                      const Text('Nenhuma pretensão ainda.')
                    else
                      ...current.despesas.map(
                        (item) => ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(item.descricao?.isNotEmpty == true ? item.descricao! : item.categoria),
                          trailing: Text(formatBrl(item.valorEstimado)),
                        ),
                      ),
                  ],
                ),
    );
  }
}
