import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/state/groups_controller.dart';

class GroupsScreen extends StatefulWidget {
  const GroupsScreen({super.key});

  @override
  State<GroupsScreen> createState() => _GroupsScreenState();
}

class _GroupsScreenState extends State<GroupsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<GroupsController>().reload();
    });
  }

  Future<void> _delete(PulsoGrupo grupo) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir grupo',
      message: 'Excluir “${grupo.nome}”?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<GroupsController>().excluir(grupo.id);
      if (!mounted) return;
      showPulsoSnack(context, 'Grupo excluído');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GroupsController>();
    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(
          PulsoTokens.space4,
          PulsoTokens.space2,
          PulsoTokens.space4,
          PulsoTokens.space8,
        ),
        children: [
          Text(
            'A API de grupos ainda não está ligada neste Sprint. O app já fala /grupos como a web.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: PulsoTokens.space3),
          if (controller.loading && controller.grupos.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Grupos indisponíveis',
              description: controller.error!,
              actionLabel: 'Novo grupo',
              onAction: () => context.push('/groups/new'),
            )
          else if (controller.grupos.isEmpty)
            PulsoEmptyState(
              title: 'Nenhum grupo',
              description: 'Crie um grupo ou entre com um código de convite.',
              actionLabel: 'Novo grupo',
              onAction: () => context.push('/groups/new'),
            )
          else
            ...controller.grupos.map(
              (grupo) => Card(
                margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
                child: ListTile(
                  title: Text(grupo.nome),
                  subtitle: Text('${grupo.quantidadeMembros} membros'),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () => _delete(grupo),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
