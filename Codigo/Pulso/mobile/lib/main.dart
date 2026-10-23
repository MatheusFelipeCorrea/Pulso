import 'package:flutter/material.dart';
import 'package:pulso/app.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/router/app_router.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/features/auth/data/auth_repository.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/budget/data/budget_repository.dart';
import 'package:pulso/features/calendar/data/calendar_repository.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/purchase/data/purchase_repository.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final storage = TokenStorage();
  late final AuthController auth;
  final api = ApiClient(
    tokenStorage: storage,
    onSessionExpired: () => auth.clearLocalSession(),
  );
  auth = AuthController(
    repository: AuthRepository(api: api, storage: storage),
    storage: storage,
  );
  final theme = ThemeController();

  await Future.wait([auth.bootstrap(), theme.load()]);

  final router = createRouter(auth);
  bindAuthDeepLinks(router);

  runApp(
    PulsoApp(
      auth: auth,
      theme: theme,
      router: router,
      transactions: TransactionRepository(api),
      calendar: CalendarRepository(api),
      reminders: ReminderRepository(api),
      goals: GoalRepository(api),
      budget: BudgetRepository(api),
      trips: TripRepository(api),
      purchase: PurchasePlanningRepository(api),
      currencies: CurrencyRepository(api),
      groups: GroupRepository(api),
      splits: ExpenseSplitRepository(api),
    ),
  );
}
