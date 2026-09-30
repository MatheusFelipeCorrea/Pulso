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
    final color = danger ? Theme.of(context).colorScheme.error : Theme.of(context).colorScheme.primary;
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
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String description;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: PulsoTokens.space10, horizontal: PulsoTokens.space4),
      child: Column(
        children: [
          Icon(Icons.inbox_outlined, size: 40, color: PulsoColors.accent(Theme.of(context).brightness)),
          const SizedBox(height: PulsoTokens.space3),
          Text(title, textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
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

void showPulsoSnack(BuildContext context, String message) {
  ScaffoldMessenger.of(context).hideCurrentSnackBar();
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(message), duration: const Duration(milliseconds: 2800)),
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
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
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
            FilledButton(onPressed: () => Navigator.pop(context, true), child: Text(confirmLabel)),
        ],
      );
    },
  );
}
