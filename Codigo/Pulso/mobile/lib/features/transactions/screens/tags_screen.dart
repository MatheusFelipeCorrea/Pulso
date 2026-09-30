import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
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
      showPulsoSnack(context, err.message);
    }
  }

  Future<void> _excluir(PulsoTag tag) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir tag',
      message: 'A tag "${tag.nome}" será excluída.',
    );
    if (ok != true) return;
    try {
      await widget.repository.excluirTag(tag.id);
      await _load();
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (error != null) {
      return PulsoEmptyState(title: 'Erro', description: error!, actionLabel: 'Tentar de novo', onAction: _load);
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, PulsoTokens.space8),
      children: [
        Align(
          alignment: Alignment.centerLeft,
          child: FilledButton.icon(
            onPressed: _criar,
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Nova tag'),
          ),
        ),
        const SizedBox(height: PulsoTokens.space3),
        if (tags.isEmpty)
          const PulsoEmptyState(
            title: 'Nenhuma tag ainda',
            description: 'Crie uma tag para organizar seus lançamentos.',
          )
        else
          ...tags.map(
            (tag) => ListTile(
              leading: const Icon(Icons.label_outline),
              title: Text(tag.nome),
              trailing: IconButton(
                tooltip: 'Excluir tag',
                icon: Icon(Icons.delete_outline, color: Theme.of(context).colorScheme.error),
                onPressed: () => _excluir(tag),
              ),
            ),
          ),
      ],
    );
  }
}
