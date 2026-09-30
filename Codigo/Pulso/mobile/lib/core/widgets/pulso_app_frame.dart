import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';

/// No browser largo, o app fica em um “telefone” centralizado — o Flutter web
/// sem isso estica ListTiles e parece outro produto.
class PulsoAppFrame extends StatelessWidget {
  const PulsoAppFrame({super.key, required this.child});

  final Widget child;
  static const phoneWidth = 430.0;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final framed = kIsWeb && width > 520;
    if (!framed) return child;

    final isDark = Theme.of(context).brightness == Brightness.dark;
    return ColoredBox(
      color: isDark ? const Color(0xFF050508) : const Color(0xFFEDE9FE),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: phoneWidth),
            child: Material(
              elevation: 18,
              shadowColor: PulsoColors.primary.withValues(alpha: 0.28),
              color: Theme.of(context).scaffoldBackgroundColor,
              borderRadius: BorderRadius.circular(28),
              clipBehavior: Clip.antiAlias,
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
