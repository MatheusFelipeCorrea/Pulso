import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class GoalFormScreen extends StatefulWidget {
  const GoalFormScreen({super.key, this.meta});

  final PulsoMeta? meta;

  @override
  State<GoalFormScreen> createState() => _GoalFormScreenState();
}

class _GoalFormScreenState extends State<GoalFormScreen> {
  final _nome = TextEditingController();
  final _valor = TextEditingController();
  final _descricao = TextEditingController();
  DateTime prazo = DateTime.now().add(const Duration(days: 90));
  String tipo = 'CURTO_PRAZO';
  bool submitting = false;

  bool get isEdit => widget.meta != null;

  @override
  void initState() {
    super.initState();
    final meta = widget.meta;
    if (meta != null) {
      _nome.text = meta.nome;
      _valor.text = meta.valorAlvo.toStringAsFixed(2).replaceAll('.', ',');
      _descricao.text = meta.descricao ?? '';
      prazo = meta.prazo;
      tipo = meta.tipo;
    }
  }

  @override
  void dispose() {
    _nome.dispose();
    _valor.dispose();
    _descricao.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final next = await showDatePicker(
      context: context,
      initialDate: prazo,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (next != null) setState(() => prazo = next);
  }

  Future<void> _usarReserva() async {
    try {
      final sugestao = await context.read<GoalRepository>().sugerirReserva();
      setState(() {
        if (_nome.text.trim().isEmpty) _nome.text = 'Reserva de Emergência';
        _valor.text = sugestao.valorSugerido.toStringAsFixed(2).replaceAll('.', ',');
        tipo = 'LONGO_PRAZO';
        prazo = DateTime(DateTime.now().year + 1, DateTime.now().month, DateTime.now().day);
        if (_descricao.text.trim().isEmpty) {
          _descricao.text = 'Fundo para imprevistos e emergências financeiras.';
        }
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _salvar() async {
    final valor = parseMoney(_valor.text);
    if (_nome.text.trim().isEmpty || valor == null || valor <= 0) {
      showPulsoSnack(context, 'Informe nome e um valor alvo válido');
      return;
    }
    setState(() => submitting = true);
    try {
      final payload = {
        'nome': _nome.text.trim(),
        'valorAlvo': valor,
        'prazo': DateTime(prazo.year, prazo.month, prazo.day, 12).toUtc().toIso8601String(),
        'tipo': tipo,
        'descricao': _descricao.text.trim().isEmpty ? null : _descricao.text.trim(),
      };
      final repo = context.read<GoalRepository>();
      if (isEdit) {
        await repo.atualizar(widget.meta!.id, payload);
      } else {
        await repo.criar(payload);
      }
      if (!mounted) return;
      context.pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? 'Editar meta' : 'Nova meta')),
      body: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          TextField(controller: _nome, decoration: const InputDecoration(labelText: 'Nome')),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor alvo (R\$)'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Prazo'),
            subtitle: Text(formatDayHeader(prazo)),
            trailing: const Icon(Icons.calendar_today_outlined),
            onTap: _pickDate,
          ),
          const SizedBox(height: PulsoTokens.space2),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'CURTO_PRAZO', label: Text('Curto prazo')),
              ButtonSegment(value: 'LONGO_PRAZO', label: Text('Longo prazo')),
            ],
            selected: {tipo},
            onSelectionChanged: (value) => setState(() => tipo = value.first),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _descricao,
            maxLines: 3,
            decoration: const InputDecoration(labelText: 'Descrição'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          OutlinedButton(
            onPressed: submitting ? null : _usarReserva,
            child: const Text('Usar sugestão de reserva de emergência'),
          ),
          const SizedBox(height: PulsoTokens.space4),
          FilledButton(
            onPressed: submitting ? null : _salvar,
            child: Text(submitting ? 'Salvando…' : 'Salvar'),
          ),
        ],
      ),
    );
  }
}
