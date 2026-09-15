import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/utils/password_strength.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';
import 'package:pulso/features/auth/widgets/password_strength_hints.dart';
import 'package:pulso/features/auth/widgets/pulso_fields.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key, required this.token});

  final String token;

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _senha = TextEditingController();
  final _confirmar = TextEditingController();
  bool _loading = true;
  bool _invalid = false;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _validate();
  }

  Future<void> _validate() async {
    try {
      await context.read<AuthController>().validateResetToken(widget.token);
      if (mounted) setState(() => _loading = false);
    } catch (_) {
      if (mounted) {
        setState(() {
          _loading = false;
          _invalid = true;
        });
      }
    }
  }

  @override
  void dispose() {
    _senha.dispose();
    _confirmar.dispose();
    super.dispose();
  }

  bool get _canSubmit =>
      allPasswordRulesPassed(_senha.text) && _senha.text == _confirmar.text && !_submitting;

  Future<void> _submit() async {
    setState(() => _submitting = true);
    try {
      await context.read<AuthController>().resetPassword(
            token: widget.token,
            senha: _senha.text,
            confirmarSenha: _confirmar.text,
          );
      if (!mounted) return;
      context.go('/reset-password/success');
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AuthController.messageOf(error))),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const AuthCard(
        icon: Icons.lock_reset,
        title: 'Validando link...',
        subtitle: 'Aguarde enquanto verificamos seu link de recuperação.',
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_invalid) {
      return AuthCard(
        icon: Icons.error_outline,
        title: 'Link expirado ou inválido',
        subtitle: 'Solicite um novo link de recuperação para continuar.',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            FilledButton(
              onPressed: () => context.go('/forgot-password'),
              child: const Text('Solicitar novo link'),
            ),
            TextButton(
              onPressed: () => context.go('/login'),
              child: const Text('Voltar para o Login'),
            ),
          ],
        ),
      );
    }

    return AuthCard(
      icon: Icons.lock_reset,
      title: 'Altere sua Senha',
      subtitle: 'Crie uma nova senha forte para sua conta.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PulsoPasswordField(
            controller: _senha,
            hint: 'Nova senha',
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          PasswordStrengthHints(password: _senha.text),
          const SizedBox(height: 15),
          PulsoPasswordField(
            controller: _confirmar,
            hint: 'Confirmar nova senha',
            errorText: _confirmar.text.isNotEmpty && _confirmar.text != _senha.text
                ? 'As senhas não conferem.'
                : null,
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _canSubmit ? _submit : null,
            child: Text(_submitting ? 'Alterando...' : 'Alterar Senha'),
          ),
        ],
      ),
    );
  }
}

class ResetPasswordSuccessScreen extends StatelessWidget {
  const ResetPasswordSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AuthCard(
      icon: Icons.check_circle_outline,
      title: 'Senha alterada com sucesso!',
      subtitle: 'Recomendamos que você não compartilhe sua senha com ninguém.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          FilledButton(
            onPressed: () => context.go('/login'),
            child: const Text('Ir para o Login'),
          ),
          const SizedBox(height: 8),
          Text(
            'com sucesso!',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: PulsoColors.primary),
          ),
        ],
      ),
    );
  }
}
