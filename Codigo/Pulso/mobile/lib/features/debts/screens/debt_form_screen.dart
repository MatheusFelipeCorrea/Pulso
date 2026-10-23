import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/debts/data/debt_repository.dart';
import 'package:pulso/features/debts/state/debts_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DebtFormScreen extends StatefulWidget {
  const DebtFormScreen({super.key});

  @override
  State<DebtFormScreen> createState() => _DebtFormScreenState();
}

class _DebtFormScreenState extends State<DebtFormScreen> {
  final _nome = TextEditingController();
  final _valor = TextEditingController();
  final _obs = TextEditingController();
  String _direcao = 'ME_DEVEM';
  bool _submitting = false;

  @override
  void dispose() {
    _nome.dispose();
    _valor.dispose();
    _obs.dispose();
    super.dispose();
  }

  Future<void> _salvar() async {
    final valor = parseMoney(_valor.text);
    if (_nome.text.trim().isEmpty || valor == null || valor <= 0) {
      showPulsoSnack(context, 'Informe a pessoa e um valor maior que zero');
      return;
    }
    setState(() => _submitting = true);
    try {
      await context.read<DebtRepository>().criar({
        'direcao': _direcao,
        'nomePessoa': _nome.text.trim(),
        'valor': valor,
        'dataEmprestimo': DateTime.now().toUtc().toIso8601String(),
        'observacao': _obs.text.trim().isEmpty ? null : _obs.text.trim(),
      });
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
      title: 'Nova dívida',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          const PulsoPageHeader(
            title: 'Registrar empréstimo',
            subtitle: 'Escolha a direção e quem está envolvido.',
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
          TextField(
            controller: _obs,
            maxLines: 3,
            decoration: const InputDecoration(labelText: 'Observação'),
          ),
          const SizedBox(height: PulsoTokens.space5),
          FilledButton(
            onPressed: _submitting ? null : _salvar,
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }
}
