import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/calendar/data/reminder_visuals.dart';
import 'package:pulso/features/calendar/state/calendar_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class ReminderFormScreen extends StatefulWidget {
  const ReminderFormScreen({super.key, this.lembrete});

  final PulsoLembrete? lembrete;

  @override
  State<ReminderFormScreen> createState() => _ReminderFormScreenState();
}

class _ReminderFormScreenState extends State<ReminderFormScreen> {
  final _titulo = TextEditingController();
  final _valor = TextEditingController();
  DateTime _data = DateTime.now();
  String _hora = '10:00';
  String _antecedencia = 'UM_DIA';
  String _categoria = 'OUTRO';
  bool _repetirMensal = false;
  int _diaRecorrencia = 1;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final item = widget.lembrete;
    if (item != null) {
      _titulo.text = item.titulo;
      if (item.valor != null) _valor.text = item.valor!.toStringAsFixed(2);
      _data = item.dataVencimento;
      final hora = item.horaLembrete;
      _hora = hora.length >= 2
          ? '${hora.substring(0, 2).padLeft(2, '0')}:00'
          : '10:00';
      _antecedencia = item.antecedencia;
      _categoria = item.categoria;
      _repetirMensal = item.repetirMensal;
      _diaRecorrencia =
          item.diaRecorrencia ?? item.dataVencimento.day.clamp(1, 28);
    }
  }

  @override
  void dispose() {
    _titulo.dispose();
    _valor.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final titulo = _titulo.text.trim();
    if (titulo.isEmpty) {
      showPulsoSnack(context, 'Informe o título');
      return;
    }
    setState(() => _saving = true);
    try {
      final valor = parseMoney(_valor.text);
      await context.read<CalendarController>().salvarLembrete({
        'titulo': titulo,
        'valor': (valor ?? 0) > 0 ? valor : null,
        'dataVencimento': DateTime(
          _data.year,
          _data.month,
          _data.day,
          12,
        ).toUtc().toIso8601String(),
        'horaLembrete': _hora,
        'antecedencia': _antecedencia,
        'categoria': _categoria,
        'repetirMensal': _repetirMensal,
        if (_repetirMensal) 'diaRecorrencia': _diaRecorrencia,
      }, id: widget.lembrete?.id);
      if (!mounted) return;
      Navigator.pop(context);
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return PulsoFormScaffold(
      title: widget.lembrete == null ? 'Novo lembrete' : 'Editar lembrete',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          TextField(
            controller: _titulo,
            decoration: const InputDecoration(labelText: 'Título'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor (opcional)'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Data'),
            subtitle: Text(
              '${_data.day.toString().padLeft(2, '0')}/${_data.month.toString().padLeft(2, '0')}/${_data.year}',
            ),
            trailing: const Icon(Icons.event),
            onTap: () async {
              final next = await showDatePicker(
                context: context,
                initialDate: _data,
                firstDate: DateTime(2020),
                lastDate: DateTime(2100),
              );
              if (next != null) setState(() => _data = next);
            },
          ),
          DropdownButtonFormField<String>(
            initialValue: _hora,
            decoration: const InputDecoration(labelText: 'Hora do lembrete'),
            items: [
              for (var h = 0; h < 24; h++)
                DropdownMenuItem(
                  value: '${h.toString().padLeft(2, '0')}:00',
                  child: Text('${h.toString().padLeft(2, '0')}:00'),
                ),
            ],
            onChanged: (value) => setState(() => _hora = value ?? '10:00'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          DropdownButtonFormField<String>(
            initialValue: reminderAntecedenciaOptions.containsKey(_antecedencia)
                ? _antecedencia
                : 'UM_DIA',
            decoration: const InputDecoration(labelText: 'Antecedência'),
            items: reminderAntecedenciaOptions.entries
                .map(
                  (entry) => DropdownMenuItem(
                    value: entry.key,
                    child: Text(entry.value),
                  ),
                )
                .toList(),
            onChanged: (value) =>
                setState(() => _antecedencia = value ?? 'UM_DIA'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          DropdownButtonFormField<String>(
            initialValue: reminderCategoriaOptions.containsKey(_categoria)
                ? _categoria
                : 'OUTRO',
            decoration: const InputDecoration(labelText: 'Categoria'),
            items: reminderCategoriaOptions.entries.map((entry) {
              final meta = reminderMeta(entry.key);
              return DropdownMenuItem(
                value: entry.key,
                child: Row(
                  children: [
                    Icon(meta.icon, size: 18, color: meta.color),
                    const SizedBox(width: 10),
                    Text(entry.value),
                  ],
                ),
              );
            }).toList(),
            onChanged: (value) => setState(() => _categoria = value ?? 'OUTRO'),
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Repetir todo mês'),
            value: _repetirMensal,
            onChanged: (value) => setState(() => _repetirMensal = value),
          ),
          if (_repetirMensal)
            Slider(
              value: _diaRecorrencia.toDouble(),
              min: 1,
              max: 28,
              divisions: 27,
              label: 'Dia $_diaRecorrencia',
              onChanged: (value) =>
                  setState(() => _diaRecorrencia = value.round()),
            ),
          const SizedBox(height: PulsoTokens.space4),
          FilledButton(
            onPressed: _saving ? null : _save,
            child: Text(_saving ? 'Salvando...' : 'Salvar'),
          ),
        ],
      ),
    );
  }
}
