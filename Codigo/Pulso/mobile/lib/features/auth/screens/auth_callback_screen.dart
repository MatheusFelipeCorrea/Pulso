import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';

class AuthCallbackScreen extends StatefulWidget {
  const AuthCallbackScreen({super.key, required this.uri});

  final Uri uri;

  @override
  State<AuthCallbackScreen> createState() => _AuthCallbackScreenState();
}

class _AuthCallbackScreenState extends State<AuthCallbackScreen> {
  String? _error;
  bool _handled = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _complete());
  }

  Future<void> _complete() async {
    if (_handled) return;
    _handled = true;

    final error = widget.uri.queryParameters['error'];
    final message = widget.uri.queryParameters['message'];
    final exchange = widget.uri.queryParameters['exchange'];

    if (error != null || exchange == null || exchange.isEmpty) {
      setState(() {
        _error = message ?? 'A autenticação com Google não pôde ser concluída.';
      });
      return;
    }

    try {
      await context.read<AuthController>().exchangeOAuth(exchange);
      if (!mounted) return;
      context.go('/home');
    } catch (err) {
      if (!mounted) return;
      setState(() => _error = AuthController.messageOf(err));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return AuthCard(
        icon: Icons.error_outline,
        title: 'Não foi possível entrar',
        subtitle: _error!,
        child: FilledButton(
          onPressed: () => context.go('/login'),
          child: const Text('Voltar ao Login'),
        ),
      );
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;
    return AuthCard(
      icon: Icons.login,
      title: 'Entrando no Pulso...',
      subtitle: 'Concluindo a autenticação com Google.',
      child: Center(
        child: CircularProgressIndicator(
          color: isDark ? PulsoColors.primaryLight : PulsoColors.primary,
        ),
      ),
    );
  }
}
