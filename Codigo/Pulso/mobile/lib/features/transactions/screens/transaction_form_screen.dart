import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
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
        final id = await widget.repository.sugerirCategoria(tipo: tipo, descricao: texto);
        if (!mounted || id == null) return;
        setState(() {
          categoriaId = id;
          sugerida = true;
        });
      } catch (_) {}
    });
  }

  List<PulsoCategoria> get _categoriasFiltradas {
    return (options?.categorias ?? []).where((cat) => cat.tipo == tipo).toList();
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

  void _addTag(String raw) {
    final nome = raw.trim();
    if (nome.isEmpty) return;
    if (tags.any((item) => item.nome.toLowerCase() == nome.toLowerCase())) return;
    final existente = (options?.tags ?? []).where((tag) => tag.nome.toLowerCase() == nome.toLowerCase());
    setState(() {
      tags.add((nome: nome, id: existente.isEmpty ? null : existente.first.id));
    });
    _tagInput.clear();
  }

  void _removeTag(String nome) {
    setState(() => tags.removeWhere((item) => item.nome == nome));
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
    final valor = parseMoney(_valor.text);
    final fieldErrors = <String>[];
    if (valor == null || valor <= 0) fieldErrors.add('Informe um valor maior que zero.');
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
      return;
    }

    setState(() {
      submitting = true;
      error = null;
    });
    try {
      final resolvedTags = await widget.repository.resolverTagIds(
        ids: [for (final tag in tags) if (tag.id != null) tag.id!],
        nomesNovos: [for (final tag in tags) if (tag.id == null) tag.nome],
      );
      final payload = <String, dynamic>{
        'tipo': tipo,
        'recurso': recurso,
        'valor': valor,
        'descricao': _descricao.text.trim().isEmpty ? null : _descricao.text.trim(),
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            isEdit
                ? 'Transação atualizada com sucesso!'
                : (recorrente
                    ? 'Transação recorrente criada! Ela será gerada automaticamente.'
                    : 'Transação criada com sucesso!'),
          ),
        ),
      );
      context.pop(true);
    } on ApiException catch (err) {
      if (mounted) setState(() => error = err.message);
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  Future<void> _excluir() async {
    final tx = widget.transacao;
    if (tx == null) return;
    final choice = await showDeleteTransactionDialog(context: context, transacao: tx);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? 'Editar transação' : 'Nova transação')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
              children: [
                SegmentedButton<String>(
                  showSelectedIcon: false,
                  segments: const [
                    ButtonSegment(value: 'RECEITA', label: Text('Receita')),
                    ButtonSegment(value: 'DESPESA', label: Text('Despesa')),
                    ButtonSegment(value: 'TRANSFERENCIA', label: Text('Transf.')),
                  ],
                  selected: {tipo},
                  onSelectionChanged: (value) {
                    setState(() {
                      tipo = value.first;
                      categoriaId = null;
                      recursoDestino = null;
                      sugerida = false;
                    });
                  },
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _valor,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Valor', prefixText: 'R\$ '),
                ),
                const SizedBox(height: 12),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Data'),
                  subtitle: Text(formatDayHeader(data)),
                  trailing: const Icon(Icons.calendar_today_outlined),
                  onTap: () => _pickDate(fim: false),
                ),
                if (!isTransferencia) ...[
                  DropdownButtonFormField<String?>(
                    key: ValueKey('categoria-$tipo-$categoriaId'),
                    initialValue: categoriaId,
                    decoration: const InputDecoration(labelText: 'Categoria'),
                    items: [
                      const DropdownMenuItem<String?>(value: null, child: Text('Selecione')),
                      ..._categoriasFiltradas.map(
                        (cat) => DropdownMenuItem<String?>(value: cat.id, child: Text(cat.nome)),
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
                    decoration: const InputDecoration(labelText: 'Recurso de destino'),
                    items: [
                      const DropdownMenuItem<String?>(value: null, child: Text('Selecione')),
                      ..._recursos
                          .where((item) => item.value != recurso)
                          .map((item) => DropdownMenuItem<String?>(value: item.value, child: Text(item.label))),
                    ],
                    onChanged: (value) => setState(() => recursoDestino = value),
                  ),
                const SizedBox(height: 12),
                TextField(
                  controller: _descricao,
                  decoration: const InputDecoration(
                    labelText: 'Descrição',
                    hintText: 'Ex: Almoço no RU',
                  ),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String?>(
                  key: ValueKey('origem-$recurso'),
                  initialValue: recurso,
                  decoration: const InputDecoration(labelText: 'Recurso de origem'),
                  items: [
                    const DropdownMenuItem<String?>(value: null, child: Text('Selecione')),
                    ..._recursos
                        .where((item) => item.value != recursoDestino)
                        .map((item) => DropdownMenuItem<String?>(value: item.value, child: Text(item.label))),
                  ],
                  onChanged: (value) => setState(() => recurso = value),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final tag in tags)
                      InputChip(label: Text(tag.nome), onDeleted: () => _removeTag(tag.nome)),
                  ],
                ),
                TextField(
                  controller: _tagInput,
                  decoration: const InputDecoration(
                    labelText: 'Tags',
                    hintText: 'faculdade, almoço...',
                  ),
                  onSubmitted: _addTag,
                ),
                if (!isEdit) ...[
                  const SizedBox(height: 8),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Repetir automaticamente'),
                    value: recorrente,
                    onChanged: (value) => setState(() => recorrente = value),
                  ),
                  if (recorrente) ...[
                    DropdownButtonFormField<String>(
                      initialValue: frequencia,
                      decoration: const InputDecoration(labelText: 'Frequência'),
                      items: (options?.frequencias ?? const [
                        FilterOption(value: 'MENSAL', label: 'Mensal'),
                      ])
                          .map((item) => DropdownMenuItem(value: item.value, child: Text(item.label)))
                          .toList(),
                      onChanged: (value) => setState(() => frequencia = value ?? 'MENSAL'),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: ateQuando,
                      decoration: const InputDecoration(labelText: 'Até quando'),
                      items: (options?.ateQuando ?? const [
                        FilterOption(value: 'SEM_FIM', label: 'Sem fim'),
                      ])
                          .map((item) => DropdownMenuItem(value: item.value, child: Text(item.label)))
                          .toList(),
                      onChanged: (value) => setState(() => ateQuando = value ?? 'SEM_FIM'),
                    ),
                    if (ateQuando == 'DATA')
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Data final'),
                        subtitle: Text(dataFim == null ? 'Selecione' : formatDayHeader(dataFim!)),
                        onTap: () => _pickDate(fim: true),
                      ),
                  ],
                ],
                if (error != null) ...[
                  const SizedBox(height: 12),
                  Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                ],
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: submitting ? null : _salvar,
                  child: submitting
                      ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Text('Salvar'),
                ),
                if (isEdit) ...[
                  const SizedBox(height: 8),
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(foregroundColor: PulsoColors.danger),
                    onPressed: submitting ? null : _excluir,
                    child: const Text('Excluir'),
                  ),
                ],
              ],
            ),
    );
  }
}
