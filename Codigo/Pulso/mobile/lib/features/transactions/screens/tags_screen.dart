import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TagsScreen extends StatefulWidget {
  const TagsScreen({super.key, required this.repository});

  final TransactionRepository repository;

  @override
  State<TagsScreen> createState() => _TagsScreenState();
}

class _TagsScreenState extends State<TagsScreen> {
  List<PulsoTag> tags = [];
  bool loading = true;
  bool creating = false;
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
    } catch (_) {
      error = 'Não foi possível carregar as tags.';
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _criar() async {
    if (creating) return;
    final nome = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nova tag'),
        content: TextField(
          controller: nome,
          decoration: const InputDecoration(
            labelText: 'Nome',
            helperText: 'Até 40 caracteres',
          ),
          maxLength: 40,
          textCapitalization: TextCapitalization.sentences,
          onSubmitted: (_) => Navigator.pop(context, true),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Criar'),
          ),
        ],
      ),
    );
    final trimmed = nome.text.trim();
    nome.dispose();
    if (ok != true || trimmed.isEmpty) return;
    setState(() => creating = true);
    try {
      await widget.repository.criarTag(nome: trimmed);
      await _load();
      if (!mounted) return;
      showPulsoSnack(context, 'Tag "$trimmed" criada.');
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    } catch (_) {
      if (!mounted) return;
      showPulsoSnack(context, 'Não foi possível criar a tag.');
    } finally {
      if (mounted) setState(() => creating = false);
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
      if (!mounted) return;
      showPulsoSnack(context, 'Tag excluída.');
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    } catch (_) {
      if (!mounted) return;
      showPulsoSnack(context, 'Não foi possível excluir a tag.');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (error != null) {
      return PulsoEmptyState(
        title: 'Erro',
        description: error!,
        actionLabel: 'Tentar de novo',
        onAction: _load,
      );
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        PulsoTokens.space4,
        PulsoTokens.space2,
        PulsoTokens.space4,
        96,
      ),
      children: [
        const PulsoPageHeader(
          title: 'Tags',
          subtitle: 'Marque lançamentos para filtrar depois, como na web.',
          icon: Icons.label_outline,
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: FilledButton.icon(
            onPressed: creating ? null : _criar,
            icon: creating
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.add, size: 18),
            label: Text(creating ? 'Criando...' : 'Nova tag'),
          ),
        ),
        const SizedBox(height: PulsoTokens.space3),
        if (tags.isEmpty)
          const PulsoEmptyState(
            title: 'Nenhuma tag ainda',
            description: 'Crie uma tag para organizar seus lançamentos.',
            icon: Icons.label_outline,
          )
        else
          ...tags.map(
            (tag) => Padding(
              padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
              child: PulsoSurface(
                padding: const EdgeInsets.symmetric(
                  horizontal: PulsoTokens.space3,
                  vertical: PulsoTokens.space1,
                ),
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CategoryGlyph(
                    icone: tag.icone ?? 'Tag',
                    color:
                        parseHexColor(tag.cor) ??
                        Theme.of(context).colorScheme.primary,
                  ),
                  title: Text(tag.nome),
                  trailing: IconButton(
                    tooltip: 'Excluir tag',
                    icon: Icon(
                      Icons.delete_outline,
                      color: Theme.of(context).colorScheme.error,
                    ),
                    onPressed: () => _excluir(tag),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
