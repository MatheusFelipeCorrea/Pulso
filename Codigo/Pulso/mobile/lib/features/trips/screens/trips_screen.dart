import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/currency/widgets/trip_currency_panel.dart';
import 'package:pulso/features/currency/widgets/trip_rate_chart.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/state/trips_controller.dart';
import 'package:pulso/features/trips/widgets/trip_cover_card.dart';

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

  Future<void> _delete(PulsoViagem viagem) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir viagem',
      message: 'Excluir a viagem para ${viagem.destino}?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<TripsController>().excluir(viagem.id);
      if (!mounted) return;
      showPulsoSnack(context, 'Viagem excluída');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final premium = context.watch<AuthController>().user?.plano == 'PREMIUM';
    final controller = context.watch<TripsController>();

    if (!premium) {
      return ListView(
        padding: const EdgeInsets.fromLTRB(
          PulsoTokens.space4,
          PulsoTokens.space2,
          PulsoTokens.space4,
          96,
        ),
        children: const [
          PulsoPageHeader(
            title: 'Viagens e moedas',
            subtitle:
                'Acompanhe cotações, converta moedas e planeje suas viagens.',
            icon: Icons.flight_takeoff,
          ),
          PulsoSurface(
            child: PulsoEmptyState(
              title: 'Viagens são Premium',
              description: 'O planejamento de viagens e cotações avançadas fica no plano Premium, como na web.',
              icon: Icons.workspace_premium_outlined,
            ),
          ),
        ],
      );
    }

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(
          PulsoTokens.space4,
          PulsoTokens.space2,
          PulsoTokens.space4,
          96,
        ),
        children: [
          const PulsoPageHeader(
            title: 'Viagens e moedas',
            subtitle:
                'Acompanhe cotações, converta moedas e planeje suas viagens.',
            icon: Icons.flight_takeoff,
          ),
          TripCurrencyPanel(repository: context.read<CurrencyRepository>()),
          const SizedBox(height: PulsoTokens.space5),
          PulsoSectionHeader(
            title: controller.viagens.isEmpty
                ? 'Minhas viagens'
                : 'Minhas viagens (${controller.viagens.length})',
            icon: Icons.luggage_outlined,
            actionLabel: 'Nova',
            onAction: () => context.push('/trips/new'),
          ),
          if (controller.loading && controller.viagens.isEmpty)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Não foi possível carregar',
              description: controller.error!,
              icon: Icons.cloud_off,
            )
          else if (controller.viagens.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma viagem',
              description: 'Crie uma viagem para guardar destino, moeda, pretensões e observações.',
              icon: Icons.flight_takeoff,
              actionLabel: 'Nova viagem',
              onAction: () => context.push('/trips/new'),
            )
          else
            ...controller.viagens.map(
              (viagem) => TripCoverCard(
                viagem: viagem,
                onOpen: () =>
                    context.push('/trips/${viagem.id}', extra: viagem),
                onEdit: () =>
                    context.push('/trips/${viagem.id}/edit', extra: viagem),
                onDelete: () => _delete(viagem),
              ),
            ),
          const SizedBox(height: PulsoTokens.space5),
          TripRateChart(repository: context.read<CurrencyRepository>()),
        ],
      ),
    );
  }
}
