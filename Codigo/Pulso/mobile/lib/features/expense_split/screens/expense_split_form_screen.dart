import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';
import 'package:pulso/features/expense_split/state/split_controller.dart';
import 'package:pulso/features/expense_split/utils/split_labels.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class ExpenseSplitFormScreen extends StatefulWidget {
  const ExpenseSplitFormScreen({super.key, this.divisao});

  final PulsoDivisao? divisao;

  @override
  State<ExpenseSplitFormScreen> createState() => _ExpenseSplitFormScreenState();
}

class _ExpenseSplitFormScreenState extends State<ExpenseSplitFormScreen> {
  late final TextEditingController _titulo;
  late final TextEditingController _valor;
  late final TextEditingController _nomes;
  late String _tipo;
  bool _euPaguei = true;
  bool _submitting = false;

  bool get _editando => widget.divisao != null;

  @override
  void initState() {
    super.initState();
    final d = widget.divisao;
    _titulo = TextEditingController(text: d?.titulo ?? '');
    _valor = TextEditingController(
      text: d == null
          ? ''
          : d.valorTotal.toStringAsFixed(2).replaceAll('.', ','),
    );
    final outros = (d?.participantes ?? const <SplitParticipante>[])
        .where((p) => !p.ehOrganizador)
        .map((p) => p.nome)
        .join(', ');
    _nomes = TextEditingController(text: outros);
    _tipo = d?.tipo ?? 'IGUAL';
    _euPaguei = d == null
        ? true
        : d.participantes.any((p) => p.ehOrganizador && p.pagouAConta);
  }

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
    final participantes = nomes.map((nome) {
      if (_tipo == 'PERSONALIZADA') {
        final fatia = valor / (nomes.length + 1);
        return {'nome': nome, 'valor': double.parse(fatia.toStringAsFixed(2))};
      }
      return {'nome': nome};
    }).toList();
    final payload = <String, dynamic>{
      'titulo': _titulo.text.trim(),
      'valorTotal': valor,
      'tipo': _tipo,
      'data': data,
      'icone': 'Receipt',
      'cor': '#7C3AED',
      'participantes': participantes,
      'pagoPor': _euPaguei ? 'VOCE' : nomes.first,
    };
    try {
      final repo = context.read<ExpenseSplitRepository>();
      if (_editando) {
        await repo.atualizar(widget.divisao!.id, payload);
      } else {
        await repo.criar(payload);
      }
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
      title: _editando ? 'Editar divisão' : 'Nova divisão',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          PulsoPageHeader(
            title: _editando ? 'Atualizar divisão' : 'Dividir uma conta',
            subtitle:
                'Use divisão igual ou personalizada — inclui você e quem listar.',
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
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'IGUAL', label: Text('Igual')),
              ButtonSegment(
                value: 'PERSONALIZADA',
                label: Text('Personalizada'),
              ),
            ],
            selected: {_tipo},
            onSelectionChanged: (value) => setState(() => _tipo = value.first),
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
            child: Text(_editando ? 'Salvar alterações' : 'Criar divisão'),
          ),
        ],
      ),
    );
  }
}
