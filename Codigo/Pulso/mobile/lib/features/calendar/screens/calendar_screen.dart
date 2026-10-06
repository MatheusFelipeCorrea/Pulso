import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
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
        padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 96),
        children: [
          PulsoPageHeader(
            title: 'Calendário financeiro',
            subtitle: 'Vencimentos, transações e lembretes no mesmo mês.',
            icon: Icons.calendar_month_outlined,
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(onPressed: () => controller.shiftMonth(-1), icon: const Icon(Icons.chevron_left)),
                Text(TransactionPeriod.label(controller.mes), style: Theme.of(context).textTheme.titleSmall),
                IconButton(onPressed: () => controller.shiftMonth(1), icon: const Icon(Icons.chevron_right)),
              ],
            ),
          ),
          if (controller.google?.conectado == true)
            PulsoSurface(
              margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
              child: Text('Google Agenda conectada${controller.google?.email != null ? ' · ${controller.google!.email}' : ''}'),
            )
          else
            PulsoSurface(
              margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
              child: Text(
                'Para sincronizar com o Google Agenda, conecte pelo web em Calendário (OAuth).',
                style: TextStyle(color: scheme.onSurfaceVariant),
              ),
            ),
          if (controller.loading && visao == null)
            const Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator()))
          else if (controller.error != null)
            PulsoEmptyState(title: 'Não foi possível carregar', description: controller.error!, icon: Icons.error_outline)
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
            PulsoSectionHeader(title: 'Próximos vencimentos', icon: Icons.notifications_active_outlined),
            if (visao.proximosVencimentos.isEmpty)
              PulsoEmptyState(
                title: 'Nenhum vencimento',
                description: 'Os lembretes deste mês aparecem aqui.',
                icon: Icons.event_available_outlined,
              )
            else
              ...visao.proximosVencimentos.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
                  child: _LembreteTile(lembrete: item, onTap: () => _openLembrete(item), onPagar: () => _pagar(item), onExcluir: () => _excluir(item)),
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
      showPulsoSnack(context, lembrete.temValor ? 'Marcado como pago' : 'Marcado como feito');
    } catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, '$error');
    }
  }

  Future<void> _excluir(PulsoLembrete lembrete) async {
    final ok = await showPulsoConfirm(context: context, title: 'Excluir lembrete', message: 'Excluir “${lembrete.titulo}”?');
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

class _Kpis extends StatelessWidget {
  const _Kpis({required this.resumo});
  final CalendarMonthResumo resumo;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _KpiCard(label: 'Receitas', value: formatBrl(resumo.receitasTotal), color: PulsoColors.successOf(Theme.of(context).brightness))),
        const SizedBox(width: PulsoTokens.space2),
        Expanded(child: _KpiCard(label: 'Despesas', value: formatBrl(resumo.despesasTotal), color: PulsoColors.dangerOf(Theme.of(context).brightness))),
        const SizedBox(width: PulsoTokens.space2),
        Expanded(child: _KpiCard(label: 'Saldo', value: formatBrl(resumo.saldo), color: PulsoColors.accent(Theme.of(context).brightness))),
      ],
    );
  }
}

class _KpiCard extends StatelessWidget {
  const _KpiCard({required this.label, required this.value, required this.color});
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          const SizedBox(height: 6),
          Text(value, style: Theme.of(context).textTheme.titleSmall?.copyWith(color: color, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class _MonthGrid extends StatelessWidget {
  const _MonthGrid({required this.mes, required this.dias, required this.selected, required this.onSelect});

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
      cells.add(Center(child: Text(label, style: Theme.of(context).textTheme.labelSmall)));
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
              color: isSelected ? PulsoColors.primary.withValues(alpha: 0.12) : null,
              borderRadius: BorderRadius.circular(10),
            ),
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(
              children: [
                Text('$day', style: TextStyle(fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500)),
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
  const _DayPanel({required this.detalhe, required this.onLembrete, required this.onPagar, required this.onExcluir});

  final CalendarDayDetail detalhe;
  final Future<void> Function(PulsoLembrete lembrete) onLembrete;
  final Future<void> Function(PulsoLembrete lembrete) onPagar;
  final Future<void> Function(PulsoLembrete lembrete) onExcluir;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Dia ${detalhe.data.split('-').reversed.take(2).toList().reversed.join('/')}', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: PulsoTokens.space2),
          Text('Receitas ${formatBrl(detalhe.receitas)} · Despesas ${formatBrl(detalhe.despesas)} · ${detalhe.transacoesCount} transações'),
          const SizedBox(height: PulsoTokens.space3),
          if (detalhe.lembretes.isEmpty)
            const Text('Nenhum lembrete neste dia.')
          else
            ...detalhe.lembretes.map(
              (item) => _LembreteTile(lembrete: item, onTap: () => onLembrete(item), onPagar: () => onPagar(item), onExcluir: () => onExcluir(item)),
            ),
        ],
      ),
    );
  }
}

class _LembreteTile extends StatelessWidget {
  const _LembreteTile({required this.lembrete, required this.onTap, required this.onPagar, required this.onExcluir});

  final PulsoLembrete lembrete;
  final VoidCallback onTap;
  final VoidCallback onPagar;
  final VoidCallback onExcluir;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      onTap: onTap,
      title: Text(lembrete.titulo),
      subtitle: Text(
        '${lembrete.categoriaLabel ?? lembrete.categoria} · ${lembrete.horaLembrete}${lembrete.temValor ? ' · ${formatBrl(lembrete.valor!)}' : ''}',
      ),
      trailing: Wrap(
        children: [
          if (!lembrete.pago)
            IconButton(tooltip: lembrete.temValor ? 'Pago' : 'Feito', onPressed: onPagar, icon: const Icon(Icons.check_circle_outline)),
          IconButton(tooltip: 'Excluir', onPressed: onExcluir, icon: const Icon(Icons.delete_outline)),
        ],
      ),
    );
  }
}
