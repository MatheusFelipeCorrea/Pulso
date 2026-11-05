import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/state/groups_controller.dart';
import 'package:pulso/features/groups/widgets/group_card.dart';

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
      message: 'Excluir “${grupo.nome}”? Os membros perdem o acesso.',
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

  Future<void> _leave(PulsoGrupo grupo) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Sair do grupo',
      message: 'Sair de “${grupo.nome}”?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<GroupsController>().sair(grupo.id);
      if (!mounted) return;
      showPulsoSnack(context, 'Você saiu do grupo');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _invite(PulsoGrupo grupo) async {
    final codigo = grupo.codigoConvite ?? '';
    if (codigo.isEmpty) {
      showPulsoSnack(context, 'Este grupo não tem código de convite');
      return;
    }
    await Clipboard.setData(ClipboardData(text: codigo));
    if (!mounted) return;
    showPulsoSnack(context, 'Código $codigo copiado');
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
          96,
        ),
        children: [
          const PulsoPageHeader(
            title: 'Grupos',
            subtitle: 'Gerencie e participe dos seus grupos financeiros.',
            icon: Icons.groups_outlined,
          ),
          if (controller.loading && controller.grupos.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Grupos indisponíveis',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.reload,
            )
          else if (controller.grupos.isEmpty)
            PulsoEmptyState(
              title: 'Nenhum grupo ainda',
              description: 'Crie um grupo ou entre com um código de convite.',
              icon: Icons.groups_outlined,
              actionLabel: 'Novo grupo',
              onAction: () => context.push('/groups/new'),
            )
          else ...[
            PulsoSectionHeader(
              title: 'Meus grupos (${controller.grupos.length})',
              icon: Icons.folder_shared_outlined,
            ),
            ...controller.grupos.map(
              (grupo) => GroupCard(
                grupo: grupo,
                onOpen: () => context.push('/groups/${grupo.id}', extra: grupo),
                onInvite: () => _invite(grupo),
                onLeave: grupo.isAdmin ? null : () => _leave(grupo),
                onDelete: grupo.isAdmin ? () => _delete(grupo) : null,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
