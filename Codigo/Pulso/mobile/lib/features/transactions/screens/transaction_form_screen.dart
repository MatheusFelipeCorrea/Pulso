import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/utils/transaction_rules.dart';
import 'package:pulso/features/transactions/widgets/delete_transaction_dialog.dart';

class TransactionFormScreen extends StatefulWidget {
  const TransactionFormScreen({
    super.key,
    required this.repository,
    this.transacao,
  });

  final TransactionRepository repository;
  final PulsoTransacao? transacao;

  @override
  State<TransactionFormScreen> createState() => _TransactionFormScreenState();
}

class _TransactionFormScreenState extends State<TransactionFormScreen> {
  final _valor = TextEditingController();
  final _descricao = TextEditingController();
  final _tagInput = TextEditingController();

  String tipo = 'DESPESA';
  String? recurso;
  String? recursoDestino;
  String? categoriaId;
  DateTime data = DateTime.now();
  bool recorrente = false;
  String frequencia = 'MENSAL';
  String ateQuando = 'SEM_FIM';
  DateTime? dataFim;
  final List<({String nome, String? id})> tags = [];
  bool sugerida = false;
  bool loading = true;
  bool submitting = false;
  String? error;
  TransactionFilterOptions? options;
  Timer? _sugestao;

  bool get isEdit => widget.transacao != null;
  bool get isTransferencia => tipo == 'TRANSFERENCIA';

  @override
  void initState() {
    super.initState();
    final tx = widget.transacao;
    if (tx != null) {
      tipo = tx.tipo;
      recurso = tx.recurso;
      recursoDestino = tx.recursoDestino;
      categoriaId = tx.categoria?.id;
      data = tx.data;
      recorrente = tx.recorrente;
      _valor.text = tx.valor.toStringAsFixed(2).replaceAll('.', ',');
      _descricao.text = tx.descricao ?? '';
      tags.addAll(tx.tags.map((tag) => (nome: tag.nome, id: tag.id)));
    }
    _descricao.addListener(_onDescricaoChanged);
    _carregarOpcoes();
  }

  @override
  void dispose() {
    _sugestao?.cancel();
    _descricao.removeListener(_onDescricaoChanged);
    _valor.dispose();
    _descricao.dispose();
    _tagInput.dispose();
    super.dispose();
  }

  Future<void> _carregarOpcoes() async {
    try {
      options = await widget.repository.obterOpcoes();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  void _onDescricaoChanged() {
    _sugestao?.cancel();
    if (isEdit || isTransferencia || (categoriaId != null && !sugerida)) return;
    final texto = _descricao.text.trim();
    if (texto.length < 3) return;
    _sugestao = Timer(const Duration(milliseconds: 400), () async {
      try {
        final id = await widget.repository.sugerirCategoria(
          tipo: tipo,
          descricao: texto,
        );
        if (!mounted || id == null) return;
        setState(() {
          categoriaId = id;
          sugerida = true;
        });
      } catch (_) {}
    });
  }

  List<PulsoCategoria> get _categoriasFiltradas {
    return (options?.categorias ?? [])
        .where((cat) => cat.tipo == tipo)
        .toList();
  }

  PulsoCategoria? get _categoriaSelecionada {
    final cats = options?.categorias ?? [];
    for (final cat in cats) {
      if (cat.id == categoriaId) return cat;
    }
    return null;
  }

  List<FilterOption> get _recursos => options?.formRecursos.isNotEmpty == true
      ? options!.formRecursos
      : const [
          FilterOption(value: 'DINHEIRO', label: 'Dinheiro'),
          FilterOption(value: 'VA', label: 'VA'),
          FilterOption(value: 'VR', label: 'VR'),
          FilterOption(value: 'POUPANCA', label: 'Poupança'),
        ];

  bool _addTag(String raw, {bool silentDuplicate = false}) {
    final partes = raw
        .split(',')
        .map((part) => part.trim())
        .where((part) => part.isNotEmpty);
    var added = false;
    for (final nome in partes) {
      if (nome.length > 40) {
        showPulsoSnack(context, 'Tag "$nome" passa de 40 caracteres.');
        continue;
      }
      if (tags.any((item) => item.nome.toLowerCase() == nome.toLowerCase())) {
        if (!silentDuplicate) {
          showPulsoSnack(context, 'A tag "$nome" já foi adicionada.');
        }
        continue;
      }
      final existente = (options?.tags ?? []).where(
        (tag) => tag.nome.toLowerCase() == nome.toLowerCase(),
      );
      tags.add((nome: nome, id: existente.isEmpty ? null : existente.first.id));
      added = true;
    }
    if (added) {
      setState(() {});
      _tagInput.clear();
    }
    return added;
  }

  void _removeTag(String nome) {
    setState(() => tags.removeWhere((item) => item.nome == nome));
  }

  void _onTagChanged(String value) {
    if (!value.contains(',')) return;
    final partes = value.split(',');
    final completo = partes.sublist(0, partes.length - 1).join(',');
    final resto = partes.last;
    _addTag(completo, silentDuplicate: true);
    _tagInput.value = TextEditingValue(
      text: resto,
      selection: TextSelection.collapsed(offset: resto.length),
    );
  }

  Future<void> _pickDate({required bool fim}) async {
    final initial = fim ? (dataFim ?? data) : data;
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;
    setState(() {
      if (fim) {
        dataFim = picked;
      } else {
        data = picked;
      }
    });
  }

  Future<void> _salvar() async {
    if (_tagInput.text.trim().isNotEmpty) {
      _addTag(_tagInput.text, silentDuplicate: true);
    }
    final valor = parseMoney(_valor.text);
    final fieldErrors = <String>[];
    if (valor == null || valor <= 0)
      fieldErrors.add('Informe um valor maior que zero.');
    if (recurso == null) fieldErrors.add('Selecione o recurso de origem.');
    if (isTransferencia) {
      final transferencia = validarTransferencia(recurso, recursoDestino);
      if (transferencia != null) fieldErrors.add(transferencia);
    } else if (categoriaId == null) {
      fieldErrors.add('Selecione uma categoria.');
    } else {
      final recursoErro = validarRecursoCategoria(
        recurso: recurso ?? '',
        tipo: tipo,
        categoriaNome: _categoriaSelecionada?.nome,
        grupoBeneficio: _categoriaSelecionada?.grupoBeneficio,
      );
      if (recursoErro != null) fieldErrors.add(recursoErro);
    }
    if (fieldErrors.isNotEmpty) {
      setState(() => error = fieldErrors.first);
      showPulsoSnack(context, fieldErrors.first);
      return;
    }

    setState(() {
      submitting = true;
      error = null;
    });
    try {
      final resolvedTags = await widget.repository.resolverTagIds(
        ids: [
          for (final tag in tags)
            if (tag.id != null) tag.id!,
        ],
        nomesNovos: [
          for (final tag in tags)
            if (tag.id == null) tag.nome,
        ],
      );
      final payload = <String, dynamic>{
        'tipo': tipo,
        'recurso': recurso,
        'valor': valor,
        'descricao': _descricao.text.trim().isEmpty
            ? null
            : _descricao.text.trim(),
        'data': isoDate(data),
        'tags': resolvedTags,
        if (!isTransferencia) 'categoriaId': categoriaId,
        if (isTransferencia) 'recursoDestino': recursoDestino,
        if (!isEdit) 'recorrente': recorrente,
        if (!isEdit && recorrente)
          'regraRecorrencia': buildRecurrenceRule(
            frequencia: frequencia,
            ateQuando: ateQuando,
            dataFim: dataFim,
          ),
      };
      if (isEdit) {
        await widget.repository.atualizar(widget.transacao!.id, payload);
      } else {
        await widget.repository.criar(payload);
      }
      if (!mounted) return;
      showPulsoSnack(
        context,
        isEdit
            ? 'Transação atualizada com sucesso!'
            : (recorrente
                  ? 'Transação recorrente criada! Ela será gerada automaticamente.'
                  : 'Transação criada com sucesso!'),
      );
      context.pop(true);
    } on ApiException catch (err) {
      if (!mounted) return;
      setState(() => error = err.message);
      showPulsoSnack(context, err.message);
    } catch (err) {
      if (!mounted) return;
      const message = 'Não foi possível salvar as tags/transação.';
      setState(() => error = message);
      showPulsoSnack(context, message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  Future<void> _excluir() async {
    final tx = widget.transacao;
    if (tx == null) return;
    final choice = await showDeleteTransactionDialog(
      context: context,
      transacao: tx,
    );
    if (choice == null) return;
    setState(() => submitting = true);
    try {
      await widget.repository.excluir(
        tx.id,
        excluirFuturas: choice.excluirFuturas,
        dataCorte: choice.excluirFuturas ? tx.data : null,
      );
      if (!mounted) return;
      context.pop(true);
    } on ApiException catch (err) {
      if (mounted) setState(() => error = err.message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  Widget _tipoButton(String value, String label) {
    final selected = tipo == value;
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2),
        child: selected
            ? FilledButton(
                style: FilledButton.styleFrom(
                  minimumSize: const Size(0, PulsoTokens.buttonMd),
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                ),
                onPressed: () {},
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(label, textAlign: TextAlign.center),
                ),
              )
            : OutlinedButton(
                onPressed: () {
                  setState(() {
                    tipo = value;
                    categoriaId = null;
                    recursoDestino = null;
                    sugerida = false;
                  });
                },
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(label, textAlign: TextAlign.center),
                ),
              ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit ? 'Editar transação' : 'Nova transação'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.fromLTRB(
                PulsoTokens.space5,
                PulsoTokens.space3,
                PulsoTokens.space5,
                PulsoTokens.space8,
              ),
              children: [
                Row(
                  children: [
                    _tipoButton('RECEITA', 'Receita'),
                    const SizedBox(width: PulsoTokens.space2),
                    _tipoButton('DESPESA', 'Despesa'),
                    const SizedBox(width: PulsoTokens.space2),
                    _tipoButton('TRANSFERENCIA', 'Transferência'),
                  ],
                ),
                const SizedBox(height: PulsoTokens.space4),
                TextField(
                  controller: _valor,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Valor',
                    prefixText: 'R\$ ',
                  ),
                ),
                const SizedBox(height: PulsoTokens.space3),
                InkWell(
                  onTap: () => _pickDate(fim: false),
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Data',
                      suffixIcon: Icon(Icons.calendar_today_outlined),
                    ),
                    child: Text(formatDayHeader(data)),
                  ),
                ),
                const SizedBox(height: PulsoTokens.space3),
                if (!isTransferencia) ...[
                  DropdownButtonFormField<String?>(
                    key: ValueKey('categoria-$tipo-$categoriaId'),
                    initialValue: categoriaId,
                    decoration: const InputDecoration(labelText: 'Categoria'),
                    items: [
                      const DropdownMenuItem<String?>(
                        value: null,
                        child: Text('Selecione'),
                      ),
                      ..._categoriasFiltradas.map(
                        (cat) => DropdownMenuItem<String?>(
                          value: cat.id,
                          child: Text(cat.nome),
                        ),
                      ),
                    ],
                    onChanged: (value) => setState(() {
                      categoriaId = value;
                      sugerida = false;
                    }),
                  ),
                  if (sugerida && categoriaId != null)
                    const Padding(
                      padding: EdgeInsets.only(top: 6),
                      child: Text('Categoria sugerida automaticamente'),
                    ),
                ] else
                  DropdownButtonFormField<String?>(
                    key: ValueKey('destino-$recursoDestino'),
                    initialValue: recursoDestino,
                    decoration: const InputDecoration(
                      labelText: 'Recurso de destino',
                    ),
                    items: [
                      const DropdownMenuItem<String?>(
                        value: null,
                        child: Text('Selecione'),
                      ),
                      ..._recursos
                          .where((item) => item.value != recurso)
                          .map(
                            (item) => DropdownMenuItem<String?>(
                              value: item.value,
                              child: Text(item.label),
                            ),
                          ),
                    ],
                    onChanged: (value) =>
                        setState(() => recursoDestino = value),
                  ),
                const SizedBox(height: PulsoTokens.space3),
                TextField(
                  controller: _descricao,
                  decoration: const InputDecoration(
                    labelText: 'Descrição',
                    hintText: 'Ex: Almoço no RU',
                  ),
                ),
                const SizedBox(height: PulsoTokens.space3),
                DropdownButtonFormField<String?>(
                  key: ValueKey('origem-$recurso'),
                  initialValue: recurso,
                  decoration: const InputDecoration(
                    labelText: 'Recurso de origem',
                  ),
                  items: [
                    const DropdownMenuItem<String?>(
                      value: null,
                      child: Text('Selecione'),
                    ),
                    ..._recursos
                        .where((item) => item.value != recursoDestino)
                        .map(
                          (item) => DropdownMenuItem<String?>(
                            value: item.value,
                            child: Text(item.label),
                          ),
                        ),
                  ],
                  onChanged: (value) => setState(() => recurso = value),
                ),
                const SizedBox(height: PulsoTokens.space3),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _tagInput,
                        decoration: const InputDecoration(
                          labelText: 'Tags',
                          hintText: 'faculdade, almoço...',
                          helperText: 'Enter ou vírgula para adicionar',
                        ),
                        textInputAction: TextInputAction.done,
                        onChanged: _onTagChanged,
                        onSubmitted: _addTag,
                      ),
                    ),
                    const SizedBox(width: PulsoTokens.space2),
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: IconButton.filledTonal(
                        tooltip: 'Adicionar tag',
                        onPressed: () => _addTag(_tagInput.text),
                        icon: const Icon(Icons.add),
                      ),
                    ),
                  ],
                ),
                if (tags.isNotEmpty) ...[
                  const SizedBox(height: PulsoTokens.space2),
                  Wrap(
                    spacing: PulsoTokens.space2,
                    runSpacing: PulsoTokens.space2,
                    children: [
                      for (final tag in tags)
                        InputChip(
                          label: Text(tag.nome),
                          onDeleted: () => _removeTag(tag.nome),
                        ),
                    ],
                  ),
                ],
                if (!isEdit)
                  ExpansionTile(
                    tilePadding: EdgeInsets.zero,
                    initiallyExpanded: recorrente,
                    title: const Text('Repetir automaticamente'),
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Ativar recorrência'),
                        value: recorrente,
                        onChanged: (value) =>
                            setState(() => recorrente = value),
                      ),
                      if (recorrente) ...[
                        DropdownButtonFormField<String>(
                          initialValue: frequencia,
                          decoration: const InputDecoration(
                            labelText: 'Frequência',
                          ),
                          items:
                              (options?.frequencias ??
                                      const [
                                        FilterOption(
                                          value: 'MENSAL',
                                          label: 'Mensal',
                                        ),
                                      ])
                                  .map(
                                    (item) => DropdownMenuItem(
                                      value: item.value,
                                      child: Text(item.label),
                                    ),
                                  )
                                  .toList(),
                          onChanged: (value) =>
                              setState(() => frequencia = value ?? 'MENSAL'),
                        ),
                        const SizedBox(height: PulsoTokens.space3),
                        DropdownButtonFormField<String>(
                          initialValue: ateQuando,
                          decoration: const InputDecoration(
                            labelText: 'Até quando',
                          ),
                          items:
                              (options?.ateQuando ??
                                      const [
                                        FilterOption(
                                          value: 'SEM_FIM',
                                          label: 'Sem fim',
                                        ),
                                      ])
                                  .map(
                                    (item) => DropdownMenuItem(
                                      value: item.value,
                                      child: Text(item.label),
                                    ),
                                  )
                                  .toList(),
                          onChanged: (value) =>
                              setState(() => ateQuando = value ?? 'SEM_FIM'),
                        ),
                        if (ateQuando == 'DATA') ...[
                          const SizedBox(height: PulsoTokens.space3),
                          InkWell(
                            onTap: () => _pickDate(fim: true),
                            child: InputDecorator(
                              decoration: const InputDecoration(
                                labelText: 'Data final',
                              ),
                              child: Text(
                                dataFim == null
                                    ? 'Selecione'
                                    : formatDayHeader(dataFim!),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ],
                  ),
                if (error != null) ...[
                  const SizedBox(height: PulsoTokens.space3),
                  Text(
                    error!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                  ),
                ],
                const SizedBox(height: PulsoTokens.space5),
                FilledButton(
                  onPressed: submitting ? null : _salvar,
                  child: submitting
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Salvar'),
                ),
                if (isEdit) ...[
                  const SizedBox(height: PulsoTokens.space2),
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Theme.of(context).colorScheme.error,
                      side: BorderSide(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                    onPressed: submitting ? null : _excluir,
                    child: const Text('Excluir'),
                  ),
                ],
              ],
            ),
    );
  }
}
