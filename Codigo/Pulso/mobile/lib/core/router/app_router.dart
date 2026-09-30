import 'package:app_links/app_links.dart';
import 'package:go_router/go_router.dart';
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
import 'package:provider/provider.dart';
import 'package:pulso/core/widgets/app_shell.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/screens/goal_form_screen.dart';
import 'package:pulso/features/goals/screens/goals_screen.dart';
import 'package:pulso/features/home/screens/home_screen.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/screens/categories_screen.dart';
import 'package:pulso/features/transactions/screens/tags_screen.dart';
import 'package:pulso/features/transactions/screens/transaction_form_screen.dart';
import 'package:pulso/features/transactions/screens/transactions_screen.dart';

GoRouter createRouter(AuthController auth) {
  return GoRouter(
    initialLocation: auth.status == AuthStatus.authenticated ? '/transactions' : '/login',
    refreshListenable: auth,
    redirect: (context, state) {
      final loggedIn = auth.status == AuthStatus.authenticated;
      final loggingIn = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register' ||
          state.matchedLocation == '/auth/callback' ||
          state.matchedLocation == '/termos' ||
          state.matchedLocation == '/privacidade' ||
          state.matchedLocation.startsWith('/register/') ||
          state.matchedLocation.startsWith('/forgot-password') ||
          state.matchedLocation.startsWith('/reset-password') ||
          state.matchedLocation.startsWith('/verify-email');

      if (!loggedIn && state.matchedLocation == '/home') return '/login';
      if (loggedIn && (state.matchedLocation == '/login' || state.matchedLocation == '/register')) {
        return '/transactions';
      }
      if (loggedIn && state.matchedLocation == '/home') return '/dashboard';
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
        builder: (context, state) => AuthPage(
          child: AuthCallbackScreen(uri: state.uri),
        ),
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
        builder: (context, state) => const AuthPage(child: ForgotPasswordScreen()),
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
        builder: (context, state) => const AuthPage(child: ResetPasswordSuccessScreen()),
      ),
      GoRoute(
        path: '/reset-password/:token',
        builder: (context, state) => AuthPage(
          child: ResetPasswordScreen(token: state.pathParameters['token'] ?? ''),
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
          transacao: state.extra is PulsoTransacao ? state.extra as PulsoTransacao : null,
        ),
      ),
      GoRoute(
        path: '/goals/form',
        builder: (context, state) => GoalFormScreen(
          meta: state.extra is PulsoMeta ? state.extra as PulsoMeta : null,
        ),
      ),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/transactions',
            builder: (context, state) => const TransactionsScreen(),
          ),
          GoRoute(
            path: '/categories',
            builder: (context, state) => CategoriesScreen(
              repository: context.read<TransactionRepository>(),
            ),
          ),
          GoRoute(
            path: '/tags',
            builder: (context, state) => TagsScreen(
              repository: context.read<TransactionRepository>(),
            ),
          ),
          GoRoute(
            path: '/goals',
            builder: (context, state) => const GoalsScreen(),
          ),
        ],
      ),
    ],
  );
}

bool _isKnownAuthedLocation(String loc) {
  if (loc == '/dashboard' || loc == '/transactions' || loc == '/categories' || loc == '/tags') return true;
  if (loc == '/goals' || loc == '/goals/form') return true;
  if (loc == '/transactions/new' || loc.startsWith('/transactions/')) return true;
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
    if (host == marker && uri.pathSegments.isNotEmpty) return uri.pathSegments.first;
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
