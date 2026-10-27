import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/debts/data/debt_models.dart';
import 'package:pulso/features/debts/data/debt_repository.dart';
import 'package:pulso/features/debts/state/debts_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DebtFormScreen extends StatefulWidget {
  const DebtFormScreen({super.key, this.divida});

  final PulsoDivida? divida;

  @override
  State<DebtFormScreen> createState() => _DebtFormScreenState();
}

class _DebtFormScreenState extends State<DebtFormScreen> {
  late final TextEditingController _nome;
  late final TextEditingController _valor;
  late final TextEditingController _obs;
  late String _direcao;
  DateTime? _prazo;
  bool _submitting = false;

  bool get _editando => widget.divida != null;

  @override
  void initState() {
    super.initState();
    final d = widget.divida;
    _nome = TextEditingController(text: d?.nomePessoa ?? '');
    _valor = TextEditingController(
      text: d == null ? '' : d.valor.toStringAsFixed(2).replaceAll('.', ','),
    );
    _obs = TextEditingController(text: d?.observacao ?? '');
    _direcao = d?.direcao ?? 'ME_DEVEM';
    _prazo = d?.prazoDevolucao;
  }

  @override
  void dispose() {
    _nome.dispose();
    _valor.dispose();
    _obs.dispose();
    super.dispose();
  }

  Future<void> _escolherPrazo() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _prazo ?? DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() => _prazo = picked);
  }

  Future<void> _salvar() async {
    final valor = parseMoney(_valor.text);
    if (_nome.text.trim().isEmpty || valor == null || valor <= 0) {
      showPulsoSnack(context, 'Informe a pessoa e um valor maior que zero');
      return;
    }
    setState(() => _submitting = true);
    final payload = <String, dynamic>{
      'direcao': _direcao,
      'nomePessoa': _nome.text.trim(),
      'valor': valor,
      'observacao': _obs.text.trim().isEmpty ? null : _obs.text.trim(),
      if (_prazo != null) 'prazoDevolucao': _prazo!.toUtc().toIso8601String(),
    };
    try {
      final repo = context.read<DebtRepository>();
      if (_editando) {
        await repo.atualizar(widget.divida!.id, payload);
      } else {
        await repo.criar({
          ...payload,
          'dataEmprestimo': DateTime.now().toUtc().toIso8601String(),
        });
      }
      if (!mounted) return;
      await context.read<DebtsController>().reload();
      if (!mounted) return;
      context.pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return PulsoFormScaffold(
      title: _editando ? 'Editar dívida' : 'Nova dívida',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          PulsoPageHeader(
            title: _editando ? 'Atualizar empréstimo' : 'Registrar empréstimo',
            subtitle: 'Escolha a direção, prazo e quem está envolvido.',
            icon: Icons.handshake_outlined,
          ),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(
                value: 'ME_DEVEM',
                label: Text('Me devem'),
                icon: Icon(Icons.call_received),
              ),
              ButtonSegment(
                value: 'EU_DEVO',
                label: Text('Eu devo'),
                icon: Icon(Icons.call_made),
              ),
            ],
            selected: {_direcao},
            onSelectionChanged: (value) =>
                setState(() => _direcao = value.first),
          ),
          const SizedBox(height: PulsoTokens.space4),
          TextField(
            controller: _nome,
            decoration: const InputDecoration(labelText: 'Pessoa'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor (R\$)'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Prazo de devolução'),
            subtitle: Text(
              _prazo == null
                  ? 'Opcional'
                  : '${_prazo!.day.toString().padLeft(2, '0')}/${_prazo!.month.toString().padLeft(2, '0')}/${_prazo!.year}',
            ),
            trailing: IconButton(
              onPressed: _escolherPrazo,
              icon: const Icon(Icons.calendar_today_outlined),
            ),
          ),
          TextField(
            controller: _obs,
            maxLines: 3,
            decoration: const InputDecoration(labelText: 'Observação'),
          ),
          const SizedBox(height: PulsoTokens.space5),
          FilledButton(
            onPressed: _submitting ? null : _salvar,
            child: Text(_editando ? 'Salvar alterações' : 'Salvar'),
          ),
        ],
      ),
    );
  }
}
