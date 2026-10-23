import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/utils/group_labels.dart';

class GroupCard extends StatelessWidget {
  const GroupCard({
    super.key,
    required this.grupo,
    required this.onOpen,
    this.onInvite,
    this.onLeave,
    this.onDelete,
  });

  final PulsoGrupo grupo;
  final VoidCallback onOpen;
  final VoidCallback? onInvite;
  final VoidCallback? onLeave;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final papel = groupPapelVisual(grupo.meuPapel);
    final scheme = Theme.of(context).colorScheme;
    final capa = grupo.capa;

    return PulsoSurface(
      onTap: onOpen,
      padding: EdgeInsets.zero,
      margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(PulsoTokens.radiusXl),
            ),
            child: SizedBox(
              height: 112,
              child: capa == null
                  ? ColoredBox(
                      color: PulsoColors.accent(brightness)
                          .withValues(alpha: 0.16),
                      child: Icon(
                        Icons.groups_outlined,
                        size: 40,
                        color: PulsoColors.accent(brightness),
                      ),
                    )
                  : Image.network(
                      capa,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stack) => ColoredBox(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.groups_outlined,
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(PulsoTokens.space4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        grupo.nome,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                    PulsoBadge.custom(
                      label: papel.label,
                      icon: papel.icon,
                      color: papel.admin
                          ? PulsoColors.accent(brightness)
                          : PulsoColors.secondaryText(brightness),
                      compact: true,
                    ),
                  ],
                ),
                if ((grupo.descricao ?? '').trim().isNotEmpty) ...[
                  const SizedBox(height: PulsoTokens.space1),
                  Text(
                    grupo.descricao!.trim(),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
                const SizedBox(height: PulsoTokens.space3),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    _MiniTag(
                      icon: Icons.people_outline,
                      label:
                          '${grupo.quantidadeMembros} ${grupo.quantidadeMembros == 1 ? 'membro' : 'membros'}',
                    ),
                    if ((grupo.codigoConvite ?? '').isNotEmpty)
                      _MiniTag(
                        icon: Icons.vpn_key_outlined,
                        label: formatCodigoConvite(grupo.codigoConvite),
                      ),
                  ],
                ),
                const SizedBox(height: PulsoTokens.space2),
                Text(
                  groupActivityLabel(grupo.ultimaAtividade),
                  style: Theme.of(context).textTheme.labelSmall
                      ?.copyWith(color: scheme.onSurfaceVariant),
                ),
                if (grupo.pessoas.isNotEmpty) ...[
                  const SizedBox(height: PulsoTokens.space3),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: grupo.pessoas.take(4).map((membro) {
                      final nome = formatGrupoMembroDisplayNome(
                        membro.nome,
                        souEu: membro.souEu,
                      );
                      return Chip(
                        visualDensity: VisualDensity.compact,
                        avatar: CircleAvatar(
                          child: Text(
                            nome.isEmpty ? '?' : nome[0].toUpperCase(),
                            style: const TextStyle(fontSize: 11),
                          ),
                        ),
                        label: Text(nome),
                      );
                    }).toList(),
                  ),
                ],
                const SizedBox(height: PulsoTokens.space2),
                Row(
                  children: [
                    TextButton.icon(
                      onPressed: onOpen,
                      icon: const Icon(Icons.open_in_new, size: 16),
                      label: const Text('Abrir'),
                    ),
                    if (onInvite != null)
                      IconButton(
                        tooltip: 'Convidar',
                        onPressed: onInvite,
                        icon: const Icon(Icons.person_add_alt_1_outlined),
                      ),
                    const Spacer(),
                    if (onLeave != null)
                      IconButton(
                        tooltip: 'Sair',
                        onPressed: onLeave,
                        icon: const Icon(Icons.logout),
                      ),
                    if (onDelete != null)
                      IconButton(
                        tooltip: 'Excluir',
                        onPressed: onDelete,
                        icon: Icon(Icons.delete_outline, color: scheme.error),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniTag extends StatelessWidget {
  const _MiniTag({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.onSurfaceVariant;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Text(label, style: Theme.of(context).textTheme.labelMedium),
      ],
    );
  }
}
