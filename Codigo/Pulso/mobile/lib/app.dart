import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_theme.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_app_frame.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/budget/data/budget_repository.dart';
import 'package:pulso/features/budget/state/budget_controller.dart';
import 'package:pulso/features/calendar/data/calendar_repository.dart';
import 'package:pulso/features/calendar/state/calendar_controller.dart';
import 'package:pulso/features/chatbot/data/chatbot_repository.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/dashboard/data/dashboard_repository.dart';
import 'package:pulso/features/dashboard/data/import_repository.dart';
import 'package:pulso/features/dashboard/state/dashboard_controller.dart';
import 'package:pulso/features/debts/data/debt_repository.dart';
import 'package:pulso/features/debts/state/debts_controller.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';
import 'package:pulso/features/expense_split/state/split_controller.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/goals/state/goals_controller.dart';
import 'package:pulso/features/groups/data/group_chat_socket.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/groups/state/groups_controller.dart';
import 'package:pulso/features/purchase/data/purchase_repository.dart';
import 'package:pulso/features/purchase/state/purchase_controller.dart';
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
    required this.calendar,
    required this.reminders,
    required this.goals,
    required this.budget,
    required this.trips,
    required this.purchase,
    required this.currencies,
    required this.groups,
    required this.groupChat,
    required this.dashboard,
    required this.imports,
    required this.debts,
    required this.splits,
    required this.chatbot,
  });

  final AuthController auth;
  final ThemeController theme;
  final GoRouter router;
  final TransactionRepository transactions;
  final CalendarRepository calendar;
  final ReminderRepository reminders;
  final GoalRepository goals;
  final BudgetRepository budget;
  final TripRepository trips;
  final PurchasePlanningRepository purchase;
  final CurrencyRepository currencies;
  final GroupRepository groups;
  final GroupChatSocket groupChat;
  final DashboardRepository dashboard;
  final ImportRepository imports;
  final DebtRepository debts;
  final ExpenseSplitRepository splits;
  final ChatbotRepository chatbot;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: theme),
        Provider<TransactionRepository>.value(value: transactions),
        Provider<CalendarRepository>.value(value: calendar),
        Provider<ReminderRepository>.value(value: reminders),
        Provider<GoalRepository>.value(value: goals),
        Provider<BudgetRepository>.value(value: budget),
        Provider<TripRepository>.value(value: trips),
        Provider<PurchasePlanningRepository>.value(value: purchase),
        Provider<CurrencyRepository>.value(value: currencies),
        Provider<GroupRepository>.value(value: groups),
        Provider<GroupChatSocket>.value(value: groupChat),
        Provider<DashboardRepository>.value(value: dashboard),
        Provider<ImportRepository>.value(value: imports),
        Provider<DebtRepository>.value(value: debts),
        Provider<ExpenseSplitRepository>.value(value: splits),
        Provider<ChatbotRepository>.value(value: chatbot),
        ChangeNotifierProvider(
          create: (_) => TransactionsController(transactions),
        ),
        ChangeNotifierProvider(
          create: (_) => CalendarController(calendar, reminders),
        ),
        ChangeNotifierProvider(create: (_) => GoalsController(goals)),
        ChangeNotifierProvider(create: (_) => BudgetController(budget)),
        ChangeNotifierProvider(create: (_) => TripsController(trips)),
        ChangeNotifierProvider(create: (_) => PurchaseController(purchase)),
        ChangeNotifierProvider(create: (_) => GroupsController(groups)),
        ChangeNotifierProvider(create: (_) => DashboardController(dashboard)),
        ChangeNotifierProvider(create: (_) => DebtsController(debts)),
        ChangeNotifierProvider(create: (_) => ExpenseSplitController(splits)),
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
            builder: (context, child) =>
                PulsoAppFrame(child: child ?? const SizedBox.shrink()),
            routerConfig: router,
          );
        },
      ),
    );
  }
}
