import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/utils/email.dart';
import 'package:pulso/features/auth/utils/password_strength.dart';
import 'package:pulso/features/auth/widgets/auth_card.dart';
import 'package:pulso/features/auth/widgets/auth_extras.dart';
import 'package:pulso/features/auth/widgets/password_strength_hints.dart';
import 'package:pulso/features/auth/widgets/pulso_fields.dart';
import 'package:pulso/features/auth/widgets/pulso_google_auth_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nome = TextEditingController();
  final _email = TextEditingController();
  final _senha = TextEditingController();
  final _confirmar = TextEditingController();
  bool _aceitarTermos = false;
  bool _submitting = false;
  String? _nomeError;
  String? _emailError;
  String? _senhaError;
  String? _confirmarError;
  late final TapGestureRecognizer _termosTap;
  late final TapGestureRecognizer _privacidadeTap;

  @override
  void initState() {
    super.initState();
    _termosTap = TapGestureRecognizer()
      ..onTap = () {
        if (!mounted) return;
        context.push('/termos');
      };
    _privacidadeTap = TapGestureRecognizer()
      ..onTap = () {
        if (!mounted) return;
        context.push('/privacidade');
      };
  }

  @override
  void dispose() {
    _nome.dispose();
    _email.dispose();
    _senha.dispose();
    _confirmar.dispose();
    _termosTap.dispose();
    _privacidadeTap.dispose();
    super.dispose();
  }

  bool get _isValid {
    return _nome.text.trim().length >= 3 &&
        isValidEmail(_email.text) &&
        senhaForteRegex.hasMatch(_senha.text) &&
        _senha.text == _confirmar.text &&
        _aceitarTermos;
  }

  void _validateLocal() {
    setState(() {
      _nomeError = _nome.text.trim().length < 3 ? 'Nome deve ter no mínimo 3 caracteres' : null;
      _emailError = isValidEmail(_email.text) ? null : 'Email inválido';
      _senhaError = senhaForteRegex.hasMatch(_senha.text)
          ? null
          : 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.';
      _confirmarError = _senha.text == _confirmar.text ? null : 'As senhas não conferem.';
    });
  }

  Future<void> _submit() async {
    _validateLocal();
    if (!_aceitarTermos) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Você deve aceitar os termos')),
      );
      return;
    }
    if (!_isValid) return;
    setState(() => _submitting = true);
    try {
      await context.read<AuthController>().register(
            nome: _nome.text,
            email: _email.text,
            senha: _senha.text,
            confirmarSenha: _confirmar.text,
          );
      if (!mounted) return;
      context.go('/register/email-sent?email=${Uri.encodeComponent(_email.text.trim().toLowerCase())}');
    } on ApiException catch (error) {
      if (!mounted) return;
      if (error.isConflict) {
        setState(() => _emailError = error.message);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<void> _google(String idToken) async {
    await context.read<AuthController>().loginWithGoogleIdToken(idToken);
    if (!mounted) return;
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    return AuthCard(
      icon: Icons.person_outline,
      title: 'Crie sua conta',
      subtitle: 'Preencha os dados abaixo para começar a usar o Pulso.',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PulsoTextField(
            controller: _nome,
            hint: 'Nome completo',
            icon: Icons.badge_outlined,
            textCapitalization: TextCapitalization.words,
            errorText: _nomeError,
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 15),
          PulsoTextField(
            controller: _email,
            hint: 'E-mail',
            icon: Icons.mail_outline,
            keyboardType: TextInputType.emailAddress,
            errorText: _emailError,
            onChanged: (_) => setState(() => _emailError = null),
          ),
          const SizedBox(height: 15),
          PulsoPasswordField(
            controller: _senha,
            hint: 'Senha',
            errorText: _senhaError,
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          PasswordStrengthHints(password: _senha.text),
          const SizedBox(height: 15),
          PulsoPasswordField(
            controller: _confirmar,
            hint: 'Confirmar senha',
            errorText: _confirmarError,
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Checkbox(
                value: _aceitarTermos,
                onChanged: (value) => setState(() => _aceitarTermos = value ?? false),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Text.rich(
                    TextSpan(
                      text: 'Eu aceito os ',
                      children: [
                        TextSpan(
                          text: 'Termos de Uso',
                          style: const TextStyle(
                            color: PulsoColors.primary,
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                          ),
                          recognizer: _termosTap,
                        ),
                        const TextSpan(text: ' e a '),
                        TextSpan(
                          text: 'Política de Privacidade',
                          style: const TextStyle(
                            color: PulsoColors.primary,
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                          ),
                          recognizer: _privacidadeTap,
                        ),
                        const TextSpan(text: '.'),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: _isValid && !_submitting ? _submit : null,
            child: Text(_submitting ? 'Cadastrando...' : 'Cadastrar'),
          ),
          const AuthDivider(label: 'ou cadastre-se com'),
          PulsoGoogleAuthButton(
            label: 'Cadastrar com Google',
            onIdToken: _google,
          ),
          AuthFooterLink(
            prompt: 'Já possui uma conta? ',
            action: 'Fazer Login',
            onTap: () => context.go('/login'),
          ),
        ],
      ),
    );
  }
}
