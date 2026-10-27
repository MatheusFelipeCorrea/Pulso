import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

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
          const SizedBox(height: PulsoTokens.space4),
          SizedBox(
            height: 120,
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
              heightFactor: math.max(ratio, 0.04),
              widthFactor: 0.55,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: Theme.of(context).textTheme.labelMedium),
        Text(valueLabel, style: Theme.of(context).textTheme.labelSmall),
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
    final slices = categorias.take(6).toList();
    if (slices.isEmpty) {
      return Text(
        'Sem despesas categorizadas neste mês.',
        style: Theme.of(context).textTheme.bodySmall,
      );
    }
    final total = slices.fold<double>(0, (sum, item) => sum + item.total);

    return PulsoSurface(
      child: Row(
        children: [
          SizedBox(
            width: 112,
            height: 112,
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
                  formatBrl(total),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.labelSmall,
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
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: _parseColor(slices[i].cor, brightness, i),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(child: Text(slices[i].nome)),
                        Text('${slices[i].percentual.round()}%'),
                      ],
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
      ..strokeWidth = size.width * 0.22
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
