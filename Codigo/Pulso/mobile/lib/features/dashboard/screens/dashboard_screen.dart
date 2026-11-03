import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';
import 'package:pulso/features/dashboard/state/dashboard_controller.dart';
import 'package:pulso/features/dashboard/utils/dashboard_labels.dart';
import 'package:pulso/features/dashboard/widgets/dashboard_charts.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<DashboardController>().bootstrap();
    });
  }

  String _firstName(String? nome) {
    final cleaned = (nome ?? '')
        .replaceAll(RegExp(r'\s*\([^)]*\)\s*'), ' ')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
    if (cleaned.isEmpty) return 'você';
    return cleaned.split(' ').first;
  }

  String _periodSubtitle(String mes) {
    final parts = mes.split('-');
    if (parts.length != 2) return 'Aqui está o resumo das suas finanças.';
    final year = int.tryParse(parts[0]);
    final month = int.tryParse(parts[1]);
    if (year == null || month == null || month < 1 || month > 12) {
      return 'Aqui está o resumo das suas finanças.';
    }
    if (mes == TransactionPeriod.current()) {
      return 'Aqui está o resumo das suas finanças deste mês.';
    }
    const months = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];
    return 'Resumo de ${months[month - 1]} de $year.';
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<DashboardController>();
    final auth = context.watch<AuthController>();
    final dados = controller.dados;
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    final accent = PulsoColors.accent(brightness);
    final firstName = _firstName(auth.user?.nome);

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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Olá, $firstName!',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _periodSubtitle(controller.mes),
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: scheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: PulsoTokens.space2),
              // TextButton avoids theme minimumSize(width: ∞) that crashes Rows.
              TextButton.icon(
                onPressed: () => context.push('/dashboard/import'),
                icon: const Icon(Icons.upload_file_outlined, size: 18),
                label: const Text('Extrato'),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space4),
          _MonthPicker(
            label: TransactionPeriod.label(controller.mes),
            loading: controller.loading,
            onPrev: () => controller.mudarMes(-1),
            onNext: () => controller.mudarMes(1),
          ),
          const SizedBox(height: PulsoTokens.space4),
          if (controller.loading && dados == null)
            const Padding(
              padding: EdgeInsets.only(top: PulsoTokens.space10),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null && dados == null)
            PulsoEmptyState(
              title: 'Dashboard indisponível',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.reload,
            )
          else if (dados != null) ...[
            if (dados.alertas.isNotEmpty) ...[
              _SectionTitle(
                title: 'Alertas de orçamento',
                actionLabel: 'Ver orçamento',
                onAction: () => context.go('/budget'),
              ),
              const SizedBox(height: PulsoTokens.space2),
              SizedBox(
                height: 118,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: dados.alertas.length,
                  separatorBuilder: (_, _) =>
                      const SizedBox(width: PulsoTokens.space3),
                  itemBuilder: (context, index) {
                    return _BudgetAlertCard(alerta: dados.alertas[index]);
                  },
                ),
              ),
              const SizedBox(height: PulsoTokens.space4),
            ],
            _BalanceHero(
              saldo: dados.saldoTotal,
              variacao: dados.variacao,
              recursos: dados.recursos,
            ),
            const SizedBox(height: PulsoTokens.space4),
            DashboardIncomeExpenseBars(
              receitas: dados.receitas,
              despesas: dados.despesas,
            ),
            const SizedBox(height: PulsoTokens.space4),
            DashboardCategoryDonut(categorias: dados.categorias),
            const SizedBox(height: PulsoTokens.space4),
            _FinancialHealthCard(saude: dados.saude),
            const SizedBox(height: PulsoTokens.space4),
            _SectionTitle(
              title: 'Últimas transações',
              actionLabel: 'Ver todas',
              onAction: () => context.go('/transactions'),
            ),
            const SizedBox(height: PulsoTokens.space2),
            PulsoSurface(
              padding: EdgeInsets.zero,
              child: dados.transacoes.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.all(PulsoTokens.space4),
                      child: Text(
                        'Nenhuma transação recente neste mês.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    )
                  : Builder(
                      builder: (context) {
                        final recent = dados.transacoes.take(5).toList();
                        return Column(
                          children: [
                            for (var i = 0; i < recent.length; i++) ...[
                              _TransactionTile(tx: recent[i]),
                              if (i < recent.length - 1)
                                Divider(
                                  height: 1,
                                  color: scheme.outline.withValues(
                                    alpha: 0.45,
                                  ),
                                ),
                            ],
                          ],
                        );
                      },
                    ),
            ),
            const SizedBox(height: PulsoTokens.space4),
            _SectionTitle(
              title: 'Metas ativas',
              actionLabel: 'Ver metas',
              onAction: () => context.go('/goals'),
            ),
            const SizedBox(height: PulsoTokens.space2),
            if (dados.metas.isEmpty)
              PulsoSurface(
                child: Text(
                  'Nenhuma meta ativa. Crie uma em Metas Financeiras.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
              )
            else
              SizedBox(
                height: 148,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: dados.metas.length,
                  separatorBuilder: (_, _) =>
                      const SizedBox(width: PulsoTokens.space3),
                  itemBuilder: (context, index) {
                    return _GoalCard(meta: dados.metas[index], accent: accent);
                  },
                ),
              ),
          ],
        ],
      ),
    );
  }
}

class _MonthPicker extends StatelessWidget {
  const _MonthPicker({
    required this.label,
    required this.loading,
    required this.onPrev,
    required this.onNext,
  });

  final String label;
  final bool loading;
  final VoidCallback onPrev;
  final VoidCallback onNext;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusFull),
        border: Border.all(color: scheme.outline.withValues(alpha: 0.55)),
      ),
      child: Row(
        children: [
          IconButton(
            tooltip: 'Mês anterior',
            onPressed: loading ? null : onPrev,
            icon: const Icon(Icons.chevron_left),
          ),
          Expanded(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
          ),
          IconButton(
            tooltip: 'Próximo mês',
            onPressed: loading ? null : onNext,
            icon: const Icon(Icons.chevron_right),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(title, style: Theme.of(context).textTheme.titleMedium),
        ),
        if (actionLabel != null && onAction != null)
          TextButton(onPressed: onAction, child: Text(actionLabel!)),
      ],
    );
  }
}

class _BalanceHero extends StatelessWidget {
  const _BalanceHero({
    required this.saldo,
    required this.variacao,
    required this.recursos,
  });

  final double saldo;
  final DashboardVariacao variacao;
  final List<DashboardRecurso> recursos;

  @override
  Widget build(BuildContext context) {
    final visual = dashboardVariacaoVisual(variacao.tipo, variacao.valor);
    final varColor = switch (visual.tom) {
      'alta' => const Color(0xFFBBF7D0),
      'queda' => const Color(0xFFFECACA),
      _ => Colors.white70,
    };

    return PulsoSurface(
      padding: EdgeInsets.zero,
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(PulsoTokens.space5),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF7C3AED), Color(0xFF5B21B6)],
              ),
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(PulsoTokens.radiusXl),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SALDO TOTAL DISPONÍVEL',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: Colors.white.withValues(alpha: 0.88),
                    letterSpacing: 0.6,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  formatBrl(saldo),
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                if (variacao.tipo != 'igual') ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.14),
                      borderRadius: BorderRadius.circular(
                        PulsoTokens.radiusFull,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(visual.icon, size: 14, color: varColor),
                        const SizedBox(width: 6),
                        Text(
                          dashboardVariacaoLabel(variacao.tipo, variacao.valor),
                          style: TextStyle(
                            color: varColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (recursos.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                PulsoTokens.space3,
                PulsoTokens.space3,
                PulsoTokens.space3,
                PulsoTokens.space3,
              ),
              child: SizedBox(
                height: 148,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: recursos.length,
                  separatorBuilder: (_, _) =>
                      const SizedBox(width: PulsoTokens.space3),
                  itemBuilder: (context, index) {
                    return DashboardResourceCard(recurso: recursos[index]);
                  },
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.all(PulsoTokens.space4),
              child: Text(
                'Nenhum recurso cadastrado ainda.',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _BudgetAlertCard extends StatelessWidget {
  const _BudgetAlertCard({required this.alerta});

  final DashboardAlerta alerta;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final over = alerta.estourou;
    final color = over
        ? PulsoColors.dangerOf(brightness)
        : PulsoColors.warningOf(brightness);
    final pct = alerta.percentualUsado.clamp(0, 100) / 100;

    return SizedBox(
      width: 200,
      height: 118,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => context.go('/budget'),
          borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
          child: Ink(
            padding: const EdgeInsets.all(PulsoTokens.space3),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
              border: Border.all(color: color.withValues(alpha: 0.35)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      over ? Icons.error_outline : Icons.warning_amber_rounded,
                      size: 18,
                      color: color,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        alerta.categoriaNome,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Text(
                  dashboardAlertaLabel(alerta.percentualUsado),
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    color: color,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: pct,
                    minHeight: 7,
                    backgroundColor: color.withValues(alpha: 0.15),
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FinancialHealthCard extends StatelessWidget {
  const _FinancialHealthCard({required this.saude});

  final DashboardSaude saude;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final color = switch (dashboardSaudeTom(saude.score)) {
      'excelente' || 'bom' => PulsoColors.successOf(brightness),
      'atencao' => PulsoColors.dangerOf(brightness),
      _ => PulsoColors.warningOf(brightness),
    };

    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PulsoSoftIcon(
                icon: Icons.favorite_outline,
                color: color,
                size: 40,
              ),
              const SizedBox(width: PulsoTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Saúde financeira',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      'Score ${saude.score}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              PulsoBadge.custom(
                label: saude.label,
                icon: Icons.monitor_heart_outlined,
                color: color,
                compact: true,
              ),
            ],
          ),
          if (saude.mensagem.isNotEmpty) ...[
            const SizedBox(height: PulsoTokens.space3),
            Text(saude.mensagem),
          ],
          if (saude.checklist.isNotEmpty) ...[
            const SizedBox(height: PulsoTokens.space3),
            for (final item in saude.checklist)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      item.ok
                          ? Icons.check_circle_outline
                          : Icons.cancel_outlined,
                      size: 16,
                      color: item.ok
                          ? PulsoColors.successOf(brightness)
                          : PulsoColors.dangerOf(brightness),
                    ),
                    const SizedBox(width: 8),
                    Expanded(child: Text(item.texto)),
                  ],
                ),
              ),
          ],
        ],
      ),
    );
  }
}

class _TransactionTile extends StatelessWidget {
  const _TransactionTile({required this.tx});

  final DashboardTransacao tx;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final receita = tx.tipo == 'RECEITA';
    final transferencia = tx.tipo == 'TRANSFERENCIA';
    final color = transferencia
        ? PulsoColors.infoOf(brightness)
        : receita
        ? PulsoColors.successOf(brightness)
        : PulsoColors.dangerOf(brightness);
    final title = (tx.descricao ?? '').trim().isEmpty
        ? (tx.categoriaNome ?? tx.tipo)
        : tx.descricao!;
    final amount = transferencia
        ? formatBrl(tx.valor.abs())
        : '${receita ? '+' : '−'}${formatBrl(tx.valor.abs())}';
    final dateLabel = tx.data == null
        ? null
        : '${tx.data!.day.toString().padLeft(2, '0')}/'
              '${tx.data!.month.toString().padLeft(2, '0')}/'
              '${tx.data!.year}';

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: PulsoTokens.space4,
        vertical: 2,
      ),
      leading: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.14),
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
        ),
        child: Icon(
          transferencia
              ? Icons.swap_horiz
              : receita
              ? Icons.south_west
              : Icons.north_east,
          size: 18,
          color: color,
        ),
      ),
      title: Text(
        title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: Theme.of(
          context,
        ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
      ),
      subtitle: Text(
        [
          if (dateLabel != null) dateLabel,
          if (tx.categoriaNome != null && tx.categoriaNome!.isNotEmpty)
            tx.categoriaNome!,
        ].join(' · '),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      trailing: Text(
        amount,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w700,
        ),
      ),
      onTap: () => context.go('/transactions'),
    );
  }
}

class _GoalCard extends StatelessWidget {
  const _GoalCard({required this.meta, required this.accent});

  final DashboardMeta meta;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final progresso = (meta.progresso.clamp(0, 100)) / 100;

    return SizedBox(
      width: 220,
      height: 148,
      child: Container(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
          border: Border.all(color: scheme.outline.withValues(alpha: 0.7)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.flag_outlined, size: 18, color: accent),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    meta.nome,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ),
                Text(
                  '${meta.progresso.round()}%',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: accent,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            const Spacer(),
            ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: LinearProgressIndicator(
                value: progresso,
                minHeight: 8,
                backgroundColor: accent.withValues(alpha: 0.14),
                color: accent,
              ),
            ),
            if (meta.valorAlvo > 0) ...[
              const SizedBox(height: 10),
              Text(
                '${formatBrl(meta.valorAtual)} de ${formatBrl(meta.valorAlvo)}',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: scheme.onSurfaceVariant,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
