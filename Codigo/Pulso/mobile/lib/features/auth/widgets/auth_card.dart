import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';

class AuthCard extends StatelessWidget {
  const AuthCard({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.child,
    this.iconOutlined = false,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Widget child;
  final bool iconOutlined;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.fromLTRB(28, 32, 28, 24),
      decoration: BoxDecoration(
        color: isDark ? PulsoColors.darkCard : PulsoColors.lightCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? PulsoColors.darkBorder : PulsoColors.lightBorder,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.35 : 0.06),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: iconOutlined
                    ? PulsoColors.primary.withValues(alpha: 0.08)
                    : PulsoColors.primary,
                shape: BoxShape.circle,
                border: iconOutlined
                    ? Border.all(
                        color: PulsoColors.primary.withValues(alpha: 0.35),
                      )
                    : null,
              ),
              child: Icon(
                icon,
                size: 28,
                color: iconOutlined ? PulsoColors.primary : Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w700, fontSize: 22),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: isDark
                  ? PulsoColors.darkSecondary
                  : PulsoColors.lightSecondary,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }
}
