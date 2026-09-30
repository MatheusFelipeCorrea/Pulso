import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';

class PulsoPageHeader extends StatelessWidget {
  const PulsoPageHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.status,
    this.icon,
    this.trailing,
  });

  final String title;
  final String? subtitle;
  final String? status;
  final IconData? icon;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            PulsoSoftIcon(icon: icon!, color: PulsoColors.accent(Theme.of(context).brightness), size: 48),
            const SizedBox(width: PulsoTokens.space3),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.headlineSmall),
                if (subtitle != null) ...[
                  const SizedBox(height: PulsoTokens.space1),
                  Text(
                    subtitle!,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
                if (status != null) ...[
                  const SizedBox(height: PulsoTokens.space2),
                  Text(
                    status!,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(color: PulsoColors.accent(Theme.of(context).brightness)),
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}

class PulsoSectionHeader extends StatelessWidget {
  const PulsoSectionHeader({
    super.key,
    required this.title,
    this.icon,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final IconData? icon;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, size: 18, color: PulsoColors.accent(Theme.of(context).brightness)),
            const SizedBox(width: 8),
          ],
          Expanded(child: Text(title, style: Theme.of(context).textTheme.titleMedium)),
          if (actionLabel != null && onAction != null)
            TextButton(onPressed: onAction, child: Text(actionLabel!)),
        ],
      ),
    );
  }
}

class PulsoSurface extends StatelessWidget {
  const PulsoSurface({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(PulsoTokens.space4),
    this.margin,
    this.onTap,
  });

  final Widget child;
  final EdgeInsets padding;
  final EdgeInsets? margin;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final scheme = Theme.of(context).colorScheme;
    final card = Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
        border: Border.all(color: scheme.outline.withValues(alpha: isDark ? 0.9 : 1)),
        boxShadow: PulsoTokens.shadowMd(isDark),
      ),
      child: child,
    );
    if (onTap == null) return card;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
        child: card,
      ),
    );
  }
}

class PulsoSoftIcon extends StatelessWidget {
  const PulsoSoftIcon({
    super.key,
    required this.icon,
    required this.color,
    this.size = 40,
  });

  final IconData icon;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
      ),
      child: Icon(icon, color: color, size: size * 0.48),
    );
  }
}

class PulsoFormScaffold extends StatelessWidget {
  const PulsoFormScaffold({
    super.key,
    required this.title,
    required this.child,
    this.subtitle,
    this.actions,
    this.floatingActionButton,
  });

  final String title;
  final String? subtitle;
  final Widget child;
  final List<Widget>? actions;
  final Widget? floatingActionButton;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: actions,
      ),
      floatingActionButton: floatingActionButton,
      body: child,
    );
  }
}
