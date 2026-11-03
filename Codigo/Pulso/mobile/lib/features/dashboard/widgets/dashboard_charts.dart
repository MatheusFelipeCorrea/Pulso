import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

({String label, IconData icon, Color color}) dashboardResourceVisual(
  String tipo,
  Brightness brightness,
) {
  return switch (tipo) {
    'VA' => (
      label: 'Vale-Alimentação',
      icon: Icons.apple,
      color: PulsoColors.successOf(brightness),
    ),
    'VR' => (
      label: 'Vale-Refeição',
      icon: Icons.restaurant,
      color: PulsoColors.orangeOf(brightness),
    ),
    'VT' => (
      label: 'Vale-Transporte',
      icon: Icons.directions_bus_outlined,
      color: PulsoColors.infoOf(brightness),
    ),
    'POUPANCA' => (
      label: 'Poupança',
      icon: Icons.savings_outlined,
      color: PulsoColors.cyanOf(brightness),
    ),
    _ => (
      label: 'Dinheiro',
      icon: Icons.payments_outlined,
      color: PulsoColors.accent(brightness),
    ),
  };
}

class DashboardResourceCard extends StatelessWidget {
  const DashboardResourceCard({super.key, required this.recurso});

  final DashboardRecurso recurso;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    final visual = dashboardResourceVisual(recurso.tipo, brightness);
    final subtitle = recurso.tipo == 'VR' && recurso.sugestaoDiaria != null
        ? '${formatBrl(recurso.sugestaoDiaria!)}/dia'
        : 'Disponível';

    return SizedBox(
      width: 148,
      height: 148,
      child: Container(
        padding: const EdgeInsets.all(PulsoTokens.space3),
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
          border: Border.all(color: scheme.outline.withValues(alpha: 0.7)),
          boxShadow: PulsoTokens.shadowSm(brightness == Brightness.dark),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: visual.color.withValues(alpha: 0.14),
                borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
              ),
              child: Icon(visual.icon, size: 18, color: visual.color),
            ),
            const Spacer(),
            Text(
              visual.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              formatBrl(recurso.saldo),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: BoxDecoration(
                    color: visual.color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.labelSmall
                        ?.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class DashboardIncomeExpenseBars extends StatelessWidget {
  const DashboardIncomeExpenseBars({
    super.key,
    required this.receitas,
    required this.despesas,
  });

  final double receitas;
  final double despesas;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    final maxValue = math.max(receitas, despesas);
    final incomeRatio = maxValue <= 0
        ? 0.0
        : (receitas / maxValue).clamp(0.0, 1.0);
    final expenseRatio = maxValue <= 0
        ? 0.0
        : (despesas / maxValue).clamp(0.0, 1.0);

    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Receitas x Despesas',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 4),
          Text(
            'Comparativo do mês selecionado',
            style: Theme.of(context).textTheme.bodySmall
                ?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: PulsoTokens.space4),
          SizedBox(
            height: 140,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: _Bar(
                    label: 'Receitas',
                    valueLabel: formatBrl(receitas),
                    ratio: incomeRatio,
                    color: PulsoColors.successOf(brightness),
                  ),
                ),
                const SizedBox(width: PulsoTokens.space4),
                Expanded(
                  child: _Bar(
                    label: 'Despesas',
                    valueLabel: formatBrl(despesas),
                    ratio: expenseRatio,
                    color: PulsoColors.dangerOf(brightness),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Bar extends StatelessWidget {
  const _Bar({
    required this.label,
    required this.valueLabel,
    required this.ratio,
    required this.color,
  });

  final String label;
  final String valueLabel;
  final double ratio;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: Align(
            alignment: Alignment.bottomCenter,
            child: FractionallySizedBox(
              heightFactor: math.max(ratio, 0.06),
              widthFactor: 0.48,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [color, color.withValues(alpha: 0.72)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          label,
          style: Theme.of(context).textTheme.labelMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 2),
        Text(
          valueLabel,
          style: Theme.of(context).textTheme.labelSmall
              ?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant),
        ),
      ],
    );
  }
}

class DashboardCategoryDonut extends StatelessWidget {
  const DashboardCategoryDonut({super.key, required this.categorias});

  final List<DashboardCategoriaGasto> categorias;

  Color _parseColor(String? raw, Brightness brightness, int index) {
    final fallback = [
      PulsoColors.accent(brightness),
      PulsoColors.infoOf(brightness),
      PulsoColors.orangeOf(brightness),
      PulsoColors.successOf(brightness),
      PulsoColors.warningOf(brightness),
      PulsoColors.cyanOf(brightness),
    ];
    final hex = (raw ?? '').replaceAll('#', '');
    if (hex.length == 6) {
      final value = int.tryParse(hex, radix: 16);
      if (value != null) return Color(0xFF000000 | value);
    }
    return fallback[index % fallback.length];
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    final slices = categorias.take(6).toList();

    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Gastos por categoria',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 4),
          Text(
            'Distribuição das despesas do mês',
            style: Theme.of(context).textTheme.bodySmall
                ?.copyWith(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: PulsoTokens.space4),
          if (slices.isEmpty)
            Text(
              'Sem despesas categorizadas neste mês.',
              style: Theme.of(context).textTheme.bodySmall
                  ?.copyWith(color: scheme.onSurfaceVariant),
            )
          else
            Row(
              children: [
                SizedBox(
                  width: 118,
                  height: 118,
                  child: CustomPaint(
                    painter: _DonutPainter(
                      slices: [
                        for (var i = 0; i < slices.length; i++)
                          _Slice(
                            value: slices[i].total <= 0 ? 0 : slices[i].total,
                            color: _parseColor(slices[i].cor, brightness, i),
                          ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        formatBrl(
                          slices.fold<double>(
                            0,
                            (sum, item) => sum + item.total,
                          ),
                        ),
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.labelSmall
                            ?.copyWith(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: PulsoTokens.space4),
                Expanded(
                  child: Column(
                    children: [
                      for (var i = 0; i < slices.length; i++)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            children: [
                              Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(
                                  color: _parseColor(
                                    slices[i].cor,
                                    brightness,
                                    i,
                                  ),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  slices[i].nome,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ),
                              Text(
                                '${slices[i].percentual.round()}%',
                                style: Theme.of(context).textTheme.labelMedium
                                    ?.copyWith(fontWeight: FontWeight.w700),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

class _Slice {
  const _Slice({required this.value, required this.color});
  final double value;
  final Color color;
}

class _DonutPainter extends CustomPainter {
  _DonutPainter({required this.slices});

  final List<_Slice> slices;

  @override
  void paint(Canvas canvas, Size size) {
    final total = slices.fold<double>(0, (sum, item) => sum + item.value);
    if (total <= 0) return;
    final rect = Offset.zero & size;
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.2
      ..strokeCap = StrokeCap.butt;
    var start = -math.pi / 2;
    for (final slice in slices) {
      final sweep = (slice.value / total) * math.pi * 2;
      paint.color = slice.color;
      canvas.drawArc(
        rect.deflate(paint.strokeWidth / 2),
        start,
        sweep,
        false,
        paint,
      );
      start += sweep;
    }
  }

  @override
  bool shouldRepaint(covariant _DonutPainter oldDelegate) =>
      oldDelegate.slices != slices;
}
