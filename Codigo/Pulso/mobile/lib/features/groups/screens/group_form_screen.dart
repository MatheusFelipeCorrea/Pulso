import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/groups/state/groups_controller.dart';

class GroupFormScreen extends StatefulWidget {
  const GroupFormScreen({super.key});

  @override
  State<GroupFormScreen> createState() => _GroupFormScreenState();
}

class _GroupFormScreenState extends State<GroupFormScreen> {
  final _nome = TextEditingController();
  final _descricao = TextEditingController();
  final _codigo = TextEditingController();
  bool submitting = false;

  @override
  void dispose() {
    _nome.dispose();
    _descricao.dispose();
    _codigo.dispose();
    super.dispose();
  }

  Future<void> _criar() async {
    if (_nome.text.trim().isEmpty) {
      showPulsoSnack(context, 'Informe o nome do grupo');
      return;
    }
    setState(() => submitting = true);
    try {
      await context.read<GroupRepository>().criar(
        nome: _nome.text.trim(),
        descricao: _descricao.text.trim(),
      );
      if (!mounted) return;
      await context.read<GroupsController>().reload();
      if (!mounted) return;
      context.pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  Future<void> _entrar() async {
    if (_codigo.text.trim().isEmpty) {
      showPulsoSnack(context, 'Informe o código de convite');
      return;
    }
    setState(() => submitting = true);
    try {
      await context.read<GroupRepository>().entrar(
        codigoConvite: _codigo.text.trim(),
      );
      if (!mounted) return;
      await context.read<GroupsController>().reload();
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
    return Scaffold(
      appBar: AppBar(title: const Text('Grupo')),
      body: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          const PulsoPageHeader(
            title: 'Novo grupo',
            subtitle: 'Crie um grupo ou entre com o código de convite.',
            icon: Icons.group_add_outlined,
          ),
          TextField(
            controller: _nome,
            decoration: const InputDecoration(labelText: 'Nome do grupo'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _descricao,
            decoration: const InputDecoration(labelText: 'Descrição'),
            maxLines: 3,
          ),
          const SizedBox(height: PulsoTokens.space3),
          FilledButton(
            onPressed: submitting ? null : _criar,
            child: const Text('Criar grupo'),
          ),
          const SizedBox(height: PulsoTokens.space6),
          TextField(
            controller: _codigo,
            decoration: const InputDecoration(labelText: 'Código de convite'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          OutlinedButton(
            onPressed: submitting ? null : _entrar,
            child: const Text('Entrar com código'),
          ),
        ],
      ),
    );
  }
}
