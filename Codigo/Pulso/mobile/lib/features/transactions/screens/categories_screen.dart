import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/utils/transaction_rules.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key, required this.repository});

  final TransactionRepository repository;

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  List<PulsoCategoria> categorias = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      categorias = await widget.repository.listarCategorias();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _criar() async {
    final nome = TextEditingController();
    var tipo = 'DESPESA';
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            title: const Text('Nova categoria'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nome,
                  decoration: const InputDecoration(labelText: 'Nome'),
                  textCapitalization: TextCapitalization.sentences,
                ),
                const SizedBox(height: PulsoTokens.space3),
                DropdownButtonFormField<String>(
                  initialValue: tipo,
                  decoration: const InputDecoration(labelText: 'Tipo'),
                  items: const [
                    DropdownMenuItem(value: 'DESPESA', child: Text('Despesa')),
                    DropdownMenuItem(value: 'RECEITA', child: Text('Receita')),
                  ],
                  onChanged: (value) => setDialogState(() => tipo = value ?? 'DESPESA'),
                ),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
              FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Criar')),
            ],
          );
        },
      ),
    );
    if (ok != true) return;
    final trimmed = nome.text.trim();
    nome.dispose();
    if (trimmed.isEmpty) return;
    try {
      final grupo = inferirGrupoBeneficioPorNome(trimmed);
      await widget.repository.criarCategoria({
        'nome': trimmed,
        'tipo': tipo,
        'icone': 'Tag',
        'cor': '#7C3AED',
        'grupoBeneficio': ?grupo,
      });
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  Future<void> _excluir(PulsoCategoria cat) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir categoria',
      message: 'A categoria "${cat.nome}" será excluída.',
    );
    if (ok != true) return;
    try {
      await widget.repository.excluirCategoria(cat.id);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final personalizadas = categorias.where((cat) => !cat.padrao).toList();
    final padrao = categorias.where((cat) => cat.padrao).toList();

    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (error != null) {
      return PulsoEmptyState(title: 'Erro', description: error!, actionLabel: 'Tentar de novo', onAction: _load);
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
      children: [
        const PulsoPageHeader(
          title: 'Categorias',
          subtitle: 'Organize receitas e despesas com as mesmas categorias da web.',
          icon: Icons.layers_outlined,
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: FilledButton.icon(
            onPressed: _criar,
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Nova categoria'),
          ),
        ),
        const SizedBox(height: PulsoTokens.space4),
        Text('Personalizadas', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: PulsoTokens.space2),
        if (personalizadas.isEmpty)
          const PulsoSurface(child: Text('Nenhuma categoria própria ainda.'))
        else
          ...personalizadas.map(
            (cat) => Padding(
              padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
              child: PulsoSurface(
                padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space3, vertical: PulsoTokens.space2),
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CategoryGlyph(
                    icone: cat.icone,
                    color: parseHexColor(cat.cor) ?? Theme.of(context).colorScheme.primary,
                  ),
                  title: Text(cat.nome),
                  subtitle: Text(cat.tipo == 'RECEITA' ? 'Receita' : 'Despesa'),
                  trailing: IconButton(
                    tooltip: 'Excluir categoria',
                    icon: Icon(Icons.delete_outline, color: Theme.of(context).colorScheme.error),
                    onPressed: () => _excluir(cat),
                  ),
                ),
              ),
            ),
          ),
        const SizedBox(height: PulsoTokens.space4),
        Text('Padrão', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: PulsoTokens.space2),
        ...padrao.map(
          (cat) => Padding(
            padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
            child: PulsoSurface(
              padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space3, vertical: PulsoTokens.space2),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CategoryGlyph(
                  icone: cat.icone,
                  color: parseHexColor(cat.cor) ?? Theme.of(context).colorScheme.primary,
                ),
                title: Text(cat.nome),
                subtitle: Text(cat.tipo == 'RECEITA' ? 'Receita' : 'Despesa'),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
