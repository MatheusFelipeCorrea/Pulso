import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';
import 'package:pulso/features/auth/widgets/auth_extras.dart';
import 'package:pulso/features/auth/widgets/pulso_fields.dart';
import 'package:pulso/features/auth/widgets/pulso_google_auth_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _identificador = TextEditingController();
  final _senha = TextEditingController();
  bool _lembrarMe = false;
  bool _submitting = false;
  bool _resending = false;
  String? _credentialsError;
  bool _showResend = false;

  @override
  void dispose() {
    _identificador.dispose();
    _senha.dispose();
    super.dispose();
  }

  bool get _canSubmit =>
      _identificador.text.trim().isNotEmpty &&
      _senha.text.isNotEmpty &&
      !_submitting;

  Future<void> _submit() async {
    setState(() {
      _submitting = true;
      _credentialsError = null;
      _showResend = false;
    });
    try {
      await context.read<AuthController>().login(
        identificador: _identificador.text,
        senha: _senha.text,
        lembrarMe: _lembrarMe,
      );
      if (!mounted) return;
      final nome = context.read<AuthController>().user?.nome ?? '';
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Bem-vindo de volta, $nome!')));
      context.go('/transactions');
    } on ApiException catch (error) {
      if (!mounted) return;
      if (error.isForbidden) {
        setState(() => _showResend = true);
      } else if (error.isUnauthorized) {
        setState(() => _credentialsError = error.message);
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.message)));
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<void> _resend() async {
    final value = _identificador.text.trim();
    if (!value.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Informe seu e-mail para reenviar a verificação.'),
        ),
      );
      return;
    }
    setState(() => _resending = true);
    try {
      await context.read<AuthController>().resendVerification(value);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Email de verificação reenviado!')),
      );
      context.go(
        '/register/email-sent?email=${Uri.encodeComponent(value.toLowerCase())}',
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(AuthController.messageOf(error))));
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  Future<void> _google(String idToken) async {
    await context.read<AuthController>().loginWithGoogleIdToken(idToken);
    if (!mounted) return;
    context.go('/transactions');
  }

  @override
  Widget build(BuildContext context) {
    return AuthCard(
      icon: Icons.person_outline,
      title: 'Bem-vindo de volta!',
      subtitle: 'Acesse sua conta para continuar cuidando das suas finanças.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PulsoTextField(
            controller: _identificador,
            hint: 'E-mail ou Nome de Usuário',
            icon: Icons.person_outline,
            autofillHints: const [AutofillHints.username],
            errorText: _credentialsError,
            onChanged: (_) => setState(() {
              _credentialsError = null;
              _showResend = false;
            }),
          ),
          const SizedBox(height: 15),
          PulsoPasswordField(
            controller: _senha,
            hint: 'Senha',
            onChanged: (_) => setState(() => _credentialsError = null),
          ),
          const SizedBox(height: 12),
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            alignment: WrapAlignment.spaceBetween,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Checkbox(
                    value: _lembrarMe,
                    onChanged: (value) =>
                        setState(() => _lembrarMe = value ?? false),
                  ),
                  const Text('Lembrar-me'),
                ],
              ),
              TextButton(
                onPressed: () => context.go('/forgot-password'),
                child: const Text('Esqueci minha senha'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: _canSubmit ? _submit : null,
            child: Text(_submitting ? 'Entrando...' : 'Entrar'),
          ),
          if (_showResend) ...[
            const SizedBox(height: 16),
            const Text(
              'Sua conta ainda não foi verificada.',
              textAlign: TextAlign.center,
            ),
            TextButton(
              onPressed: _resending ? null : _resend,
              child: Text(
                _resending ? 'Reenviando...' : 'Reenviar email de verificação',
              ),
            ),
          ],
          const AuthDivider(label: 'ou continue com'),
          PulsoGoogleAuthButton(
            label: 'Entrar com o Google',
            onIdToken: _google,
          ),
          AuthFooterLink(
            prompt: 'Ainda não possui uma conta? ',
            action: 'Cadastre-se',
            onTap: () => context.go('/register'),
          ),
        ],
      ),
    );
  }
}
