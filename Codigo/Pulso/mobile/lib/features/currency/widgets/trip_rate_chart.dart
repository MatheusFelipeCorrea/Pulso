import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
import 'package:pulso/features/currency/data/currency_models.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TripRateChart extends StatefulWidget {
  const TripRateChart({super.key, required this.repository, this.codigo = 'USD'});

  final CurrencyRepository repository;
  final String codigo;

  @override
  State<TripRateChart> createState() => _TripRateChartState();
}

class _TripRateChartState extends State<TripRateChart> {
  CurrencyHistory? history;
  bool loading = true;
  String? error;
  int dias = 30;
  int? hoverIndex;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(covariant TripRateChart oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.codigo != widget.codigo) _load();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
      hoverIndex = null;
    });
    try {
      history = await widget.repository.obterHistorico(codigo: widget.codigo, dias: dias);
    } catch (err) {
      error = 'Histórico indisponível para ${widget.codigo}.';
      history = null;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  void _pick(Offset local, Size size, int count) {
    if (count < 2 || size.width <= 0) return;
    final t = (local.dx / size.width).clamp(0.0, 1.0);
    final index = (t * (count - 1)).round();
    if (index != hoverIndex) setState(() => hoverIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final history = this.history;
    final pontos = history?.pontos ?? const [];
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CurrencyFlag(code: widget.codigo, size: 22),
              const SizedBox(width: 8),
              Expanded(child: Text('Histórico de cotação', style: Theme.of(context).textTheme.titleSmall)),
            ],
          ),
          const SizedBox(height: PulsoTokens.space3),
          SegmentedButton<int>(
            segments: const [
              ButtonSegment(value: 7, label: Text('7d')),
              ButtonSegment(value: 30, label: Text('30d')),
              ButtonSegment(value: 90, label: Text('90d')),
            ],
            selected: {dias},
            onSelectionChanged: (next) {
              setState(() => dias = next.first);
              _load();
            },
          ),
          const SizedBox(height: PulsoTokens.space3),
          if (loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            )
          else if (error != null || history == null || pontos.length < 2)
            Text(error ?? 'Sem pontos suficientes para o gráfico.', style: Theme.of(context).textTheme.bodySmall)
          else ...[
            SizedBox(
              height: 180,
              width: double.infinity,
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final size = Size(constraints.maxWidth, constraints.maxHeight);
                  final selected = hoverIndex != null && hoverIndex! >= 0 && hoverIndex! < pontos.length
                      ? pontos[hoverIndex!]
                      : null;
                  return MouseRegion(
                    onHover: (event) => _pick(event.localPosition, size, pontos.length),
                    onExit: (_) => setState(() => hoverIndex = null),
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTapDown: (details) => _pick(details.localPosition, size, pontos.length),
                      onPanUpdate: (details) => _pick(details.localPosition, size, pontos.length),
                      child: Stack(
                        children: [
                          CustomPaint(
                            size: size,
                            painter: _SparkPainter(
                              values: pontos.map((p) => p.bid).toList(),
                              color: PulsoColors.accent(Theme.of(context).brightness),
                              selectedIndex: hoverIndex,
                            ),
                          ),
                          if (selected != null)
                            _ChartTooltip(
                              date: selected.date,
                              value: selected.bid,
                              index: hoverIndex!,
                              count: pontos.length,
                              width: size.width,
                            ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            PulsoHScroll(
              height: 72,
              itemWidth: 140,
              children: [
                _Stat(label: 'Atual', value: formatBrl(history.atual)),
                _Stat(label: 'Mín. (${dias}d)', value: formatBrl(history.minima)),
                _Stat(label: 'Máx. (${dias}d)', value: formatBrl(history.maxima)),
                _Stat(
                  label: 'Variação (${dias}d)',
                  value: '${history.variacao >= 0 ? '+' : ''}${history.variacao.toStringAsFixed(2)}%',
                  color: history.variacao >= 0
                      ? PulsoColors.successOf(Theme.of(context).brightness)
                      : PulsoColors.dangerOf(Theme.of(context).brightness),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _ChartTooltip extends StatelessWidget {
  const _ChartTooltip({
    required this.date,
    required this.value,
    required this.index,
    required this.count,
    required this.width,
  });

  final DateTime date;
  final double value;
  final int index;
  final int count;
  final double width;

  @override
  Widget build(BuildContext context) {
    final x = width * (index / (count - 1));
    final left = (x - 64).clamp(0.0, (width - 128).clamp(0.0, width));
    final dd = date.day.toString().padLeft(2, '0');
    final mm = date.month.toString().padLeft(2, '0');
    return Positioned(
      top: 8,
      left: left,
      child: Material(
        color: Theme.of(context).colorScheme.surface,
        elevation: 3,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$dd/$mm', style: Theme.of(context).textTheme.labelSmall),
              Text(formatBrl(value), style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value, this.color});

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 4),
        Text(
          value,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: color,
              ),
        ),
      ],
    );
  }
}

class _SparkPainter extends CustomPainter {
  _SparkPainter({required this.values, required this.color, this.selectedIndex});

  final List<double> values;
  final Color color;
  final int? selectedIndex;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final min = values.reduce((a, b) => a < b ? a : b);
    final max = values.reduce((a, b) => a > b ? a : b);
    final span = (max - min).abs() < 0.0001 ? 1.0 : max - min;
    Offset pointAt(int i) {
      final x = size.width * (i / (values.length - 1));
      final y = size.height - ((values[i] - min) / span) * (size.height - 8) - 4;
      return Offset(x, y);
    }

    final path = Path()..moveTo(pointAt(0).dx, pointAt(0).dy);
    for (var i = 1; i < values.length; i++) {
      path.lineTo(pointAt(i).dx, pointAt(i).dy);
    }
    final fill = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(fill, Paint()..color = color.withValues(alpha: 0.12));
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeJoin = StrokeJoin.round,
    );

    final last = pointAt(values.length - 1);
    canvas.drawCircle(last, 3, Paint()..color = color);

    if (selectedIndex != null && selectedIndex! >= 0 && selectedIndex! < values.length) {
      final selected = pointAt(selectedIndex!);
      final dash = Paint()
        ..color = color.withValues(alpha: 0.7)
        ..strokeWidth = 1
        ..style = PaintingStyle.stroke;
      const dashLen = 4.0;
      var y = 0.0;
      while (y < size.height) {
        canvas.drawLine(Offset(selected.dx, y), Offset(selected.dx, (y + dashLen).clamp(0, size.height)), dash);
        y += dashLen * 2;
      }
      canvas.drawCircle(selected, 6, Paint()..color = Colors.white);
      canvas.drawCircle(selected, 4, Paint()..color = color);
    }
  }

  @override
  bool shouldRepaint(covariant _SparkPainter oldDelegate) =>
      oldDelegate.values != values || oldDelegate.color != color || oldDelegate.selectedIndex != selectedIndex;
}
