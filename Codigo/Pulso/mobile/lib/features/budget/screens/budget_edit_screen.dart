import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/budget/data/budget_models.dart';
import 'package:pulso/features/budget/state/budget_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class BudgetEditScreen extends StatefulWidget {
  const BudgetEditScreen({super.key});

  @override
  State<BudgetEditScreen> createState() => _BudgetEditScreenState();
}

class _BudgetEditScreenState extends State<BudgetEditScreen> {
  late List<_Row> _rows;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final status = context.read<BudgetController>().status;
    _rows = [
      for (final item in status?.categorias ?? const [])
        _Row(
          categoriaId: item.categoriaId,
          nome: item.categoriaNome,
          icone: item.categoriaIcone,
          cor: item.categoriaCor,
          limite: TextEditingController(text: item.limiteValor.toStringAsFixed(2)),
          rollover: item.rolloverAtivo,
        ),
    ];
  }

  @override
  void dispose() {
    for (final row in _rows) {
      row.limite.dispose();
    }
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      final limites = _rows
          .map((row) {
            final valor = parseMoney(row.limite.text) ?? 0;
            return BudgetLimiteInput(categoriaId: row.categoriaId, limiteValor: valor, rolloverAtivo: row.rollover);
          })
          .where((item) => item.limiteValor > 0)
          .toList();
      await context.read<BudgetController>().salvar(limites);
      if (!mounted) return;
      Navigator.pop(context);
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final livres = context.watch<BudgetController>().status?.categoriasSemOrcamento ?? const [];
    return PulsoFormScaffold(
      title: 'Editar limites',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          ..._rows.map(
            (row) => PulsoSurface(
              margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
              child: Column(
                children: [
                  Row(
                    children: [
                      CategoryGlyph(
                        icone: row.icone,
                        color: parseHexColor(row.cor) ?? PulsoColors.accent(Theme.of(context).brightness),
                        size: 36,
                      ),
                      const SizedBox(width: 10),
                      Expanded(child: Text(row.nome, style: Theme.of(context).textTheme.titleSmall)),
                      IconButton(
                        onPressed: () => setState(() => _rows.remove(row)),
                        icon: const Icon(Icons.close),
                      ),
                    ],
                  ),
                  TextField(
                    controller: row.limite,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    decoration: const InputDecoration(labelText: 'Limite'),
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Rollover'),
                    value: row.rollover,
                    onChanged: (value) => setState(() => row.rollover = value),
                  ),
                ],
              ),
            ),
          ),
          if (livres.isNotEmpty)
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Adicionar categoria'),
              items: livres
                  .map(
                    (item) => DropdownMenuItem(
                      value: item.id,
                      child: Row(
                        children: [
                          CategoryGlyph(
                            icone: item.icone,
                            color: parseHexColor(item.cor) ?? PulsoColors.accent(Theme.of(context).brightness),
                            size: 28,
                          ),
                          const SizedBox(width: 10),
                          Text(item.nome),
                        ],
                      ),
                    ),
                  )
                  .toList(),
              onChanged: (id) {
                if (id == null) return;
                final cat = livres.firstWhere((item) => item.id == id);
                setState(() {
                  _rows.add(
                    _Row(
                      categoriaId: cat.id,
                      nome: cat.nome,
                      icone: cat.icone,
                      cor: cat.cor,
                      limite: TextEditingController(),
                      rollover: false,
                    ),
                  );
                });
              },
            ),
          const SizedBox(height: PulsoTokens.space4),
          FilledButton(onPressed: _saving ? null : _save, child: Text(_saving ? 'Salvando...' : 'Salvar limites')),
        ],
      ),
    );
  }
}

class _Row {
  _Row({
    required this.categoriaId,
    required this.nome,
    required this.limite,
    required this.rollover,
    this.icone,
    this.cor,
  });

  final String categoriaId;
  final String nome;
  final String? icone;
  final String? cor;
  final TextEditingController limite;
  bool rollover;
}
