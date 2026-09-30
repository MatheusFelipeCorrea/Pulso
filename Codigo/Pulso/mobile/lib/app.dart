import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_theme.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';

class PulsoApp extends StatelessWidget {
  const PulsoApp({
    super.key,
    required this.auth,
    required this.theme,
    required this.router,
    required this.transactions,
  });

  final AuthController auth;
  final ThemeController theme;
  final GoRouter router;
  final TransactionRepository transactions;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: theme),
        Provider<TransactionRepository>.value(value: transactions),
        ChangeNotifierProvider(
          create: (_) => TransactionsController(transactions),
        ),
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
