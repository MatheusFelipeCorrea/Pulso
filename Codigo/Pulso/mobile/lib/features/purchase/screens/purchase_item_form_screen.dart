import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/purchase/data/purchase_repository.dart';
import 'package:pulso/features/purchase/state/purchase_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class PurchaseItemFormScreen extends StatefulWidget {
  const PurchaseItemFormScreen({super.key, this.item});

  final PurchaseItem? item;

  @override
  State<PurchaseItemFormScreen> createState() => _PurchaseItemFormScreenState();
}

class _PurchaseItemFormScreenState extends State<PurchaseItemFormScreen> {
  final _nome = TextEditingController();
  final _valor = TextEditingController();
  final _obs = TextEditingController();
  final _link = TextEditingController();
  final _imagem = TextEditingController();
  String _prioridade = 'MEDIA';
  String _categoria = 'OUTROS';
  bool _simular = true;
  int _parcelas = 12;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final item = widget.item;
    if (item != null) {
      _nome.text = item.nome;
      _valor.text = item.valorEstimado.toStringAsFixed(2);
      _obs.text = item.observacoes ?? '';
      _link.text = item.linkProduto ?? '';
      _imagem.text = item.imagemUrl ?? '';
      _prioridade = item.prioridade;
      _categoria = item.categoria;
      _simular = item.simularParcelas;
      _parcelas = item.parcelas;
    }
  }

  @override
  void dispose() {
    _nome.dispose();
    _valor.dispose();
    _obs.dispose();
    _link.dispose();
    _imagem.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final nome = _nome.text.trim();
    final valor = parseMoney(_valor.text);
    if (nome.isEmpty || valor == null || valor <= 0) {
      showPulsoSnack(context, 'Informe nome e valor');
      return;
    }
    setState(() => _saving = true);
    try {
      final repo = context.read<PurchasePlanningRepository>();
      final payload = {
        'nome': nome,
        'valorEstimado': valor,
        'prioridade': _prioridade,
        'categoria': _categoria,
        'observacoes': _obs.text.trim().isEmpty ? null : _obs.text.trim(),
        'linkProduto': _link.text.trim().isEmpty ? null : _link.text.trim(),
        'imagemUrl': _imagem.text.trim().isEmpty ? null : _imagem.text.trim(),
        'buscarImagemAuto': true,
        'simularParcelas': _simular,
        'parcelas': _parcelas,
      };
      if (widget.item == null) {
        await repo.criar(payload);
      } else {
        await repo.atualizar(widget.item!.id, payload);
      }
      if (!mounted) return;
      await context.read<PurchaseController>().reload();
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
      title: widget.item == null ? 'Novo item' : 'Editar item',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          TextField(controller: _nome, decoration: const InputDecoration(labelText: 'Nome')),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _valor,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(labelText: 'Valor estimado'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          DropdownButtonFormField<String>(
            initialValue: _prioridade,
            decoration: const InputDecoration(labelText: 'Prioridade'),
            items: const [
              DropdownMenuItem(value: 'ALTA', child: Text('Alta')),
              DropdownMenuItem(value: 'MEDIA', child: Text('Média')),
              DropdownMenuItem(value: 'BAIXA', child: Text('Baixa')),
            ],
            onChanged: (value) => setState(() => _prioridade = value ?? 'MEDIA'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          DropdownButtonFormField<String>(
            initialValue: purchaseCategorias.containsKey(_categoria) ? _categoria : 'OUTROS',
            decoration: const InputDecoration(labelText: 'Categoria'),
            items: purchaseCategorias.entries.map((entry) {
              final look = purchaseLook(entry.key);
              return DropdownMenuItem(
                value: entry.key,
                child: Row(
                  children: [
                    Icon(iconFromLucide(look.lucide), size: 18, color: look.color),
                    const SizedBox(width: 10),
                    Text(entry.value),
                  ],
                ),
              );
            }).toList(),
            onChanged: (value) => setState(() => _categoria = value ?? 'OUTROS'),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _link,
            decoration: const InputDecoration(labelText: 'Link do produto', prefixIcon: Icon(Icons.link)),
          ),
          const SizedBox(height: PulsoTokens.space3),
          TextField(
            controller: _imagem,
            decoration: const InputDecoration(labelText: 'URL da imagem', prefixIcon: Icon(Icons.image_outlined)),
            onChanged: (_) => setState(() {}),
          ),
          if (_imagem.text.trim().isNotEmpty) ...[
            const SizedBox(height: PulsoTokens.space3),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                _imagem.text.trim(),
                height: 120,
                width: double.infinity,
                fit: BoxFit.cover,
                webHtmlElementStrategy: WebHtmlElementStrategy.prefer,
                errorBuilder: (_, _, _) {
                  final look = purchaseLook(_categoria);
                  return CategoryGlyph(icone: look.lucide, color: look.color, size: 72);
                },
              ),
            ),
          ],
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Simular parcelas'),
            value: _simular,
            onChanged: (value) => setState(() => _simular = value),
          ),
          if (_simular)
            Slider(
              value: _parcelas.toDouble(),
              min: 1,
              max: 48,
              divisions: 47,
              label: '$_parcelas x',
              onChanged: (value) => setState(() => _parcelas = value.round()),
            ),
          TextField(controller: _obs, maxLines: 3, decoration: const InputDecoration(labelText: 'Observações')),
          const SizedBox(height: PulsoTokens.space4),
          FilledButton(onPressed: _saving ? null : _save, child: Text(_saving ? 'Salvando...' : 'Salvar')),
        ],
      ),
    );
  }
}
