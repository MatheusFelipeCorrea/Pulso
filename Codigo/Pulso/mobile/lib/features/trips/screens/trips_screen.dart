import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/currency/widgets/trip_currency_panel.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/state/trips_controller.dart';

class TripsScreen extends StatefulWidget {
  const TripsScreen({super.key});

  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<TripsController>().reload();
    });
  }

  @override
  Widget build(BuildContext context) {
    final premium = context.watch<AuthController>().user?.plano == 'PREMIUM';
    final controller = context.watch<TripsController>();

    if (!premium) {
      return const PulsoEmptyState(
        title: 'Viagens são Premium',
        description: 'O planejamento de viagens e cotações avançadas fica no plano Premium, como na web.',
      );
    }

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, PulsoTokens.space8),
        children: [
          Text('Viagens e moedas', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: PulsoTokens.space3),
          TripCurrencyPanel(repository: context.read<CurrencyRepository>()),
          const SizedBox(height: PulsoTokens.space4),
          Row(
            children: [
              Text('Minhas viagens', style: Theme.of(context).textTheme.titleSmall),
              const Spacer(),
              TextButton(onPressed: () => context.push('/trips/new'), child: const Text('Nova')),
            ],
          ),
          if (controller.loading && controller.viagens.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(title: 'Não foi possível carregar', description: controller.error!)
          else if (controller.viagens.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma viagem',
              description: 'Crie uma viagem para guardar destino, moeda e despesas.',
              actionLabel: 'Nova viagem',
              onAction: () => context.push('/trips/new'),
            )
          else
            ...controller.viagens.map(
              (viagem) => Card(
                margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
                child: ListTile(
                  title: Text(viagem.destino),
                  subtitle: Text('${viagem.moeda} · ${formatDayHeader(viagem.dataPrevista)}'),
                  trailing: Text(formatBrl(viagem.totalBrl)),
                  onTap: () => context.push('/trips/${viagem.id}'),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
