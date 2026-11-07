import 'package:app_links/app_links.dart';
import 'package:go_router/go_router.dart';
import 'package:pulso/features/account/screens/account_screen.dart';
import 'package:pulso/features/auth/screens/auth_callback_screen.dart';
import 'package:pulso/features/auth/screens/email_sent_screen.dart';
import 'package:pulso/features/auth/legal/legal_content.dart';
import 'package:pulso/features/auth/screens/forgot_password_screen.dart';
import 'package:pulso/features/auth/screens/legal_document_screen.dart';
import 'package:pulso/features/auth/screens/login_screen.dart';
import 'package:pulso/features/auth/screens/register_screen.dart';
import 'package:pulso/features/auth/screens/reset_password_screen.dart';
import 'package:pulso/features/auth/screens/verify_email_screen.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/auth_page.dart';
import 'package:pulso/features/budget/screens/budget_edit_screen.dart';
import 'package:pulso/features/budget/screens/budget_screen.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/widgets/app_shell.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/calendar/screens/calendar_screen.dart';
import 'package:pulso/features/calendar/screens/reminder_form_screen.dart';
import 'package:pulso/features/chatbot/screens/chatbot_screen.dart';
import 'package:pulso/features/dashboard/screens/dashboard_screen.dart';
import 'package:pulso/features/dashboard/screens/import_statement_screen.dart';
import 'package:pulso/features/debts/data/debt_models.dart';
import 'package:pulso/features/debts/screens/debt_form_screen.dart';
import 'package:pulso/features/debts/screens/debts_screen.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';
import 'package:pulso/features/expense_split/screens/expense_split_form_screen.dart';
import 'package:pulso/features/expense_split/screens/expense_split_screen.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/screens/goal_form_screen.dart';
import 'package:pulso/features/goals/screens/goals_screen.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/screens/group_detail_screen.dart';
import 'package:pulso/features/groups/screens/group_form_screen.dart';
import 'package:pulso/features/groups/screens/groups_screen.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/purchase/screens/purchase_item_form_screen.dart';
import 'package:pulso/features/purchase/screens/purchase_planning_screen.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/screens/categories_screen.dart';
import 'package:pulso/features/transactions/screens/tags_screen.dart';
import 'package:pulso/features/transactions/screens/transaction_form_screen.dart';
import 'package:pulso/features/transactions/screens/transactions_screen.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/screens/trip_detail_screen.dart';
import 'package:pulso/features/trips/screens/trip_form_screen.dart';
import 'package:pulso/features/trips/screens/trips_screen.dart';

GoRouter createRouter(AuthController auth) {
  return GoRouter(
    initialLocation: auth.status == AuthStatus.authenticated
        ? '/transactions'
        : '/login',
    refreshListenable: auth,
    redirect: (context, state) {
      final loggedIn = auth.status == AuthStatus.authenticated;
      final loggingIn =
          state.matchedLocation == '/login' ||
          state.matchedLocation == '/register' ||
          state.matchedLocation == '/auth/callback' ||
          state.matchedLocation == '/termos' ||
          state.matchedLocation == '/privacidade' ||
          state.matchedLocation.startsWith('/register/') ||
          state.matchedLocation.startsWith('/forgot-password') ||
          state.matchedLocation.startsWith('/reset-password') ||
          state.matchedLocation.startsWith('/verify-email');

      if (!loggedIn && state.matchedLocation == '/home') return '/login';
      if (loggedIn &&
          (state.matchedLocation == '/login' ||
              state.matchedLocation == '/register')) {
        return '/transactions';
      }
      if (loggedIn && state.matchedLocation == '/home') {
        return '/transactions';
      }
      if (loggedIn &&
          (state.matchedLocation == '/trips' ||
              state.matchedLocation.startsWith('/trips/')) &&
          auth.user?.plano != 'PREMIUM') {
        return '/transactions';
      }
      if (!loggedIn && !loggingIn) return '/login';
      if (loggedIn && !_isKnownAuthedLocation(state.matchedLocation)) {
        return '/transactions';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const AuthPage(child: LoginScreen()),
      ),
      GoRoute(
        path: '/auth/callback',
        builder: (context, state) =>
            AuthPage(child: AuthCallbackScreen(uri: state.uri)),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const AuthPage(child: RegisterScreen()),
      ),
      GoRoute(
        path: '/termos',
        builder: (context, state) => const LegalDocumentScreen(
          meta: termsOfUseMeta,
          sections: termsOfUseSections,
        ),
      ),
      GoRoute(
        path: '/privacidade',
        builder: (context, state) => const LegalDocumentScreen(
          meta: privacyPolicyMeta,
          sections: privacyPolicySections,
        ),
      ),
      GoRoute(
        path: '/register/email-sent',
        builder: (context, state) => AuthPage(
          child: EmailSentScreen(
            email: state.uri.queryParameters['email'] ?? '',
            kind: EmailSentKind.register,
          ),
        ),
      ),
      GoRoute(
        path: '/verify-email/:token',
        builder: (context, state) => AuthPage(
          child: VerifyEmailScreen(token: state.pathParameters['token'] ?? ''),
        ),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) =>
            const AuthPage(child: ForgotPasswordScreen()),
      ),
      GoRoute(
        path: '/forgot-password/email-sent',
        builder: (context, state) => AuthPage(
          child: EmailSentScreen(
            email: state.uri.queryParameters['email'] ?? '',
            kind: EmailSentKind.forgot,
          ),
        ),
      ),
      GoRoute(
        path: '/reset-password/success',
        builder: (context, state) =>
            const AuthPage(child: ResetPasswordSuccessScreen()),
      ),
      GoRoute(
        path: '/reset-password/:token',
        builder: (context, state) => AuthPage(
          child: ResetPasswordScreen(
            token: state.pathParameters['token'] ?? '',
          ),
        ),
      ),
      GoRoute(
        path: '/transactions/new',
        builder: (context, state) => TransactionFormScreen(
          repository: context.read<TransactionRepository>(),
        ),
      ),
      GoRoute(
        path: '/transactions/:id',
        builder: (context, state) => TransactionFormScreen(
          repository: context.read<TransactionRepository>(),
          transacao: state.extra is PulsoTransacao
              ? state.extra as PulsoTransacao
              : null,
        ),
      ),
      GoRoute(
        path: '/calendar/reminder',
        builder: (context, state) => ReminderFormScreen(
          lembrete: state.extra is PulsoLembrete
              ? state.extra as PulsoLembrete
              : null,
        ),
      ),
      GoRoute(
        path: '/goals/form',
        builder: (context, state) => GoalFormScreen(
          meta: state.extra is PulsoMeta ? state.extra as PulsoMeta : null,
        ),
      ),
      GoRoute(
        path: '/budget/edit',
        builder: (context, state) => const BudgetEditScreen(),
      ),
      GoRoute(
        path: '/trips/new',
        builder: (context, state) => const TripFormScreen(),
      ),
      GoRoute(
        path: '/trips/:id/edit',
        builder: (context, state) => TripFormScreen(
          viagem: state.extra is PulsoViagem
              ? state.extra as PulsoViagem
              : null,
        ),
      ),
      GoRoute(
        path: '/trips/:id',
        builder: (context, state) => TripDetailScreen(
          viagemId: state.pathParameters['id'] ?? '',
          viagem: state.extra is PulsoViagem
              ? state.extra as PulsoViagem
              : null,
        ),
      ),
      GoRoute(
        path: '/purchase-planning/form',
        builder: (context, state) => PurchaseItemFormScreen(
          item: state.extra is PurchaseItem
              ? state.extra as PurchaseItem
              : null,
        ),
      ),
      GoRoute(
        path: '/groups/new',
        builder: (context, state) => const GroupFormScreen(),
      ),
      GoRoute(
        path: '/expense-split/new',
        builder: (context, state) => ExpenseSplitFormScreen(
          divisao: state.extra is PulsoDivisao
              ? state.extra as PulsoDivisao
              : null,
        ),
      ),
      GoRoute(
        path: '/debts/new',
        builder: (context, state) => DebtFormScreen(
          divida: state.extra is PulsoDivida
              ? state.extra as PulsoDivida
              : null,
        ),
      ),
      GoRoute(
        path: '/dashboard/import',
        builder: (context, state) => const ImportStatementScreen(),
      ),
      GoRoute(
        path: '/groups/:id',
        builder: (context, state) => GroupDetailScreen(
          grupoId: state.pathParameters['id'] ?? '',
          inicial: state.extra is PulsoGrupo ? state.extra as PulsoGrupo : null,
        ),
      ),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/transactions',
            builder: (context, state) => const TransactionsScreen(),
          ),
          GoRoute(
            path: '/calendar',
            builder: (context, state) => const CalendarScreen(),
          ),
          GoRoute(
            path: '/categories',
            builder: (context, state) => CategoriesScreen(
              repository: context.read<TransactionRepository>(),
            ),
          ),
          GoRoute(
            path: '/tags',
            builder: (context, state) =>
                TagsScreen(repository: context.read<TransactionRepository>()),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) =>
                const AccountScreen(mode: AccountMode.profile),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) =>
                const AccountScreen(mode: AccountMode.settings),
          ),
          GoRoute(
            path: '/goals',
            builder: (context, state) => const GoalsScreen(),
          ),
          GoRoute(
            path: '/budget',
            builder: (context, state) => const BudgetScreen(),
          ),
          GoRoute(
            path: '/trips',
            builder: (context, state) => const TripsScreen(),
          ),
          GoRoute(
            path: '/purchase-planning',
            builder: (context, state) => const PurchasePlanningScreen(),
          ),
          GoRoute(
            path: '/groups',
            builder: (context, state) => const GroupsScreen(),
          ),
          GoRoute(
            path: '/expense-split',
            builder: (context, state) => const ExpenseSplitScreen(),
          ),
          GoRoute(
            path: '/debts',
            builder: (context, state) => const DebtsScreen(),
          ),
          GoRoute(
            path: '/chatbot',
            builder: (context, state) => ChatbotScreen(
              modo: state.uri.queryParameters['modo'] == 'quick_add'
                  ? 'quick_add'
                  : 'chat',
            ),
          ),
        ],
      ),
    ],
  );
}

bool _isKnownAuthedLocation(String loc) {
  if (loc == '/dashboard' ||
      loc == '/dashboard/import' ||
      loc == '/transactions' ||
      loc == '/categories' ||
      loc == '/tags' ||
      loc == '/account')
    return true;
  if (loc == '/calendar' || loc == '/calendar/reminder') return true;
  if (loc == '/profile' || loc == '/settings') return true;
  if (loc == '/goals' || loc == '/goals/form') return true;
  if (loc == '/budget' || loc == '/budget/edit') return true;
  if (loc == '/trips' || loc == '/trips/new' || loc.startsWith('/trips/'))
    return true;
  if (loc == '/purchase-planning' || loc == '/purchase-planning/form')
    return true;
  if (loc == '/groups' || loc == '/groups/new' || loc.startsWith('/groups/')) {
    return true;
  }
  if (loc == '/debts' || loc == '/debts/new') return true;
  if (loc == '/expense-split' || loc == '/expense-split/new') return true;
  if (loc == '/chatbot') return true;
  if (loc == '/transactions/new' || loc.startsWith('/transactions/'))
    return true;
  if (loc == '/termos' || loc == '/privacidade') return true;
  return false;
}

void bindAuthDeepLinks(GoRouter router) {
  final links = AppLinks();
  Future<void> handle(Uri uri) async {
    final location = locationFromAuthUri(uri);
    if (location != null) router.go(location);
  }

  links.getInitialLink().then((uri) {
    if (uri != null) handle(uri);
  });
  links.uriLinkStream.listen(handle);
}

String? locationFromAuthUri(Uri uri) {
  final path = uri.path.toLowerCase();
  final host = uri.host.toLowerCase();

  String? tokenFrom(String marker) {
    if (uri.queryParameters['token']?.isNotEmpty == true) {
      return uri.queryParameters['token'];
    }
    final segments = uri.pathSegments;
    final index = segments.indexWhere((item) => item.toLowerCase() == marker);
    if (index >= 0 && index + 1 < segments.length) return segments[index + 1];
    if (host == marker && uri.pathSegments.isNotEmpty)
      return uri.pathSegments.first;
    return null;
  }

  if (path.contains('verify-email') || host == 'verify-email') {
    final token = tokenFrom('verify-email');
    if (token != null && token.isNotEmpty) {
      return '/verify-email/${Uri.encodeComponent(token)}';
    }
  }
  if (path.contains('reset-password') || host == 'reset-password') {
    final token = tokenFrom('reset-password');
    if (token != null && token.isNotEmpty) {
      return '/reset-password/${Uri.encodeComponent(token)}';
    }
  }
  return null;
}
