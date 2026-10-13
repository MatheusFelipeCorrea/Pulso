import 'dart:async';

import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
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
  bool converting = false;
  String? error;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _valor.addListener(_scheduleConvert);
    _load();
  }

  @override
  void dispose() {
    _debounce?.cancel();
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
      await _convert();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  void _scheduleConvert() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 350), _convert);
  }

  Future<void> _convert() async {
    final valor = parseMoney(_valor.text);
    if (valor == null || valor < 0) return;
    setState(() => converting = true);
    try {
      final result = await widget.repository.converter(
        valor: valor,
        de: de,
        para: para,
      );
      if (mounted) setState(() => conversion = result);
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    } finally {
      if (mounted) setState(() => converting = false);
    }
  }

  Future<void> _addFavorite(String code) async {
    try {
      await widget.repository.adicionarFavorita(code);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  Future<void> _removeFavorite(String code) async {
    try {
      await widget.repository.removerFavorita(code);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  void _swap() {
    setState(() {
      final previous = de;
      de = para;
      para = previous;
    });
    _convert();
  }

  DropdownMenuItem<String> _currencyItem(String code) {
    return DropdownMenuItem(
      value: code,
      child: Row(
        children: [
          CurrencyFlag(code: code, size: 18),
          const SizedBox(width: 8),
          Text(code),
        ],
      ),
    );
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
      return PulsoEmptyState(
        title: 'Cotações indisponíveis',
        description: error!,
        icon: Icons.currency_exchange,
      );
    }
    final codes =
        catalog
            .map((item) => item.code)
            .where((code) => code.isNotEmpty)
            .toSet()
            .toList()
          ..sort();
    if (codes.isEmpty) codes.addAll(['BRL', 'USD', 'EUR']);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        PulsoSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              PulsoSectionHeader(
                title: 'Conversor de moedas',
                icon: Icons.currency_exchange,
              ),
              const SizedBox(height: PulsoTokens.space4),
              Text('Você envia', style: Theme.of(context).textTheme.labelSmall),
              const SizedBox(height: PulsoTokens.space1),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _valor,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                      decoration: const InputDecoration(hintText: '0,00'),
                    ),
                  ),
                  const SizedBox(width: PulsoTokens.space2),
                  SizedBox(
                    width: 128,
                    child: DropdownButtonFormField<String>(
                      key: ValueKey('de-$de'),
                      initialValue: codes.contains(de) ? de : codes.first,
                      items: codes.map(_currencyItem).toList(),
                      onChanged: (value) {
                        setState(() => de = value ?? de);
                        _convert();
                      },
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  vertical: PulsoTokens.space2,
                ),
                child: Center(
                  child: IconButton.filledTonal(
                    tooltip: 'Inverter moedas',
                    onPressed: _swap,
                    icon: const Icon(Icons.swap_vert),
                  ),
                ),
              ),
              Text(
                'Você recebe',
                style: Theme.of(context).textTheme.labelSmall,
              ),
              const SizedBox(height: PulsoTokens.space1),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: PulsoTokens.space4,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: PulsoColors.button.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(
                          PulsoTokens.radiusMd,
                        ),
                      ),
                      child: Text(
                        converting
                            ? '…'
                            : conversion == null
                            ? '—'
                            : '${conversion!.valorConvertido.toStringAsFixed(2)} $para',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                  ),
                  const SizedBox(width: PulsoTokens.space2),
                  SizedBox(
                    width: 128,
                    child: DropdownButtonFormField<String>(
                      key: ValueKey('para-$para'),
                      initialValue: codes.contains(para) ? para : codes.first,
                      items: codes.map(_currencyItem).toList(),
                      onChanged: (value) {
                        setState(() => para = value ?? para);
                        _convert();
                      },
                    ),
                  ),
                ],
              ),
              if (conversion != null) ...[
                const SizedBox(height: PulsoTokens.space3),
                Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      size: 14,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Row(
                        children: [
                          CurrencyFlag(code: de, size: 16),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '1 $de = ${conversion!.taxa.toStringAsFixed(4)} $para',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ),
                          CurrencyFlag(code: para, size: 16),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: PulsoTokens.space4),
        PulsoSectionHeader(
          title: 'Moedas favoritas',
          icon: Icons.star_outline,
          actionLabel: 'Adicionar $para',
          onAction: () => _addFavorite(para),
        ),
        if (favorites.isEmpty)
          PulsoSurface(
            child: Text(
              'Nenhuma moeda favorita ainda. Adicione cotações para acompanhar na home de viagens.',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          )
        else
          SizedBox(
            height: 128,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: favorites.length,
              separatorBuilder: (context, index) =>
                  const SizedBox(width: PulsoTokens.space3),
              itemBuilder: (context, index) {
                final item = favorites[index];
                final up = (item.pctChange ?? 0) >= 0;
                return SizedBox(
                  width: 176,
                  child: PulsoSurface(
                    padding: const EdgeInsets.all(PulsoTokens.space3),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CurrencyFlag(code: item.code, size: 26),
                            const SizedBox(width: 8),
                            Text(
                              item.code,
                              style: Theme.of(context).textTheme.titleSmall,
                            ),
                            const Spacer(),
                            IconButton(
                              tooltip: 'Remover favorita',
                              visualDensity: VisualDensity.compact,
                              onPressed: () => _removeFavorite(item.code),
                              icon: const Icon(
                                Icons.star,
                                color: PulsoColors.warning,
                                size: 18,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          item.name ?? item.code,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                        const Spacer(),
                        Text(
                          item.rate == null ? '—' : formatBrl(item.rate!),
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        Text(
                          '${up ? '+' : ''}${(item.pctChange ?? 0).toStringAsFixed(2)}%',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(
                                color: up
                                    ? PulsoColors.successOf(
                                        Theme.of(context).brightness,
                                      )
                                    : PulsoColors.dangerOf(
                                        Theme.of(context).brightness,
                                      ),
                              ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}
