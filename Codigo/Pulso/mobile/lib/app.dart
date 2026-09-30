import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_theme.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_app_frame.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/goals/state/goals_controller.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/groups/state/groups_controller.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';
import 'package:pulso/features/trips/state/trips_controller.dart';

class PulsoApp extends StatelessWidget {
  const PulsoApp({
    super.key,
    required this.auth,
    required this.theme,
    required this.router,
    required this.transactions,
    required this.goals,
    required this.trips,
    required this.currencies,
    required this.groups,
  });

  final AuthController auth;
  final ThemeController theme;
  final GoRouter router;
  final TransactionRepository transactions;
  final GoalRepository goals;
  final TripRepository trips;
  final CurrencyRepository currencies;
  final GroupRepository groups;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: theme),
        Provider<TransactionRepository>.value(value: transactions),
        Provider<GoalRepository>.value(value: goals),
        Provider<TripRepository>.value(value: trips),
        Provider<CurrencyRepository>.value(value: currencies),
        Provider<GroupRepository>.value(value: groups),
        ChangeNotifierProvider(create: (_) => TransactionsController(transactions)),
        ChangeNotifierProvider(create: (_) => GoalsController(goals)),
        ChangeNotifierProvider(create: (_) => TripsController(trips)),
        ChangeNotifierProvider(create: (_) => GroupsController(groups)),
      ],
      child: AnimatedBuilder(
        animation: theme,
        builder: (context, _) {
          return MaterialApp.router(
            title: 'Pulso',
            debugShowCheckedModeBanner: false,
            locale: const Locale('pt', 'BR'),
            supportedLocales: const [Locale('pt', 'BR')],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            theme: PulsoTheme.light(),
            darkTheme: PulsoTheme.dark(),
            themeMode: theme.mode,
            builder: (context, child) => PulsoAppFrame(child: child ?? const SizedBox.shrink()),
            routerConfig: router,
          );
        },
      ),
    );
  }
}
