import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';

class TagsScreen extends StatefulWidget {
  const TagsScreen({super.key, required this.repository});

  final TransactionRepository repository;

  @override
  State<TagsScreen> createState() => _TagsScreenState();
}

class _TagsScreenState extends State<TagsScreen> {
  List<PulsoTag> tags = [];
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
      tags = await widget.repository.listarTags();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _criar() async {
    final nome = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nova tag'),
        content: TextField(
          controller: nome,
          decoration: const InputDecoration(labelText: 'Nome'),
          textCapitalization: TextCapitalization.sentences,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
          FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Criar')),
        ],
      ),
    );
    final trimmed = nome.text.trim();
    nome.dispose();
    if (ok != true || trimmed.isEmpty) return;
    try {
      await widget.repository.criarTag(nome: trimmed);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err.message)));
    }
  }

  Future<void> _excluir(PulsoTag tag) async {
    try {
      await widget.repository.excluirTag(tag.id);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err.message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: _criar,
        child: const Icon(Icons.add),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : tags.isEmpty
                  ? const Center(child: Text('Nenhuma tag ainda.'))
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(8, 8, 8, 100),
                      itemCount: tags.length + 1,
                      itemBuilder: (context, index) {
                        if (index == 0) {
                          return Padding(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                            child: Text(
                              'Tags',
                              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
                            ),
                          );
                        }
                        final tag = tags[index - 1];
                        return ListTile(
                          leading: const Icon(Icons.label_outline),
                          title: Text(tag.nome),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => _excluir(tag),
                          ),
                        );
                      },
                    ),
    );
  }
}
