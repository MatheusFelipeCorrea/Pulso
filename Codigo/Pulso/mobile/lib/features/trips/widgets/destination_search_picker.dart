import 'dart:async';

import 'package:flutter/material.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

class DestinationSearchPicker extends StatefulWidget {
  const DestinationSearchPicker({
    super.key,
    required this.repository,
    required this.controller,
    this.initialMeta,
    this.onSelected,
  });

  final TripRepository repository;
  final TextEditingController controller;
  final Map<String, dynamic>? initialMeta;
  final void Function(TripDestinationHint hint, Map<String, dynamic> meta)?
  onSelected;

  @override
  State<DestinationSearchPicker> createState() =>
      _DestinationSearchPickerState();
}

class _DestinationSearchPickerState extends State<DestinationSearchPicker> {
  final _focus = FocusNode();
  Timer? _debounce;
  List<TripDestinationHint> _suggestions = const [];
  bool _searching = false;
  bool _open = false;
  String? _error;
  Map<String, dynamic>? _selectedMeta;
  int _requestId = 0;

  @override
  void initState() {
    super.initState();
    _selectedMeta = widget.initialMeta;
    widget.controller.addListener(_onQueryChanged);
    _focus.addListener(() {
      if (_focus.hasFocus) {
        setState(() => _open = true);
        _search(widget.controller.text);
      }
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    widget.controller.removeListener(_onQueryChanged);
    _focus.dispose();
    super.dispose();
  }

  void _onQueryChanged() {
    _selectedMeta = null;
    _debounce?.cancel();
    final q = widget.controller.text.trim();
    if (!_focus.hasFocus) return;
    setState(() => _open = true);
    _debounce = Timer(const Duration(milliseconds: 280), () => _search(q));
  }

  Future<void> _search(String q) async {
    final requestId = ++_requestId;
    if (q.length < 2) {
      if (!mounted) return;
      setState(() {
        _suggestions = const [];
        _searching = false;
        _error = null;
      });
      return;
    }
    setState(() {
      _searching = true;
      _error = null;
    });
    try {
      final list = await widget.repository.listarDestinos(q: q);
      if (!mounted || requestId != _requestId) return;
      setState(() {
        _suggestions = list;
        _searching = false;
      });
    } on ApiException catch (err) {
      if (!mounted || requestId != _requestId) return;
      setState(() {
        _suggestions = const [];
        _searching = false;
        _error = err.message;
      });
    } catch (_) {
      if (!mounted || requestId != _requestId) return;
      setState(() {
        _suggestions = const [];
        _searching = false;
        _error = 'Não foi possível buscar destinos.';
      });
    }
  }

  void _select(TripDestinationHint hint) {
    final meta = hint.toDestinoMeta();
    if (meta == null) return;
    widget.controller.text = hint.label.isNotEmpty
        ? hint.label
        : (hint.raw['destino'] as String? ?? '');
    widget.controller.selection = TextSelection.collapsed(
      offset: widget.controller.text.length,
    );
    _selectedMeta = meta;
    setState(() {
      _open = false;
      _suggestions = const [];
    });
    _focus.unfocus();
    widget.onSelected?.call(hint, meta);
  }

  Map<String, dynamic>? get selectedMeta => _selectedMeta;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          controller: widget.controller,
          focusNode: _focus,
          decoration: InputDecoration(
            labelText: 'Destino',
            hintText: 'Digite para buscar…',
            suffixIcon: _searching
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  )
                : const Icon(Icons.search),
          ),
        ),
        if (_open &&
            (widget.controller.text.trim().length >= 2 ||
                _suggestions.isNotEmpty ||
                _error != null)) ...[
          const SizedBox(height: PulsoTokens.space2),
          Material(
            elevation: 2,
            borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
            color: Theme.of(context).colorScheme.surface,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 220),
              child: _error != null
                  ? Padding(
                      padding: const EdgeInsets.all(PulsoTokens.space3),
                      child: Text(
                        _error!,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                    )
                  : _suggestions.isEmpty && !_searching
                  ? const Padding(
                      padding: EdgeInsets.all(PulsoTokens.space3),
                      child: Text('Nenhum destino encontrado'),
                    )
                  : ListView.separated(
                      shrinkWrap: true,
                      itemCount: _suggestions.length,
                      separatorBuilder: (_, _) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final hint = _suggestions[index];
                        final subtitle =
                            hint.raw['subtitle'] as String? ??
                            hint.raw['countryName'] as String? ??
                            '';
                        return ListTile(
                          dense: true,
                          title: Text(hint.label),
                          subtitle: subtitle.isEmpty ? null : Text(subtitle),
                          trailing: Text(
                            hint.moedaSugerida,
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                          onTap: () => _select(hint),
                        );
                      },
                    ),
            ),
          ),
        ],
      ],
    );
  }
}
