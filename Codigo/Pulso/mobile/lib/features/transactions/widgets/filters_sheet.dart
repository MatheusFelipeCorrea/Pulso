import 'package:flutter/material.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';

Future<TransactionFilters?> showTransactionFiltersSheet({
  required BuildContext context,
  required TransactionFilters current,
  required TransactionFilterOptions? options,
}) {
  return showModalBottomSheet<TransactionFilters>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (context) => _FiltersSheet(current: current, options: options),
  );
}

class _FiltersSheet extends StatefulWidget {
  const _FiltersSheet({required this.current, required this.options});

  final TransactionFilters current;
  final TransactionFilterOptions? options;

  @override
  State<_FiltersSheet> createState() => _FiltersSheetState();
}

class _FiltersSheetState extends State<_FiltersSheet> {
  late String tipo;
  late String recurso;
  late String? categoriaId;
  late final TextEditingController busca;

  @override
  void initState() {
    super.initState();
    tipo = widget.current.tipo;
    recurso = widget.current.recurso;
    categoriaId = widget.current.categoriaId;
    busca = TextEditingController(text: widget.current.busca);
  }

  @override
  void dispose() {
    busca.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final options = widget.options;
    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 8,
        bottom: 20 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Filtros', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: tipo,
            decoration: const InputDecoration(labelText: 'Tipo'),
            items: (options?.tipos ?? const [
              FilterOption(value: 'TODOS', label: 'Todos'),
            ])
                .map((item) => DropdownMenuItem(value: item.value, child: Text(item.label)))
                .toList(),
            onChanged: (value) => setState(() => tipo = value ?? 'TODOS'),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: recurso,
            decoration: const InputDecoration(labelText: 'Recurso'),
            items: (options?.recursos ?? const [
              FilterOption(value: 'TODOS', label: 'Todos'),
            ])
                .map((item) => DropdownMenuItem(value: item.value, child: Text(item.label)))
                .toList(),
            onChanged: (value) => setState(() => recurso = value ?? 'TODOS'),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String?>(
            initialValue: categoriaId,
            decoration: const InputDecoration(labelText: 'Categoria'),
            items: [
              const DropdownMenuItem<String?>(value: null, child: Text('Todas')),
              ...?options?.categorias.map(
                (cat) => DropdownMenuItem<String?>(value: cat.id, child: Text(cat.nome)),
              ),
            ],
            onChanged: (value) => setState(() => categoriaId = value),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: busca,
            decoration: const InputDecoration(
              labelText: 'Busca',
              hintText: 'Descrição ou tag',
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: () {
              Navigator.pop(
                context,
                widget.current.copyWith(
                  tipo: tipo,
                  recurso: recurso,
                  categoriaId: categoriaId,
                  clearCategoria: categoriaId == null,
                  busca: busca.text,
                ),
              );
            },
            child: const Text('Aplicar'),
          ),
        ],
      ),
    );
  }
}
