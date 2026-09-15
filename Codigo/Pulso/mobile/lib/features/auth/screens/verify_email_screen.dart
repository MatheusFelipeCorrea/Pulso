import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';

class VerifyEmailScreen extends StatefulWidget {
  const VerifyEmailScreen({super.key, required this.token});

  final String token;

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  bool _loading = true;
  bool _already = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _verify();
  }

  Future<void> _verify() async {
    try {
      final result = await context.read<AuthController>().verifyEmail(widget.token);
      if (!mounted) return;
      setState(() {
        _loading = false;
        _already = result['alreadyVerified'] == true;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = AuthController.messageOf(error);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const AuthCard(
        icon: Icons.mark_email_unread_outlined,
        title: 'Verificando e-mail...',
        subtitle: 'Aguarde enquanto confirmamos seu cadastro.',
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return AuthCard(
        icon: Icons.error_outline,
        title: 'Link inválido ou expirado',
        subtitle: _error!,
        child: FilledButton(
          onPressed: () => context.go('/login'),
          child: const Text('Ir para o Login'),
        ),
      );
    }

    return AuthCard(
      icon: Icons.verified_outlined,
      title: _already ? 'Este email já estava verificado.' : 'Email verificado com sucesso!',
      subtitle: 'Faça login para continuar.',
      child: FilledButton(
        onPressed: () => context.go('/login?verified=${_already ? 'already' : 'true'}'),
        child: const Text('Ir para o Login'),
      ),
    );
  }
}
