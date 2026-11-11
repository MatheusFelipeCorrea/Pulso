import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
import 'package:pulso/features/currency/data/currency_models.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';
import 'package:pulso/features/trips/widgets/destination_search_picker.dart';

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
  Map<String, dynamic>? destinoMeta;
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
      catalog = const [
        CurrencyItem(code: 'BRL', name: 'Real'),
        CurrencyItem(code: 'USD', name: 'Dólar'),
      ];
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _salvar() async {
    if (_destino.text.trim().isEmpty) {
      showPulsoSnack(context, 'Informe o destino');
      return;
    }
    if (destinoMeta == null && !isEdit) {
      showPulsoSnack(
        context,
        'Selecione um destino da lista de sugestões',
      );
      return;
    }
    setState(() => submitting = true);
    try {
      final repo = context.read<TripRepository>();
      final payloadMeta = destinoMeta;
      if (isEdit) {
        await repo.editar(widget.viagem!.id, {
          'destino': _destino.text.trim(),
          'moeda': moeda,
          'dataPrevista': DateTime(
            data.year,
            data.month,
            data.day,
            12,
          ).toUtc().toIso8601String(),
          if (payloadMeta != null) 'destinoMeta': payloadMeta,
        });
      } else {
        await repo.criar(
          destino: _destino.text.trim(),
          moeda: moeda,
          dataPrevista: data,
          destinoMeta: payloadMeta,
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
    final codes =
        catalog
            .map((item) => item.code)
            .where((code) => code.isNotEmpty)
            .toSet()
            .toList()
          ..sort();
    if (codes.isEmpty) codes.addAll(['BRL', 'USD', 'EUR']);

    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? 'Editar viagem' : 'Nova viagem')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(PulsoTokens.space4),
              children: [
                PulsoPageHeader(
                  title: isEdit ? 'Editar viagem' : 'Nova viagem',
                  subtitle:
                      'Busque o destino na lista (igual à web), escolha moeda e data.',
                  icon: Icons.flight_takeoff,
                ),
                DestinationSearchPicker(
                  repository: context.read<TripRepository>(),
                  controller: _destino,
                  initialMeta: destinoMeta,
                  onSelected: (hint, meta) {
                    setState(() {
                      destinoMeta = meta;
                      final sugerida = hint.moedaSugerida.toUpperCase();
                      if (codes.contains(sugerida)) moeda = sugerida;
                    });
                  },
                ),
                const SizedBox(height: PulsoTokens.space3),
                DropdownButtonFormField<String>(
                  initialValue: codes.contains(moeda) ? moeda : codes.first,
                  decoration: const InputDecoration(labelText: 'Moeda'),
                  items: codes
                      .map(
                        (code) => DropdownMenuItem(
                          value: code,
                          child: Row(
                            children: [
                              CurrencyFlag(code: code, size: 20),
                              const SizedBox(width: 8),
                              Text(code),
                            ],
                          ),
                        ),
                      )
                      .toList(),
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
