import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class GoalTile extends StatelessWidget {
  const GoalTile({
    super.key,
    required this.meta,
    required this.onOpen,
    required this.onContribute,
    required this.onDelete,
    required this.onTogglePause,
  });

  final PulsoMeta meta;
  final VoidCallback onOpen;
  final VoidCallback onContribute;
  final VoidCallback onDelete;
  final VoidCallback onTogglePause;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final progress = (meta.percentual / 100).clamp(0.0, 1.0);
    return Card(
      margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: InkWell(
        onTap: onOpen,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        child: Padding(
          padding: const EdgeInsets.all(PulsoTokens.space4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(meta.nome, style: Theme.of(context).textTheme.titleSmall),
                  ),
                  Text(
                    _statusLabel(meta.status),
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(color: scheme.primary),
                  ),
                ],
              ),
              const SizedBox(height: PulsoTokens.space2),
              LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                borderRadius: BorderRadius.circular(PulsoTokens.radiusFull),
                color: PulsoColors.accent(Theme.of(context).brightness),
              ),
              const SizedBox(height: PulsoTokens.space2),
              Text(
                '${formatBrl(meta.valorAtual)} de ${formatBrl(meta.valorAlvo)} · ${meta.percentual.toStringAsFixed(1)}%',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              Text(
                'Prazo ${formatDayHeader(meta.prazo)}',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(color: scheme.onSurfaceVariant),
              ),
              const SizedBox(height: PulsoTokens.space2),
              Row(
                children: [
                  if (meta.status == 'ATIVA')
                    TextButton(onPressed: onContribute, child: const Text('Aporte')),
                  if (meta.status == 'ATIVA' || meta.status == 'PAUSADA')
                    TextButton(
                      onPressed: onTogglePause,
                      child: Text(meta.status == 'PAUSADA' ? 'Retomar' : 'Pausar'),
                    ),
                  const Spacer(),
                  PulsoIconButton(icon: Icons.delete_outline, tooltip: 'Excluir', danger: true, onPressed: onDelete),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'ATIVA':
        return 'Ativa';
      case 'PAUSADA':
        return 'Pausada';
      case 'CONCLUIDA':
        return 'Concluída';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  }
}
