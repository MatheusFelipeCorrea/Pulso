import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/calendar/data/reminder_visuals.dart';
import 'package:pulso/features/calendar/state/calendar_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<CalendarController>().bootstrap();
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<CalendarController>();
    final visao = controller.visao;
    final detalhe = controller.detalhe;
    final scheme = Theme.of(context).colorScheme;

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
          PulsoPageHeader(
            title: 'Calendário Financeiro',
            subtitle: 'Vencimentos, transações e lembretes no mesmo mês.',
            icon: Icons.calendar_month_outlined,
          ),
          PulsoSurface(
            margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
            padding: const EdgeInsets.symmetric(
              horizontal: PulsoTokens.space2,
              vertical: PulsoTokens.space1,
            ),
            child: Row(
              children: [
                IconButton(
                  tooltip: 'Mês anterior',
                  onPressed: () => controller.shiftMonth(-1),
                  icon: const Icon(Icons.chevron_left),
                ),
                Expanded(
                  child: Text(
                    TransactionPeriod.label(controller.mes),
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                IconButton(
                  tooltip: 'Próximo mês',
                  onPressed: () => controller.shiftMonth(1),
                  icon: const Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
          PulsoSurface(
            margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
            child: Row(
              children: [
                const _GoogleAgendaIcon(),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            'Google Agenda',
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: controller.google?.conectado == true
                                  ? PulsoColors.successOf(scheme.brightness)
                                  : scheme.outline,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            controller.google?.conectado == true
                                ? 'Conectado'
                                : 'Não conectado',
                          ),
                        ],
                      ),
                      Text(
                        controller.google?.conectado == true
                            ? (controller.google?.email ??
                                  'Sincronização ativa')
                            : 'Conecte pelo web em Calendário para sincronizar lembretes.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (controller.loading && visao == null)
            const Padding(
              padding: EdgeInsets.all(32),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Não foi possível carregar',
              description: controller.error!,
              icon: Icons.error_outline,
            )
          else if (visao != null) ...[
            _Kpis(resumo: visao.resumo),
            const SizedBox(height: PulsoTokens.space4),
            _MonthGrid(
              mes: controller.mes,
              dias: visao.dias,
              selected: controller.selectedDate,
              onSelect: controller.selectDay,
            ),
            const SizedBox(height: PulsoTokens.space4),
            if (detalhe != null)
              _DayPanel(
                detalhe: detalhe,
                onLembrete: (item) => _openLembrete(item),
                onPagar: _pagar,
                onExcluir: _excluir,
              ),
            const SizedBox(height: PulsoTokens.space4),
            PulsoSectionHeader(
              title: 'Próximos vencimentos',
              icon: Icons.notifications_active_outlined,
            ),
            if (visao.proximosVencimentos.isEmpty)
              PulsoEmptyState(
                title: 'Nenhum vencimento',
                description: 'Os lembretes deste mês aparecem aqui.',
                icon: Icons.event_available_outlined,
              )
            else
              ...visao.proximosVencimentos.map(
                (item) => PulsoSurface(
                  margin: const EdgeInsets.only(bottom: PulsoTokens.space2),
                  padding: const EdgeInsets.symmetric(
                    horizontal: PulsoTokens.space3,
                    vertical: PulsoTokens.space1,
                  ),
                  child: _LembreteTile(
                    lembrete: item,
                    onTap: () => _openLembrete(item),
                    onPagar: () => _pagar(item),
                    onExcluir: () => _excluir(item),
                  ),
                ),
              ),
          ],
        ],
      ),
    );
  }

  Future<void> _openLembrete([PulsoLembrete? lembrete]) async {
    await context.push('/calendar/reminder', extra: lembrete);
    if (!mounted) return;
    await context.read<CalendarController>().reload();
  }

  Future<void> _pagar(PulsoLembrete lembrete) async {
    try {
      await context.read<CalendarController>().pagar(lembrete);
      if (!mounted) return;
      showPulsoSnack(
        context,
        lembrete.temValor ? 'Marcado como pago' : 'Marcado como feito',
      );
    } catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, '$error');
    }
  }

  Future<void> _excluir(PulsoLembrete lembrete) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir lembrete',
      message: 'Excluir “${lembrete.titulo}”?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<CalendarController>().excluir(lembrete);
      if (!mounted) return;
      showPulsoSnack(context, 'Lembrete excluído');
    } catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, '$error');
    }
  }
}

class _GoogleAgendaIcon extends StatelessWidget {
  const _GoogleAgendaIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFDADCE0)),
      ),
      child: Column(
        children: [
          Container(
            height: 12,
            decoration: const BoxDecoration(
              color: Color(0xFF1A73E8),
              borderRadius: BorderRadius.vertical(top: Radius.circular(7)),
            ),
          ),
          const Expanded(
            child: Center(
              child: Text(
                '31',
                style: TextStyle(
                  color: Color(0xFF1A73E8),
                  fontWeight: FontWeight.w800,
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Kpis extends StatelessWidget {
  const _Kpis({required this.resumo});
  final CalendarMonthResumo resumo;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Resumo do mês',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              PulsoSoftIcon(
                icon: Icons.smart_toy_outlined,
                color: PulsoColors.accent(brightness),
                size: 36,
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Insights com IA em breve. Por enquanto, acompanhe os números abaixo.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: PulsoTokens.space3),
          PulsoHScroll(
            height: 118,
            itemWidth: 148,
            children: [
              _KpiCard(
                label: 'Receitas',
                value: formatBrl(resumo.receitasTotal),
                icon: Icons.arrow_upward,
                color: PulsoColors.successOf(brightness),
              ),
              _KpiCard(
                label: 'Despesas',
                value: formatBrl(resumo.despesasTotal),
                icon: Icons.arrow_downward,
                color: PulsoColors.dangerOf(brightness),
              ),
              _KpiCard(
                label: 'Saldo',
                value: formatBrl(resumo.saldo),
                icon: Icons.swap_horiz,
                color: PulsoColors.accent(brightness),
              ),
              _KpiCard(
                label: 'Transações',
                value: '${resumo.totalTransacoes}',
                icon: Icons.list_alt_outlined,
                color: PulsoColors.infoOf(brightness),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _KpiCard extends StatelessWidget {
  const _KpiCard({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PulsoSoftIcon(icon: icon, color: color, size: 28),
        const SizedBox(height: 8),
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 4),
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: Theme.of(context).textTheme.titleSmall
              ?.copyWith(color: color, fontWeight: FontWeight.w700),
        ),
      ],
    );
  }
}

class _MonthGrid extends StatelessWidget {
  const _MonthGrid({
    required this.mes,
    required this.dias,
    required this.selected,
    required this.onSelect,
  });

  final String mes;
  final Map<String, CalendarDayMarker> dias;
  final String? selected;
  final Future<void> Function(String date) onSelect;

  @override
  Widget build(BuildContext context) {
    final parts = mes.split('-');
    final year = int.parse(parts[0]);
    final month = int.parse(parts[1]);
    final first = DateTime(year, month, 1);
    final daysInMonth = DateTime(year, month + 1, 0).day;
    final startWeekday = first.weekday % 7;
    final cells = <Widget>[];
    const labels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    for (final label in labels) {
      cells.add(
        Center(
          child: Text(label, style: Theme.of(context).textTheme.labelSmall),
        ),
      );
    }
    for (var i = 0; i < startWeekday; i++) {
      cells.add(const SizedBox.shrink());
    }
    for (var day = 1; day <= daysInMonth; day++) {
      final key = '$mes-${day.toString().padLeft(2, '0')}';
      final marker = dias[key];
      final isSelected = selected == key;
      cells.add(
        InkWell(
          onTap: () => onSelect(key),
          borderRadius: BorderRadius.circular(10),
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? PulsoColors.primary.withValues(alpha: 0.12)
                  : null,
              borderRadius: BorderRadius.circular(10),
            ),
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(
              children: [
                Text(
                  '$day',
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (marker?.temReceita == true) _dot(PulsoColors.success),
                    if (marker?.temDespesa == true) _dot(PulsoColors.danger),
                    if (marker?.temLembrete == true) _dot(PulsoColors.primary),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
    }
    return PulsoSurface(
      child: GridView.count(
        crossAxisCount: 7,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        children: cells,
      ),
    );
  }

  Widget _dot(Color color) => Container(
    width: 5,
    height: 5,
    margin: const EdgeInsets.symmetric(horizontal: 1),
    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
  );
}

class _DayPanel extends StatelessWidget {
  const _DayPanel({
    required this.detalhe,
    required this.onLembrete,
    required this.onPagar,
    required this.onExcluir,
  });

  final CalendarDayDetail detalhe;
  final Future<void> Function(PulsoLembrete lembrete) onLembrete;
  final Future<void> Function(PulsoLembrete lembrete) onPagar;
  final Future<void> Function(PulsoLembrete lembrete) onExcluir;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            formatDayTitle(detalhe.data),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: PulsoTokens.space3),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(PulsoTokens.space3),
            decoration: BoxDecoration(
              color: scheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _DayStat(
                    label: 'Receitas',
                    value: formatBrl(detalhe.receitas),
                    color: PulsoColors.successOf(brightness),
                  ),
                ),
                Expanded(
                  child: _DayStat(
                    label: 'Despesas',
                    value: formatBrl(detalhe.despesas),
                    color: PulsoColors.dangerOf(brightness),
                  ),
                ),
                Expanded(
                  child: _DayStat(
                    label: 'Saldo',
                    value: formatBrl(detalhe.saldo),
                    color: detalhe.saldo < 0
                        ? PulsoColors.dangerOf(brightness)
                        : scheme.onSurface,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          const PulsoSectionHeader(
            title: 'Transações do dia',
            icon: Icons.receipt_long_outlined,
          ),
          if (detalhe.transacoes.isEmpty)
            _EmptyHint(
              icon: Icons.inbox_outlined,
              text: 'Nenhuma transação neste dia.',
            )
          else
            ...detalhe.transacoes.map((tx) {
              final receita = tx.tipo == 'RECEITA';
              final color =
                  parseHexColor(tx.categoria?.cor) ??
                  (receita
                      ? PulsoColors.successOf(brightness)
                      : PulsoColors.dangerOf(brightness));
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  children: [
                    CategoryGlyph(
                      icone: tx.categoria?.icone,
                      color: color,
                      size: 32,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        tx.descricao?.trim().isNotEmpty == true
                            ? tx.descricao!.trim()
                            : (tx.categoria?.nome ?? 'Transação'),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      '${receita ? '+' : '-'}${formatBrl(tx.valor)}',
                      style: TextStyle(
                        color: receita
                            ? PulsoColors.successOf(brightness)
                            : PulsoColors.dangerOf(brightness),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              );
            }),
          const SizedBox(height: PulsoTokens.space3),
          const PulsoSectionHeader(
            title: 'Lembretes e vencimentos',
            icon: Icons.notifications_active_outlined,
          ),
          if (detalhe.lembretes.isEmpty)
            const _EmptyHint(
              icon: Icons.notifications_none_outlined,
              text: 'Nenhum lembrete neste dia.',
            )
          else
            ...detalhe.lembretes.map(
              (item) => _LembreteTile(
                lembrete: item,
                onTap: () => onLembrete(item),
                onPagar: () => onPagar(item),
                onExcluir: () => onExcluir(item),
              ),
            ),
        ],
      ),
    );
  }
}

class _DayStat extends StatelessWidget {
  const _DayStat({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: theme.textTheme.labelSmall?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: theme.textTheme.titleSmall?.copyWith(
            color: color,
            fontWeight: PulsoTokens.weightBold,
          ),
        ),
      ],
    );
  }
}

class _EmptyHint extends StatelessWidget {
  const _EmptyHint({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(
            icon,
            size: 18,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LembreteTile extends StatelessWidget {
  const _LembreteTile({
    required this.lembrete,
    required this.onTap,
    required this.onPagar,
    required this.onExcluir,
  });

  final PulsoLembrete lembrete;
  final VoidCallback onTap;
  final VoidCallback onPagar;
  final VoidCallback onExcluir;

  @override
  Widget build(BuildContext context) {
    final meta = reminderMeta(lembrete.categoria);
    return ListTile(
      contentPadding: EdgeInsets.zero,
      onTap: onTap,
      leading: CategoryGlyph(icone: meta.lucide, color: meta.color, size: 40),
      title: Text(lembrete.titulo),
      subtitle: Text(
        '${lembrete.categoriaLabel ?? meta.label} · ${lembrete.horaLembrete}${lembrete.temValor ? ' · ${formatBrl(lembrete.valor!)}' : ''}',
      ),
      trailing: Wrap(
        children: [
          if (lembrete.sincronizado) const Icon(Icons.cloud_outlined, size: 18),
          if (!lembrete.pago)
            IconButton(
              tooltip: lembrete.temValor ? 'Pago' : 'Feito',
              onPressed: onPagar,
              icon: const Icon(Icons.check_circle_outline),
            ),
          IconButton(
            tooltip: 'Excluir',
            onPressed: onExcluir,
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
    );
  }
}
