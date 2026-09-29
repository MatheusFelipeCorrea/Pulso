import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthController>().user;
    final badge = badgeFromModoUso(user?.modoUso);

    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text(
          'Olá, ${user?.nome ?? 'usuário'}',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        Text(user?.email ?? ''),
        const SizedBox(height: 12),
        Align(alignment: Alignment.centerLeft, child: PulsoBadge(style: badge)),
        const SizedBox(height: 24),
        Text(
          'Dashboard',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        const Text('Resumo completo entra depois. O núcleo de transações já está no menu Financeiro.'),
      ],
    );
  }
}
