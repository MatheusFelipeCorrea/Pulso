import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_theme.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';

class PulsoApp extends StatelessWidget {
  const PulsoApp({
    super.key,
    required this.auth,
    required this.theme,
    required this.router,
  });

  final AuthController auth;
  final ThemeController theme;
  final GoRouter router;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: theme),
      ],
      child: AnimatedBuilder(
        animation: theme,
        builder: (context, _) {
          return MaterialApp.router(
            title: 'Pulso',
            debugShowCheckedModeBanner: false,
            theme: PulsoTheme.light(),
            darkTheme: PulsoTheme.dark(),
            themeMode: theme.mode,
            routerConfig: router,
          );
        },
      ),
    );
  }
}
