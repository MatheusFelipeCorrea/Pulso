import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/utils/email.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';
import 'package:pulso/features/auth/widgets/auth_extras.dart';
import 'package:pulso/features/auth/widgets/pulso_fields.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _email = TextEditingController();
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  bool get _canSubmit => isValidEmail(_email.text) && !_submitting;

  Future<void> _submit() async {
    final value = _email.text.trim().toLowerCase();
    if (!isValidEmail(value)) {
      setState(() => _error = 'Email inválido');
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      await context.read<AuthController>().forgotPassword(value);
      if (!mounted) return;
      context.go(
        '/forgot-password/email-sent?email=${Uri.encodeComponent(value)}',
      );
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = AuthController.messageOf(error));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return AuthCard(
      icon: Icons.person_outline,
      iconOutlined: true,
      title: 'Recupere sua Senha',
      subtitle: 'Informe seu Email para receber um link de Recuperação.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PulsoTextField(
            controller: _email,
            hint: 'E-mail',
            icon: Icons.person_outline,
            keyboardType: TextInputType.emailAddress,
            errorText: _error,
            onChanged: (_) => setState(() => _error = null),
          ),
          const SizedBox(height: 16),
          AuthSubmitButton(
            label: _submitting ? 'Enviando...' : 'Enviar Link De Recuperação',
            icon: _submitting ? null : Icons.mail_outline,
            loading: _submitting,
            onPressed: _canSubmit ? _submit : null,
          ),
          TextButton(
            onPressed: () => context.go('/login'),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.arrow_back,
                  size: 16,
                  color: isDark
                      ? PulsoColors.darkSecondary
                      : PulsoColors.lightSecondary,
                ),
                const SizedBox(width: 6),
                const Text('Voltar para o Login'),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const AuthInfoAlert(
            message: 'Enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e spam.',
          ),
        ],
      ),
    );
  }
}
