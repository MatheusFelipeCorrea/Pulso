import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/currency/data/currency_models.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

class TripFormScreen extends StatefulWidget {
  const TripFormScreen({super.key, this.viagem});

  final PulsoViagem? viagem;

  @override
  State<TripFormScreen> createState() => _TripFormScreenState();
}

class _TripFormScreenState extends State<TripFormScreen> {
  final _destino = TextEditingController();
  DateTime data = DateTime.now().add(const Duration(days: 30));
  String moeda = 'BRL';
  List<CurrencyItem> catalog = const [];
  bool loading = true;
  bool submitting = false;

  bool get isEdit => widget.viagem != null;

  @override
  void initState() {
    super.initState();
    final viagem = widget.viagem;
    if (viagem != null) {
      _destino.text = viagem.destino;
      moeda = viagem.moeda;
      data = viagem.dataPrevista;
    }
    _load();
  }

  @override
  void dispose() {
    _destino.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      catalog = await context.read<CurrencyRepository>().obterCatalogo();
    } on ApiException {
      catalog = const [CurrencyItem(code: 'BRL', name: 'Real'), CurrencyItem(code: 'USD', name: 'Dólar')];
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _salvar() async {
    if (_destino.text.trim().isEmpty) {
      showPulsoSnack(context, 'Informe o destino');
      return;
    }
    setState(() => submitting = true);
    try {
      final repo = context.read<TripRepository>();
      Map<String, dynamic>? destinoMeta;
      try {
        final hints = await repo.listarDestinos(q: _destino.text.trim());
        for (final hint in hints) {
          destinoMeta = hint.toDestinoMeta();
          if (destinoMeta != null) break;
        }
      } on ApiException {
        destinoMeta = null;
      }
      if (isEdit) {
        await repo.editar(widget.viagem!.id, {
          'destino': _destino.text.trim(),
          'moeda': moeda,
          'dataPrevista': DateTime(data.year, data.month, data.day, 12).toUtc().toIso8601String(),
          if (destinoMeta != null) 'destinoMeta': destinoMeta,
        });
      } else {
        await repo.criar(
          destino: _destino.text.trim(),
          moeda: moeda,
          dataPrevista: data,
          destinoMeta: destinoMeta,
        );
      }
      if (!mounted) return;
      context.pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final codes = catalog.map((item) => item.code).where((code) => code.isNotEmpty).toSet().toList()..sort();
    if (codes.isEmpty) codes.addAll(['BRL', 'USD', 'EUR']);

    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? 'Editar viagem' : 'Nova viagem')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(PulsoTokens.space4),
              children: [
                TextField(controller: _destino, decoration: const InputDecoration(labelText: 'Destino')),
                const SizedBox(height: PulsoTokens.space3),
                DropdownButtonFormField<String>(
                  initialValue: codes.contains(moeda) ? moeda : codes.first,
                  decoration: const InputDecoration(labelText: 'Moeda'),
                  items: codes.map((code) => DropdownMenuItem(value: code, child: Text(code))).toList(),
                  onChanged: (value) => setState(() => moeda = value ?? moeda),
                ),
                const SizedBox(height: PulsoTokens.space3),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Data prevista'),
                  subtitle: Text(formatDayHeader(data)),
                  trailing: const Icon(Icons.calendar_today_outlined),
                  onTap: () async {
                    final next = await showDatePicker(
                      context: context,
                      initialDate: data,
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2100),
                    );
                    if (next != null) setState(() => data = next);
                  },
                ),
                const SizedBox(height: PulsoTokens.space4),
                FilledButton(
                  onPressed: submitting ? null : _salvar,
                  child: Text(submitting ? 'Salvando…' : 'Salvar'),
                ),
              ],
            ),
    );
  }
}
