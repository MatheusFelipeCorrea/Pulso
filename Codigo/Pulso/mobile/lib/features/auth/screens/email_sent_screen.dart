import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';

class EmailSentScreen extends StatelessWidget {
  const EmailSentScreen({super.key, required this.email, required this.kind});

  final String email;
  final EmailSentKind kind;

  @override
  Widget build(BuildContext context) {
    final isRegister = kind == EmailSentKind.register;
    return AuthCard(
      icon: Icons.mark_email_read_outlined,
      iconOutlined: true,
      title: 'Email Enviado!',
      subtitle: isRegister
          ? 'Enviamos um email de confirmação para o endereço:'
          : 'Enviamos um email de alteração de senha para o endereço:',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: PulsoColors.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              email.isEmpty ? 'seu e-mail' : email,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: PulsoColors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            isRegister
                ? 'Abra o e-mail e ative sua conta para fazer login.'
                : 'Clique no link do email para alterar sua senha.',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: PulsoColors.primary.withValues(alpha: 0.07),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: PulsoColors.primary.withValues(alpha: 0.14),
              ),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Não recebeu o email?',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                SizedBox(height: 4),
                Text(
                  'Verifique sua caixa de entrada, spam ou lixo eletrônico.',
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Este link expira em 1 hora por segurança.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12),
          ),
          const SizedBox(height: 20),
          OutlinedButton(
            onPressed: () => context.go('/login'),
            child: const Text('Voltar para o Login'),
          ),
        ],
      ),
    );
  }
}

enum EmailSentKind { register, forgot }
