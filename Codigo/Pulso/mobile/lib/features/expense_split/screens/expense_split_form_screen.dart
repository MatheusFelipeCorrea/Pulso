import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';
import 'package:pulso/features/expense_split/state/split_controller.dart';
import 'package:pulso/features/expense_split/utils/split_labels.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class ExpenseSplitFormScreen extends StatefulWidget {
  const ExpenseSplitFormScreen({super.key});

  @override
  State<ExpenseSplitFormScreen> createState() => _ExpenseSplitFormScreenState();
}

class _ExpenseSplitFormScreenState extends State<ExpenseSplitFormScreen> {
  final _titulo = TextEditingController();
  final _valor = TextEditingController();
  final _nomes = TextEditingController();
  bool _euPaguei = true;
  bool _submitting = false;

  @override
  void dispose() {
    _titulo.dispose();
    _valor.dispose();
    _nomes.dispose();
    super.dispose();
  }

  Future<void> _salvar() async {
    final valor = parseMoney(_valor.text);
    final nomes = nomesParticipantes(_nomes.text);
    if (_titulo.text.trim().isEmpty ||
        valor == null ||
        valor <= 0 ||
        nomes.isEmpty) {
      showPulsoSnack(
        context,
        'Informe título, valor e ao menos um participante',
      );
      return;
    }
    setState(() => _submitting = true);
    final hoje = DateTime.now();
    final data =
        '${hoje.year.toString().padLeft(4, '0')}-${hoje.month.toString().padLeft(2, '0')}-${hoje.day.toString().padLeft(2, '0')}';
    try {
      await context.read<ExpenseSplitRepository>().criar({
        'titulo': _titulo.text.trim(),
        'valorTotal': valor,
        'tipo': 'IGUAL',
        'data': data,
        'icone': 'Receipt',
        'cor': '#7C3AED',
        'participantes': nomes.map((nome) => {'nome': nome}).toList(),
        'pagoPor': _euPaguei ? 'VOCE' : nomes.first,
      });
      if (!mounted) return;
      await context.read<ExpenseSplitController>().reload();
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
      title: 'Nova divisão',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          const PulsoPageHeader(
            title: 'Dividir uma conta',
            subtitle: 'A divisão igual inclui você e quem você listar.',
            icon: Icons.groups_2_outlined,
          ),
          TextField(
            controller: _titulo,
            decoration: const InputDecoration(labelText: 'Título'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor total (R\$)'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _nomes,
            decoration: const InputDecoration(
              labelText: 'Outros participantes',
              hintText: 'Ana, Bruno',
            ),
          ),
          const SizedBox(height: PulsoTokens.space3),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Eu paguei a conta'),
            value: _euPaguei,
            onChanged: (value) => setState(() => _euPaguei = value),
          ),
          const SizedBox(height: PulsoTokens.space4),
          FilledButton(
            onPressed: _submitting ? null : _salvar,
            child: const Text('Criar divisão'),
          ),
        ],
      ),
    );
  }
}
