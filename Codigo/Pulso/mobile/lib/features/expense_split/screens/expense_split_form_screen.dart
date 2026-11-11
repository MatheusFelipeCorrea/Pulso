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
import 'package:pulso/features/expense_split/utils/split_math.dart';
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
  final _novoNome = TextEditingController();
  late final TextEditingController _outroPagador;
  late final TextEditingController _valorOrganizador;
  final Map<String, TextEditingController> _valoresOutros = {};

  late String _tipo;
  bool _euPaguei = true;
  bool _submitting = false;
  final List<String> _participantesOutros = [];

  bool get _editando => widget.divisao != null;
  int get _nPessoas => _participantesOutros.length + 1;

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
    _tipo = d?.tipo ?? 'IGUAL';
    _euPaguei = d == null
        ? true
        : d.participantes.any((p) => p.ehOrganizador && p.pagouAConta);

    final outros = (d?.participantes ?? const <SplitParticipante>[])
        .where((p) => !p.ehOrganizador)
        .toList();
    for (final p in outros) {
      _participantesOutros.add(p.nome);
      _valoresOutros[p.nome] = TextEditingController(
        text: p.valor.toStringAsFixed(2).replaceAll('.', ','),
      );
    }

    final organizador = (d?.participantes ?? const <SplitParticipante>[])
        .where((p) => p.ehOrganizador)
        .toList();
    _valorOrganizador = TextEditingController(
      text: organizador.isEmpty
          ? ''
          : organizador.first.valor.toStringAsFixed(2).replaceAll('.', ','),
    );

    final pagadorExterno = (d?.participantes ?? const <SplitParticipante>[])
        .where((p) => p.pagouAConta && !p.ehOrganizador)
        .map((p) => p.nome)
        .toList();
    _outroPagador = TextEditingController(
      text: pagadorExterno.isEmpty ? '' : pagadorExterno.first,
    );

    _valor.addListener(_onValorChanged);
  }

  @override
  void dispose() {
    _valor.removeListener(_onValorChanged);
    _titulo.dispose();
    _valor.dispose();
    _novoNome.dispose();
    _outroPagador.dispose();
    _valorOrganizador.dispose();
    for (final c in _valoresOutros.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _onValorChanged() {
    if (_tipo != 'IGUAL') return;
    _redistribuirIgual();
  }

  void _redistribuirIgual() {
    final valor = parseMoney(_valor.text);
    if (valor == null || valor <= 0 || _nPessoas <= 0) return;
    final fatias = splitEqual(valor, _nPessoas);
    _valorOrganizador.text = fatias.first
        .toStringAsFixed(2)
        .replaceAll('.', ',');
    for (var i = 0; i < _participantesOutros.length; i++) {
      final nome = _participantesOutros[i];
      _valoresOutros[nome]?.text = fatias[i + 1]
          .toStringAsFixed(2)
          .replaceAll('.', ',');
    }
  }

  void _adicionarParticipante() {
    final nome = _novoNome.text.trim();
    if (nome.isEmpty) return;
    final lower = nome.toLowerCase();
    if (lower == 'você' || lower == 'voce') {
      showPulsoSnack(context, 'Você já está incluso na divisão.');
      return;
    }
    if (_participantesOutros.any((p) => p.toLowerCase() == lower)) {
      showPulsoSnack(context, 'Participante já adicionado.');
      return;
    }
    setState(() {
      _participantesOutros.add(nome);
      _valoresOutros[nome] = TextEditingController();
      _novoNome.clear();
    });
    if (_tipo == 'IGUAL') _redistribuirIgual();
  }

  void _removerParticipante(String nome) {
    setState(() {
      _participantesOutros.remove(nome);
      _valoresOutros.remove(nome)?.dispose();
      if (!_euPaguei && _outroPagador.text.trim() == nome) {
        _outroPagador.clear();
      }
    });
    if (_tipo == 'IGUAL') _redistribuirIgual();
  }

  Future<void> _salvar() async {
    final valor = parseMoney(_valor.text);
    if (_titulo.text.trim().isEmpty || valor == null || valor <= 0) {
      showPulsoSnack(context, 'Informe título e um valor maior que zero');
      return;
    }
    if (_participantesOutros.isEmpty) {
      showPulsoSnack(context, 'Adicione ao menos 1 participante além de você');
      return;
    }
    if (!_euPaguei && _outroPagador.text.trim().isEmpty) {
      showPulsoSnack(context, 'Informe o nome de quem pagou');
      return;
    }

    final payload = <String, dynamic>{
      'titulo': _titulo.text.trim(),
      'valorTotal': valor,
      'tipo': _tipo,
      'data': isoDate(DateTime.now()),
      'icone': 'Receipt',
      'cor': '#7C3AED',
      'pagoPor': _euPaguei ? 'VOCE' : _outroPagador.text.trim(),
      'participantes': _participantesOutros.map((nome) {
        if (_tipo == 'PERSONALIZADA') {
          final fatia = parseMoney(_valoresOutros[nome]?.text ?? '') ?? 0;
          return {'nome': nome, 'valor': fatia};
        }
        return {'nome': nome};
      }).toList(),
    };

    if (_tipo == 'PERSONALIZADA') {
      final valorOrg = parseMoney(_valorOrganizador.text);
      if (valorOrg == null || valorOrg <= 0) {
        showPulsoSnack(context, 'Informe o valor da sua parte');
        return;
      }
      final valores = [
        valorOrg,
        ..._participantesOutros.map(
          (nome) => parseMoney(_valoresOutros[nome]?.text ?? '') ?? 0,
        ),
      ];
      if (!validarSomaPersonalizada(valor, valores)) {
        showPulsoSnack(
          context,
          'A soma das partes deve ser igual ao valor total',
        );
        return;
      }
      payload['valorOrganizador'] = valorOrg;
    }

    setState(() => _submitting = true);
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
    final valor = parseMoney(_valor.text);
    final fatiaIgual = valor != null && valor > 0 && _nPessoas > 0
        ? valor / _nPessoas
        : null;

    return PulsoFormScaffold(
      title: _editando ? 'Editar divisão' : 'Nova divisão',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          PulsoPageHeader(
            title: _editando ? 'Atualizar divisão' : 'Dividir uma conta',
            subtitle: 'Defina quem pagou e entre quem dividir — igual à web.',
            icon: Icons.groups_2_outlined,
          ),
          TextField(
            controller: _titulo,
            decoration: const InputDecoration(labelText: 'Descrição'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor total (R\$)'),
          ),
          const SizedBox(height: PulsoTokens.space4),
          Text(
            'Quem pagou a conta?',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Eu paguei a conta'),
            subtitle: Text(
              _euPaguei ? 'Você é o pagador' : 'Outra pessoa pagou',
            ),
            value: _euPaguei,
            onChanged: (value) => setState(() => _euPaguei = value),
          ),
          if (!_euPaguei) ...[
            if (_participantesOutros.isNotEmpty)
              DropdownButtonFormField<String>(
                initialValue:
                    _participantesOutros.contains(_outroPagador.text.trim())
                    ? _outroPagador.text.trim()
                    : null,
                decoration: const InputDecoration(
                  labelText: 'Selecionar participante',
                ),
                items: [
                  for (final nome in _participantesOutros)
                    DropdownMenuItem(value: nome, child: Text(nome)),
                ],
                onChanged: (value) {
                  _outroPagador.text = value ?? '';
                  setState(() {});
                },
              ),
            const SizedBox(height: PulsoTokens.space2),
            TextField(
              controller: _outroPagador,
              decoration: const InputDecoration(
                labelText: 'Nome de quem pagou',
              ),
            ),
          ],
          const SizedBox(height: PulsoTokens.space4),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Dividir entre',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
              ),
              Text(
                '$_nPessoas ${_nPessoas == 1 ? 'pessoa' : 'pessoas'}',
                style: Theme.of(context).textTheme.labelMedium,
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space2),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _novoNome,
                  decoration: const InputDecoration(
                    labelText: 'Nome do participante',
                  ),
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) => _adicionarParticipante(),
                ),
              ),
              const SizedBox(width: PulsoTokens.space2),
              FilledButton.tonal(
                onPressed: _adicionarParticipante,
                child: const Text('Adicionar'),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space3),
          PulsoSurface(
            child: Column(
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.person_outline),
                  title: const Text('Você'),
                  subtitle: const Text('Incluso'),
                  trailing: _tipo == 'PERSONALIZADA'
                      ? SizedBox(
                          width: 110,
                          child: TextField(
                            controller: _valorOrganizador,
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                            ),
                            decoration: const InputDecoration(
                              labelText: 'R\$',
                              isDense: true,
                            ),
                          ),
                        )
                      : null,
                ),
                for (final nome in _participantesOutros)
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.person_outline),
                    title: Text(nome),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (_tipo == 'PERSONALIZADA')
                          SizedBox(
                            width: 110,
                            child: TextField(
                              controller: _valoresOutros[nome],
                              keyboardType:
                                  const TextInputType.numberWithOptions(
                                    decimal: true,
                                  ),
                              decoration: const InputDecoration(
                                labelText: 'R\$',
                                isDense: true,
                              ),
                            ),
                          ),
                        IconButton(
                          tooltip: 'Remover',
                          onPressed: () => _removerParticipante(nome),
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          Text(
            'Tipo de divisão',
            style: Theme.of(context).textTheme.titleSmall,
          ),
          const SizedBox(height: PulsoTokens.space2),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'IGUAL', label: Text('Igual')),
              ButtonSegment(
                value: 'PERSONALIZADA',
                label: Text('Personalizada'),
              ),
            ],
            selected: {_tipo},
            onSelectionChanged: (value) {
              setState(() => _tipo = value.first);
              if (_tipo == 'IGUAL') _redistribuirIgual();
            },
          ),
          if (_tipo == 'IGUAL' && fatiaIgual != null) ...[
            const SizedBox(height: PulsoTokens.space2),
            Text(
              '${formatBrl(valor!)} ÷ $_nPessoas = ${formatBrl(fatiaIgual)} por pessoa',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
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
