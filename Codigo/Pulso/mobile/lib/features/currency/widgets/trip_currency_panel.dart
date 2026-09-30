import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/currency/data/currency_models.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TripCurrencyPanel extends StatefulWidget {
  const TripCurrencyPanel({super.key, required this.repository});

  final CurrencyRepository repository;

  @override
  State<TripCurrencyPanel> createState() => _TripCurrencyPanelState();
}

class _TripCurrencyPanelState extends State<TripCurrencyPanel> {
  final _valor = TextEditingController(text: '100');
  List<CurrencyItem> catalog = const [];
  List<FavoriteCurrency> favorites = const [];
  String de = 'BRL';
  String para = 'USD';
  CurrencyConversion? conversion;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _valor.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final results = await Future.wait([
        widget.repository.obterCatalogo(),
        widget.repository.listarFavoritas(),
      ]);
      catalog = results[0] as List<CurrencyItem>;
      favorites = results[1] as List<FavoriteCurrency>;
      if (catalog.any((item) => item.code == 'USD')) para = 'USD';
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _convert() async {
    final valor = parseMoney(_valor.text);
    if (valor == null) return;
    try {
      final result = await widget.repository.converter(valor: valor, de: de, para: para);
      setState(() => conversion = result);
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  Future<void> _addFavorite() async {
    try {
      await widget.repository.adicionarFavorita(para);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Padding(
        padding: EdgeInsets.all(PulsoTokens.space4),
        child: Center(child: CircularProgressIndicator()),
      );
    }
    if (error != null) {
      return PulsoEmptyState(title: 'Cotações indisponíveis', description: error!);
    }
    final codes = catalog.map((item) => item.code).where((code) => code.isNotEmpty).toSet().toList()..sort();
    if (codes.isEmpty) {
      codes.addAll(['BRL', 'USD', 'EUR']);
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Conversor de moedas', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: PulsoTokens.space3),
            TextField(
              controller: _valor,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Valor'),
            ),
            const SizedBox(height: PulsoTokens.space2),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    key: ValueKey('de-$de'),
                    initialValue: codes.contains(de) ? de : codes.first,
                    decoration: const InputDecoration(labelText: 'De'),
                    items: codes.map((code) => DropdownMenuItem(value: code, child: Text(code))).toList(),
                    onChanged: (value) => setState(() => de = value ?? de),
                  ),
                ),
                const SizedBox(width: PulsoTokens.space2),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    key: ValueKey('para-$para'),
                    initialValue: codes.contains(para) ? para : codes.first,
                    decoration: const InputDecoration(labelText: 'Para'),
                    items: codes.map((code) => DropdownMenuItem(value: code, child: Text(code))).toList(),
                    onChanged: (value) => setState(() => para = value ?? para),
                  ),
                ),
              ],
            ),
            const SizedBox(height: PulsoTokens.space3),
            FilledButton(onPressed: _convert, child: const Text('Converter')),
            if (conversion != null) ...[
              const SizedBox(height: PulsoTokens.space2),
              Text('Resultado ${formatBrl(conversion!.valorConvertido)} · taxa ${conversion!.taxa}'),
            ],
            const SizedBox(height: PulsoTokens.space3),
            Text('Favoritas', style: Theme.of(context).textTheme.labelLarge),
            const SizedBox(height: PulsoTokens.space2),
            if (favorites.isEmpty)
              const Text('Nenhuma moeda favorita ainda.')
            else
              Wrap(
                spacing: 8,
                children: favorites
                    .map((item) => Chip(label: Text(item.code)))
                    .toList(),
              ),
            TextButton(onPressed: _addFavorite, child: Text('Favoritar $para')),
          ],
        ),
      ),
    );
  }
}
