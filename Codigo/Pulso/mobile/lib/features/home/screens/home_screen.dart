import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/pulso_brand.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(
        title: const PulsoBrand(height: 28),
        actions: [
          TextButton(
            onPressed: () async {
              await auth.logout();
              if (context.mounted) context.go('/login');
            },
            child: const Text('Sair'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Olá, ${user?.nome ?? 'usuário'}',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(user?.email ?? ''),
            const SizedBox(height: 8),
            Text('Plano ${user?.plano ?? 'FREE'}'),
            const SizedBox(height: 24),
            const Text(
              'Sessão autenticada na mesma API da Web. O restante do app nativo entra nas próximas sprints — aqui não há landing page.',
            ),
          ],
        ),
      ),
    );
  }
}
