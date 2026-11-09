import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/utils/goal_icon_rules.dart';
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
    final brightness = Theme.of(context).brightness;
    final progress = (meta.percentual / 100).clamp(0.0, 1.0);
    final barColor = meta.status == 'CONCLUIDA'
        ? PulsoColors.successOf(brightness)
        : meta.status == 'PAUSADA'
        ? PulsoColors.warningOf(brightness)
        : PulsoColors.accent(brightness);
    final amountColor = meta.status == 'PAUSADA'
        ? PulsoColors.warningOf(brightness)
        : const Color(0xFF16A34A);
    final statusKind = badgeKindFromMetaStatus(meta.status);
    final tipoKind = badgeKindFromMetaTipo(meta.tipo);
    final prioridadeKind = badgeKindFromPrioridade(meta.prioridade);
    final insight = _insightStyle(meta, brightness);

    // Sem InkWell no card inteiro: evita conflito de gesto com o scroll/RefreshIndicator.
    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: PulsoSurface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: onOpen,
              borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  PulsoSoftIcon(
                    icon: goalIconForName(meta.nome),
                    color: barColor,
                  ),
                  const SizedBox(width: PulsoTokens.space3),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          meta.nome,
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        const SizedBox(height: 6),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: [
                            if (tipoKind != null)
                              PulsoBadge.kind(
                                kind: tipoKind,
                                brightness: brightness,
                                compact: true,
                              ),
                            if (statusKind != null)
                              PulsoBadge.kind(
                                kind: statusKind,
                                brightness: brightness,
                                compact: true,
                              ),
                            if (prioridadeKind != null)
                              PulsoBadge.kind(
                                kind: prioridadeKind,
                                brightness: brightness,
                                compact: true,
                              ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _deadlineLabel(meta),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  if (meta.status == 'CONCLUIDA')
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: PulsoColors.successOf(brightness)
                            .withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: PulsoColors.successOf(brightness)
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        'CONCLUÍDA',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: PulsoColors.successOf(brightness),
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space4),
            Row(
              children: [
                Expanded(
                  child: Text(
                    '${formatBrl(meta.valorAtual)} de ${formatBrl(meta.valorAlvo)}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: amountColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Text(
                  '${meta.percentual.round()}%',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ],
            ),
            const SizedBox(height: PulsoTokens.space2),
            ClipRRect(
              borderRadius: BorderRadius.circular(PulsoTokens.radiusFull),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 8,
                color: barColor,
                backgroundColor: scheme.surfaceContainerHighest,
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
              decoration: BoxDecoration(
                color: insight.background,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: insight.border),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.lightbulb, size: 16, color: insight.bulb),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _insight(meta),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: insight.foreground,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            if (meta.status != 'CONCLUIDA') ...[
              const SizedBox(height: PulsoTokens.space3),
              Row(
                children: [
                  if (meta.status == 'ATIVA')
                    FilledButton.tonalIcon(
                      onPressed: onContribute,
                      icon: const Icon(Icons.add, size: 16),
                      label: const Text('Aporte'),
                    ),
                  if (meta.status == 'ATIVA' || meta.status == 'PAUSADA') ...[
                    const SizedBox(width: PulsoTokens.space2),
                    OutlinedButton.icon(
                      onPressed: onTogglePause,
                      icon: Icon(
                        meta.status == 'PAUSADA'
                            ? Icons.play_arrow
                            : Icons.pause,
                        size: 16,
                      ),
                      label: Text(
                        meta.status == 'PAUSADA' ? 'Retomar' : 'Pausar',
                      ),
                    ),
                  ],
                  const Spacer(),
                  PulsoIconButton(
                    tooltip: 'Editar',
                    onPressed: onOpen,
                    icon: Icons.edit_outlined,
                  ),
                  PulsoIconButton(
                    tooltip: 'Excluir',
                    onPressed: onDelete,
                    icon: Icons.delete_outline,
                    danger: true,
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _deadlineLabel(PulsoMeta meta) {
    final data = formatDayHeader(meta.prazo);
    if (meta.status == 'CONCLUIDA') return 'Concluída em $data';
    if (meta.vencida) return 'Venceu em $data';
    final meses = meta.mesesRestantes;
    final mesesLabel = meses == 1 ? '1 mês' : '$meses meses';
    return 'Vence em $data ($mesesLabel)';
  }

  String _insight(PulsoMeta meta) {
    if (meta.status == 'CONCLUIDA')
      return 'Parabéns! Meta concluída com sucesso.';
    if (meta.status == 'PAUSADA')
      return 'Meta pausada. Retome quando quiser continuar guardando.';
    if (meta.vencida)
      return 'Prazo vencido. Ajuste o prazo ou aumente seus aportes para retomar o plano.';
    if (meta.valorMensalSugerido > 0) {
      return 'Guarde ${formatBrl(meta.valorMensalSugerido)}/mês para atingir no prazo.';
    }
    return 'Você já atingiu o valor alvo desta meta.';
  }

  _InsightColors _insightStyle(PulsoMeta meta, Brightness brightness) {
    if (meta.status == 'CONCLUIDA') {
      final color = PulsoColors.successOf(brightness);
      return _InsightColors(
        foreground: color,
        bulb: color,
        background: color.withValues(alpha: 0.12),
        border: color.withValues(alpha: 0.38),
      );
    }
    if (meta.status == 'PAUSADA') {
      const foreground = Color(0xFFFCD34D);
      final warning = PulsoColors.warningOf(brightness);
      return _InsightColors(
        foreground: foreground,
        bulb: warning,
        background: warning.withValues(alpha: 0.12),
        border: warning.withValues(alpha: 0.38),
      );
    }
    final warning = PulsoColors.warningOf(brightness);
    return _InsightColors(
      foreground: warning,
      bulb: const Color(0xFFFACC15),
      background: const Color(0xFFFBBF24).withValues(alpha: 0.14),
      border: const Color(0xFFFBBF24).withValues(alpha: 0.42),
    );
  }
}

class _InsightColors {
  const _InsightColors({
    required this.foreground,
    required this.bulb,
    required this.background,
    required this.border,
  });

  final Color foreground;
  final Color bulb;
  final Color background;
  final Color border;
}
