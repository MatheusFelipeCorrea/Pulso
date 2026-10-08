import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';

class PulsoIconButton extends StatelessWidget {
  const PulsoIconButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.danger = false,
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    final color = danger
        ? Theme.of(context).colorScheme.error
        : Theme.of(context).colorScheme.onSurfaceVariant;
    return IconButton(
      tooltip: tooltip,
      onPressed: onPressed,
      visualDensity: VisualDensity.compact,
      style: IconButton.styleFrom(
        foregroundColor: color,
        minimumSize: const Size(PulsoTokens.buttonSm, PulsoTokens.buttonSm),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      icon: Icon(icon, size: 18),
    );
  }
}

class PulsoEmptyState extends StatelessWidget {
  const PulsoEmptyState({
    super.key,
    required this.title,
    required this.description,
    this.icon = Icons.inbox_outlined,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String description;
  final IconData icon;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final accent = PulsoColors.accent(Theme.of(context).brightness);
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: PulsoTokens.space10,
        horizontal: PulsoTokens.space4,
      ),
      child: Column(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: accent.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 32, color: accent),
          ),
          const SizedBox(height: PulsoTokens.space4),
          Text(
            title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: PulsoTokens.space2),
          Text(
            description,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          if (actionLabel != null && onAction != null) ...[
            const SizedBox(height: PulsoTokens.space4),
            FilledButton(onPressed: onAction, child: Text(actionLabel!)),
          ],
        ],
      ),
    );
  }
}

enum PulsoAlertType { info, success, warning, error }

class PulsoAlert extends StatelessWidget {
  const PulsoAlert({
    super.key,
    required this.message,
    this.title,
    this.type = PulsoAlertType.info,
    this.icon,
  });

  final String message;
  final String? title;
  final PulsoAlertType type;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final color = switch (type) {
      PulsoAlertType.info => PulsoColors.infoOf(brightness),
      PulsoAlertType.success => PulsoColors.successOf(brightness),
      PulsoAlertType.warning => PulsoColors.warningOf(brightness),
      PulsoAlertType.error => PulsoColors.dangerOf(brightness),
    };
    final fallbackIcon = switch (type) {
      PulsoAlertType.info => Icons.info_outline,
      PulsoAlertType.success => Icons.check_circle_outline,
      PulsoAlertType.warning => Icons.lightbulb_outline,
      PulsoAlertType.error => Icons.cancel_outlined,
    };

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(PulsoTokens.space4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            child: Icon(icon ?? fallbackIcon, size: 16, color: Colors.white),
          ),
          const SizedBox(width: PulsoTokens.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (title != null) ...[
                  Text(
                    title!,
                    style: Theme.of(context).textTheme.titleSmall
                        ?.copyWith(color: color),
                  ),
                  const SizedBox(height: 2),
                ],
                Text(
                  message,
                  style: Theme.of(context).textTheme.bodySmall
                      ?.copyWith(color: color, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

void showPulsoSnack(BuildContext context, String message) {
  ScaffoldMessenger.of(context).hideCurrentSnackBar();
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      duration: const Duration(milliseconds: 2800),
    ),
  );
}

Future<bool?> showPulsoConfirm({
  required BuildContext context,
  required String title,
  required String message,
  String confirmLabel = 'Excluir',
  bool danger = true,
}) {
  return showDialog<bool>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          if (danger)
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
                foregroundColor: Colors.white,
              ),
              onPressed: () => Navigator.pop(context, true),
              child: Text(confirmLabel),
            )
          else
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(confirmLabel),
            ),
        ],
      );
    },
  );
}
