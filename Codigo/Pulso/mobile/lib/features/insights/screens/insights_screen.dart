import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/insights/data/insight_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class InsightsScreen extends StatefulWidget {
  const InsightsScreen({super.key});

  @override
  State<InsightsScreen> createState() => _InsightsScreenState();
}

class _InsightsScreenState extends State<InsightsScreen> {
  late String _mes;
  InsightPayload? _data;
  bool _loading = true;
  bool _regenerating = false;

  @override
  void initState() {
    super.initState();
    _mes = _mesAtual();
    WidgetsBinding.instance.addPostFrameCallback((_) => _carregar());
  }

  String _mesAtual() {
    final now = DateTime.now();
    return '${now.year}-${now.month.toString().padLeft(2, '0')}';
  }

  String _labelMes(String mes) {
    if (!RegExp(r'^\d{4}-\d{2}$').hasMatch(mes)) return mes;
    const nomes = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    final parts = mes.split('-');
    final m = int.tryParse(parts[1]) ?? 1;
    return '${nomes[m - 1]}/${parts[0]}';
  }

  Future<void> _carregar() async {
    setState(() => _loading = true);
    try {
      final repo = context.read<InsightRepository>();
      final data = await repo.obterInsights(mes: _mes);
      if (!mounted) return;
      setState(() {
        _data = data;
        _loading = false;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _data = null;
        _loading = false;
      });
      showPulsoSnack(context, error.message);
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _data = null;
        _loading = false;
      });
      showPulsoSnack(context, 'Não foi possível carregar os Insights agora.');
    }
  }

  Future<void> _regenerar() async {
    setState(() => _regenerating = true);
    try {
      final repo = context.read<InsightRepository>();
      final data = await repo.regenerarInsights(mes: _mes);
      if (!mounted) return;
      setState(() {
        _data = data;
        _regenerating = false;
      });
      showPulsoSnack(context, 'Insights regenerados!');
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _regenerating = false);
      showPulsoSnack(context, error.message);
    } catch (_) {
      if (!mounted) return;
      setState(() => _regenerating = false);
      showPulsoSnack(context, 'Falha ao regenerar Insights');
    }
  }

  Future<void> _pickMes() async {
    final now = DateTime.now();
    final initial = DateTime(
      int.tryParse(_mes.split('-').first) ?? now.year,
      int.tryParse(_mes.split('-').last) ?? now.month,
    );
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(now.year - 3),
      lastDate: now,
      helpText: 'Escolha o mês',
      fieldLabelText: 'Mês',
    );
    if (picked == null) return;
    final next = '${picked.year}-${picked.month.toString().padLeft(2, '0')}';
    if (next == _mes) return;
    setState(() => _mes = next);
    await _carregar();
  }

  Future<void> _aplicarSugestao(InsightSugestao s) async {
    final path = s.acaoPath;
    if (path == null || path.isEmpty) {
      showPulsoSnack(context, 'Sugestão registrada — ajuste no orçamento.');
      return;
    }
    final known = {
      '/budget',
      '/goals',
      '/transactions',
      '/dashboard',
      '/trips',
      '/chatbot',
      '/purchase-planning',
      '/expense-split',
      '/debts',
      '/calendar',
    };
    if (known.contains(path)) {
      context.go(path);
    } else {
      showPulsoSnack(context, 'Abra ${s.titulo} pelo menu principal.');
    }
  }

  Future<void> _openUrl(String url) async {
    await Clipboard.setData(ClipboardData(text: url));
    if (!mounted) return;
    showPulsoSnack(context, 'Link copiado. Cole no navegador para abrir.');
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final brightness = Theme.of(context).brightness;
    final accent = PulsoColors.accent(brightness);
    final data = _data;

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _carregar,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(
            PulsoTokens.space4,
            PulsoTokens.space3,
            PulsoTokens.space4,
            PulsoTokens.space8,
          ),
          children: [
            _Header(
              accent: accent,
              mesLabel: _labelMes(_mes),
              loading: _loading || _regenerating,
              onPickMes: _pickMes,
              onRegenerar: _regenerar,
            ),
            const SizedBox(height: PulsoTokens.space4),
            if (_loading)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 48),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (data == null)
              _EmptyCard(
                title: 'Insights indisponíveis',
                subtitle: 'Tente novamente em instantes.',
                onRetry: _carregar,
              )
            else if (data.semLancamentos)
              _EmptyCard(
                title: 'Sem dados neste mês',
                subtitle:
                    'Registre transações para a IA analisar seus hábitos.',
                onRetry: () => context.go('/transactions'),
                actionLabel: 'Ir para Transações',
              )
            else ...[
              _SectionCard(
                title: 'Resumo de ${_labelMes(data.mesReferencia)}',
                trailing: data.geradoPor == 'gemini'
                    ? _Chip(label: 'Gemini', color: accent)
                    : null,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.resumoMensal,
                      style: TextStyle(
                        height: 1.55,
                        color: scheme.onSurface,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: PulsoTokens.space3),
                    Row(
                      children: [
                        Expanded(
                          child: _FluxoTile(
                            label: 'Receitas',
                            value: formatBrl(data.fluxo.receitas),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _FluxoTile(
                            label: 'Despesas',
                            value: formatBrl(data.fluxo.despesas),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _FluxoTile(
                            label: 'Saldo',
                            value: formatBrl(data.fluxo.saldo),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: PulsoTokens.space3),
              _SectionCard(
                title: 'Variação por categoria',
                child: data.variacaoCategorias.isEmpty
                    ? Text(
                        'Sem comparação MoM ainda.',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      )
                    : Column(
                        children: [
                          for (final item in data.variacaoCategorias)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: _VariacaoBar(item: item),
                            ),
                        ],
                      ),
              ),
              const SizedBox(height: PulsoTokens.space3),
              _SectionCard(
                title: 'Score de saúde financeira',
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _ScoreGauge(
                      score: data.score.valor,
                      label: data.score.label,
                      accent: accent,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        children: [
                          for (final item in data.score.checklist)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Icon(
                                    item.ok
                                        ? Icons.check_circle_outline
                                        : Icons.warning_amber_rounded,
                                    size: 18,
                                    color: item.ok
                                        ? const Color(0xFF16A34A)
                                        : const Color(0xFFF59E0B),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      item.texto,
                                      style: const TextStyle(fontSize: 13),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: PulsoTokens.space3),
              _SectionCard(
                title: 'Projeção para os próximos meses',
                trailing: data.diasAteNegativo != null
                    ? _Chip(
                        label: 'Negativo em ~${data.diasAteNegativo}d',
                        color: const Color(0xFFEF4444),
                      )
                    : null,
                child: Column(
                  children: [
                    for (final p in data.projecoes)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: _ProjecaoCard(projecao: p),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: PulsoTokens.space3),
              _SectionCard(
                title: 'Sugestões personalizadas',
                child: data.sugestoes.isEmpty
                    ? Text(
                        'Nenhuma sugestão neste ciclo. Regenere após novos lançamentos.',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      )
                    : Column(
                        children: [
                          for (final s in data.sugestoes)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: _SugestaoTile(
                                sugestao: s,
                                accent: accent,
                                onApply: () => _aplicarSugestao(s),
                              ),
                            ),
                        ],
                      ),
              ),
              const SizedBox(height: PulsoTokens.space3),
              _SectionCard(
                title: 'Alertas',
                child: data.alertas.isEmpty
                    ? Text(
                        'Nenhum alerta no momento.',
                        style: TextStyle(color: scheme.onSurfaceVariant),
                      )
                    : Column(
                        children: [
                          for (final a in data.alertas)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: _AlertaTile(alerta: a),
                            ),
                        ],
                      ),
              ),
              if (data.educacao.isNotEmpty) ...[
                const SizedBox(height: PulsoTokens.space3),
                _SectionCard(
                  title: 'Educação financeira',
                  child: Column(
                    children: [
                      for (final e in data.educacao)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: Icon(
                            Icons.menu_book_outlined,
                            color: accent,
                          ),
                          title: Text(e.titulo),
                          subtitle: e.motivo != null ? Text(e.motivo!) : null,
                          trailing: const Icon(Icons.open_in_new, size: 18),
                          onTap: () => _openUrl(e.url),
                        ),
                    ],
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({
    required this.accent,
    required this.mesLabel,
    required this.loading,
    required this.onPickMes,
    required this.onRegenerar,
  });

  final Color accent;
  final String mesLabel;
  final bool loading;
  final VoidCallback onPickMes;
  final VoidCallback onRegenerar;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 10,
          runSpacing: 8,
          children: [
            Text(
              'Insights Inteligentes',
              style: Theme.of(context).textTheme.headlineSmall
                  ?.copyWith(fontWeight: FontWeight.w700, letterSpacing: -0.3),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: accent.withValues(alpha: 0.14),
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: accent.withValues(alpha: 0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.auto_awesome, size: 12, color: accent),
                  const SizedBox(width: 4),
                  Text(
                    'Powered by Gemini',
                    style: TextStyle(
                      color: accent,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          'Análises geradas automaticamente com base nos seus hábitos financeiros.',
          style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 13.5),
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            OutlinedButton.icon(
              onPressed: loading ? null : onPickMes,
              icon: const Icon(Icons.calendar_month_outlined, size: 18),
              label: Text(mesLabel),
            ),
            FilledButton.icon(
              onPressed: loading ? null : onRegenerar,
              icon: const Icon(Icons.refresh, size: 18),
              label: Text(loading ? 'Atualizando…' : 'Regenerar Insights'),
            ),
          ],
        ),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.child, this.trailing});

  final String title;
  final Widget child;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(PulsoTokens.space4),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: 0.55),
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        border: Border.all(color: scheme.outline.withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium
                      ?.copyWith(fontWeight: FontWeight.w700),
                ),
              ),
              if (trailing != null) trailing!,
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _FluxoTile extends StatelessWidget {
  const _FluxoTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: scheme.outline.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 11, color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _VariacaoBar extends StatelessWidget {
  const _VariacaoBar({required this.item});

  final InsightVariacao item;

  @override
  Widget build(BuildContext context) {
    final pct = item.percentual;
    final tone = pct > 0
        ? const Color(0xFFEF4444)
        : pct < 0
        ? const Color(0xFF16A34A)
        : const Color(0xFF94A3B8);
    final width = (pct.abs().clamp(0, 100)) / 100;
    final prefix = pct > 0 ? '+' : '';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(child: Text(item.categoria)),
            Icon(
              pct > 0
                  ? Icons.trending_up
                  : pct < 0
                  ? Icons.trending_down
                  : Icons.horizontal_rule,
              size: 16,
              color: tone,
            ),
            const SizedBox(width: 4),
            Text(
              '$prefix${pct.toStringAsFixed(0)}%',
              style: TextStyle(color: tone, fontWeight: FontWeight.w700),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: LinearProgressIndicator(
            value: width,
            minHeight: 8,
            backgroundColor: Theme.of(context).colorScheme.outline
                .withValues(alpha: 0.2),
            color: tone,
          ),
        ),
        if (item.comentario != null && item.comentario!.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            item.comentario!,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ],
    );
  }
}

class _ScoreGauge extends StatelessWidget {
  const _ScoreGauge({
    required this.score,
    required this.label,
    required this.accent,
  });

  final int score;
  final String label;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final pct = (score.clamp(0, 100)) / 100;
    return SizedBox(
      width: 118,
      height: 118,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            width: 118,
            height: 118,
            child: CircularProgressIndicator(
              value: pct,
              strokeWidth: 10,
              backgroundColor: accent.withValues(alpha: 0.15),
              color: accent,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: '$score',
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    TextSpan(
                      text: '/100',
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  color: accent,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ProjecaoCard extends StatelessWidget {
  const _ProjecaoCard({required this.projecao});

  final InsightProjecao projecao;

  Color get _tone {
    switch (projecao.id) {
      case 'otimista':
        return const Color(0xFF16A34A);
      case 'pessimista':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF7C3AED);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final tone = _tone;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: tone.withValues(alpha: 0.4)),
        color: scheme.surface.withValues(alpha: 0.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            projecao.label,
            style: TextStyle(color: tone, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 2),
          Text(
            projecao.descricao,
            style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 8),
          for (final h in const ['3', '6', '12'])
            Padding(
              padding: const EdgeInsets.only(bottom: 2),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      '$h meses',
                      style: const TextStyle(fontSize: 13),
                    ),
                  ),
                  Text(
                    formatBrl(projecao.acumulado[h] ?? 0),
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
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

class _SugestaoTile extends StatelessWidget {
  const _SugestaoTile({
    required this.sugestao,
    required this.accent,
    required this.onApply,
  });

  final InsightSugestao sugestao;
  final Color accent;
  final VoidCallback onApply;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: scheme.outline.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.lightbulb_outline, size: 18, color: accent),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  sugestao.titulo,
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
              _Chip(label: 'IA', color: accent),
            ],
          ),
          const SizedBox(height: 6),
          Text(sugestao.descricao, style: const TextStyle(fontSize: 13.5)),
          if (sugestao.impactoEstimado != null) ...[
            const SizedBox(height: 4),
            Text(
              sugestao.impactoEstimado!,
              style: TextStyle(fontSize: 12, color: scheme.onSurfaceVariant),
            ),
          ],
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: onApply,
              child: const Text('Aplicar sugestão'),
            ),
          ),
        ],
      ),
    );
  }
}

class _AlertaTile extends StatelessWidget {
  const _AlertaTile({required this.alerta});

  final InsightAlerta alerta;

  @override
  Widget build(BuildContext context) {
    final sev = alerta.severidade;
    late Color bg;
    late Color fg;
    late IconData icon;
    switch (sev) {
      case 'critico':
        bg = const Color(0xFFEF4444).withValues(alpha: 0.12);
        fg = const Color(0xFFB91C1C);
        icon = Icons.warning_amber_rounded;
      case 'aviso':
        bg = const Color(0xFFF59E0B).withValues(alpha: 0.14);
        fg = const Color(0xFFB45309);
        icon = Icons.warning_amber_rounded;
      default:
        bg = const Color(0xFF3B82F6).withValues(alpha: 0.12);
        fg = const Color(0xFF1D4ED8);
        icon = Icons.info_outline;
    }
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: fg.withValues(alpha: 0.35)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: fg),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              alerta.mensagem,
              style: TextStyle(color: fg, fontSize: 13.5),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({
    required this.title,
    required this.subtitle,
    required this.onRetry,
    this.actionLabel = 'Tentar de novo',
  });

  final String title;
  final String subtitle;
  final VoidCallback onRetry;
  final String actionLabel;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.35),
        ),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 14),
          FilledButton(onPressed: onRetry, child: Text(actionLabel)),
        ],
      ),
    );
  }
}
