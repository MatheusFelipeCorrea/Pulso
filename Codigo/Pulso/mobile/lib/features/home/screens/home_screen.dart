import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/transactions/widgets/summary_cards.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final controller = context.read<TransactionsController>();
      if (controller.resumo == null && !controller.loading) {
        controller.bootstrap();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthController>().user;
    final tx = context.watch<TransactionsController>();
    final brightness = Theme.of(context).brightness;
    final kind = badgeKindFromModoUso(user?.modoUso);

    return ListView(
      padding: const EdgeInsets.all(PulsoTokens.space6),
      children: [
        Text(
          'Olá, ${user?.nome ?? 'usuário'}',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: PulsoTokens.space2),
        Text(user?.email ?? '', style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: PulsoTokens.space3),
        if (kind != null) Align(alignment: Alignment.centerLeft, child: PulsoBadge.kind(kind: kind, brightness: brightness)),
        const SizedBox(height: PulsoTokens.space6),
        TransactionSummaryCards(resumo: tx.resumo, loading: tx.loading && tx.resumo == null),
        const SizedBox(height: PulsoTokens.space5),
        FilledButton.icon(
          onPressed: () => context.push('/transactions/new'),
          icon: const Icon(Icons.add),
          label: const Text('Nova transação'),
        ),
        const SizedBox(height: PulsoTokens.space2),
        OutlinedButton(
          onPressed: () => context.go('/transactions'),
          child: const Text('Ver transações'),
        ),
      ],
    );
  }
}
