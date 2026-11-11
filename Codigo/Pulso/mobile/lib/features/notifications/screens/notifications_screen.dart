import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/notifications/data/notification_models.dart';
import 'package:pulso/features/notifications/state/notifications_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NotificationsController>().load();
    });
  }

  IconData _iconFor(String tipo) {
    return switch (tipo) {
      'RECEITA_REGISTRADA' => Icons.trending_up,
      'DESPESA_REGISTRADA' => Icons.trending_down,
      'TRANSFERENCIA_REGISTRADA' => Icons.swap_horiz,
      'META_ATINGIDA' => Icons.flag_outlined,
      'ALERTA_ORCAMENTO' => Icons.warning_amber_outlined,
      'ORCAMENTO_ESTOURADO' => Icons.error_outline,
      'LEMBRETE_VENCIMENTO' => Icons.alarm,
      'GRUPO_ATIVIDADE' => Icons.groups_2_outlined,
      'DIVIDA_COBRANCA' => Icons.account_balance_wallet_outlined,
      'INSIGHT_IA' => Icons.auto_awesome,
      'ACAO_CONCLUIDA' => Icons.check_circle_outline,
      _ => Icons.notifications_outlined,
    };
  }

  Future<void> _open(PulsoNotificacao item) async {
    final controller = context.read<NotificationsController>();
    try {
      if (!item.lida) await controller.markRead(item.id);
      final route = item.linkAcao?.trim();
      if (route != null && route.isNotEmpty && mounted) {
        context.push(route.startsWith('/') ? route : '/$route');
      }
    } on ApiException catch (err) {
      if (!mounted) return;
      showPulsoSnack(context, err.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<NotificationsController>();

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        PulsoTokens.space4,
        PulsoTokens.space2,
        PulsoTokens.space4,
        96,
      ),
      children: [
        PulsoPageHeader(
          title: 'Notificações',
          subtitle: controller.unread > 0
              ? '${controller.unread} não lida(s)'
              : 'Você está em dia com tudo!',
          icon: Icons.notifications_outlined,
          trailing: TextButton(
            onPressed: controller.unread == 0
                ? null
                : () async {
                    try {
                      await controller.markAll();
                    } on ApiException catch (err) {
                      if (!context.mounted) return;
                      showPulsoSnack(context, err.message);
                    }
                  },
            child: const Text('Marcar todas'),
          ),
        ),
        if (controller.loading)
          const Padding(
            padding: EdgeInsets.only(top: 48),
            child: Center(child: CircularProgressIndicator()),
          )
        else if (controller.error != null)
          PulsoEmptyState(
            title: 'Erro',
            description: controller.error!,
            actionLabel: 'Tentar de novo',
            onAction: controller.load,
          )
        else if (controller.items.isEmpty)
          const PulsoEmptyState(
            title: 'Nenhuma notificação',
            description:
                'Avisos de orçamento, lembretes e metas aparecem aqui.',
            icon: Icons.notifications_none,
          )
        else
          ...controller.items.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
              child: PulsoSurface(
                child: ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: Theme.of(context).colorScheme.primary
                        .withValues(alpha: 0.12),
                    child: Icon(
                      _iconFor(item.tipo),
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  title: Text(
                    item.titulo,
                    style: TextStyle(
                      fontWeight: item.lida ? FontWeight.w500 : FontWeight.w700,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Text(item.mensagem),
                      if (item.criadoEm != null) ...[
                        const SizedBox(height: 6),
                        Text(
                          formatDayHeader(item.criadoEm!),
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                      ],
                    ],
                  ),
                  trailing: item.lida
                      ? null
                      : IconButton(
                          tooltip: 'Marcar como lida',
                          onPressed: () async {
                            try {
                              await controller.markRead(item.id);
                            } on ApiException catch (err) {
                              if (!context.mounted) return;
                              showPulsoSnack(context, err.message);
                            }
                          },
                          icon: const Icon(Icons.done),
                        ),
                  onTap: () => _open(item),
                ),
              ),
            );
          }),
      ],
    );
  }
}
