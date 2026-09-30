import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/utils/transaction_rules.dart';
import 'package:pulso/core/widgets/category_icon.dart';

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
                const SizedBox(height: 12),
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
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err.message)));
    }
  }

  Future<void> _excluir(PulsoCategoria cat) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Excluir categoria'),
        content: Text('A categoria "${cat.nome}" será excluída.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Excluir')),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await widget.repository.excluirCategoria(cat.id);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err.message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final personalizadas = categorias.where((cat) => !cat.padrao).toList();
    final padrao = categorias.where((cat) => cat.padrao).toList();

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: _criar,
        child: const Icon(Icons.add),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : ListView(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
                  children: [
                    Text('Categorias', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 16),
                    Text('Personalizadas', style: Theme.of(context).textTheme.titleMedium),
                    if (personalizadas.isEmpty)
                      const ListTile(title: Text('Nenhuma categoria própria ainda.')),
                    ...personalizadas.map(
                      (cat) => ListTile(
                        leading: CategoryGlyph(
                          icone: cat.icone,
                          color: parseHexColor(cat.cor) ?? Theme.of(context).colorScheme.primary,
                        ),
                        title: Text(cat.nome),
                        subtitle: Text(cat.tipo == 'RECEITA' ? 'Receita' : 'Despesa'),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () => _excluir(cat),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text('Padrão', style: Theme.of(context).textTheme.titleMedium),
                    ...padrao.map(
                      (cat) => ListTile(
                        leading: CategoryGlyph(
                          icone: cat.icone,
                          color: parseHexColor(cat.cor) ?? Theme.of(context).colorScheme.primary,
                        ),
                        title: Text(cat.nome),
                        subtitle: Text(cat.tipo == 'RECEITA' ? 'Receita' : 'Despesa'),
                      ),
                    ),
                  ],
                ),
    );
  }
}
