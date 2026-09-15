import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/features/auth/widgets/auth_scaffold.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeController>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return AuthScaffold(
      isDark: isDark,
      onToggleTheme: theme.toggle,
      child: child,
    );
  }
}
