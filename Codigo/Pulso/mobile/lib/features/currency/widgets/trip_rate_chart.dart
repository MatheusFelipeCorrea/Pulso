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
    });
    try {
      history = await widget.repository.obterHistorico(codigo: widget.codigo, dias: 30);
    } catch (err) {
      error = 'Histórico indisponível para ${widget.codigo}.';
      history = null;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final history = this.history;
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CurrencyFlag(code: widget.codigo, size: 22),
              const SizedBox(width: 8),
              Text('Histórico ${widget.codigo}', style: Theme.of(context).textTheme.titleSmall),
            ],
          ),
          const SizedBox(height: PulsoTokens.space3),
          if (loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: PulsoTokens.space8),
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            )
          else if (error != null || history == null || history.pontos.length < 2)
            Text(error ?? 'Sem pontos suficientes para o gráfico.', style: Theme.of(context).textTheme.bodySmall)
          else ...[
            SizedBox(
              height: 120,
              width: double.infinity,
              child: CustomPaint(
                painter: _SparkPainter(
                  values: history.pontos.map((p) => p.bid).toList(),
                  color: PulsoColors.accent(Theme.of(context).brightness),
                ),
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            Row(
              children: [
                _Stat(label: 'Atual', value: formatBrl(history.atual)),
                _Stat(label: 'Mín.', value: formatBrl(history.minima)),
                _Stat(label: 'Máx.', value: formatBrl(history.maxima)),
                _Stat(
                  label: 'Variação',
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

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value, this.color});

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
          ),
        ],
      ),
    );
  }
}

class _SparkPainter extends CustomPainter {
  _SparkPainter({required this.values, required this.color});

  final List<double> values;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final min = values.reduce((a, b) => a < b ? a : b);
    final max = values.reduce((a, b) => a > b ? a : b);
    final span = (max - min).abs() < 0.0001 ? 1.0 : max - min;
    final path = Path();
    for (var i = 0; i < values.length; i++) {
      final x = size.width * (i / (values.length - 1));
      final y = size.height - ((values[i] - min) / span) * size.height;
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    final fill = Path.from(path)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(
      fill,
      Paint()..color = color.withValues(alpha: 0.12),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(covariant _SparkPainter oldDelegate) =>
      oldDelegate.values != values || oldDelegate.color != color;
}
