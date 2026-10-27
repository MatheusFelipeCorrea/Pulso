import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/dashboard/data/import_repository.dart';
import 'package:pulso/features/dashboard/state/dashboard_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class ImportStatementScreen extends StatefulWidget {
  const ImportStatementScreen({super.key});

  @override
  State<ImportStatementScreen> createState() => _ImportStatementScreenState();
}

class _ImportStatementScreenState extends State<ImportStatementScreen> {
  static const _tipos = [
    (id: 'CONTA', label: 'Extrato da conta', desc: 'Bancos e contas digitais'),
    (id: 'VA', label: 'Vale-Alimentação', desc: 'Pluxee, Swile e demais'),
    (id: 'VR', label: 'Vale-Refeição', desc: 'Pluxee, Alelo e demais'),
  ];

  String? _origem;
  ImportAnalise? _analise;
  bool _loading = false;
  String _step = 'pick';
  final Map<String, String> _mapeamento = {};

  Future<void> _escolherPdf(String origem) async {
    final result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['pdf'],
      withData: true,
    );
    final file = result?.files.single;
    if (file == null) return;
    final bytes = file.bytes;
    if (bytes == null) {
      if (!mounted) return;
      showPulsoSnack(context, 'Não foi possível ler o PDF neste dispositivo');
      return;
    }
    setState(() {
      _origem = origem;
      _loading = true;
    });
    try {
      final analise = await context.read<ImportRepository>().analisar(
        arquivo: MultipartFile.fromBytes(
          bytes,
          filename: file.name.isEmpty ? 'extrato.pdf' : file.name,
        ),
        origem: origem,
        mapeamento: _mapeamento.isEmpty ? null : Map.of(_mapeamento),
      );
      if (!mounted) return;
      if (analise.precisaMapeamento) {
        setState(() {
          _analise = analise;
          _step = 'mapping';
        });
        return;
      }
      setState(() {
        _analise = analise;
        _origem = analise.origem;
        _step = 'preview';
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _aplicarMapeamento() async {
    final origem = _origem;
    if (origem == null) return;
    final result = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['pdf'],
      withData: true,
    );
    final file = result?.files.single;
    final bytes = file?.bytes;
    if (bytes == null) {
      if (!mounted) return;
      showPulsoSnack(
        context,
        'Selecione o PDF novamente após mapear as colunas',
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final analise = await context.read<ImportRepository>().analisar(
        arquivo: MultipartFile.fromBytes(
          bytes,
          filename: file!.name.isEmpty ? 'extrato.pdf' : file.name,
        ),
        origem: origem,
        mapeamento: Map.of(_mapeamento),
      );
      if (!mounted) return;
      setState(() {
        _analise = analise;
        _origem = analise.origem;
        _step = 'preview';
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _confirmar() async {
    final analise = _analise;
    final origem = _origem ?? analise?.origem;
    if (analise == null || origem == null) return;
    setState(() => _loading = true);
    try {
      final linhas = analise.linhas
          .where((linha) => linha['duplicata'] != true)
          .where((linha) => linha['incluir'] != false)
          .map((linha) {
            return {
              'id': linha['id'],
              'data': linha['data'],
              'valor': linha['valor'],
              'descricao': linha['descricao'],
              'tipo': linha['tipo'],
              'categoriaId': linha['categoriaId'],
              'incluir': true,
            };
          })
          .where((linha) => '${linha['categoriaId'] ?? ''}'.isNotEmpty)
          .toList();
      final resultado = await context.read<ImportRepository>().confirmar(
        origem: origem,
        linhas: linhas,
        saldoExtrato: analise.saldoExtrato,
      );
      if (!mounted) return;
      showPulsoSnack(
        context,
        resultado.importadas > 0
            ? '${resultado.importadas} lançamento(s) importado(s)'
            : 'Importação concluída',
      );
      await context.read<DashboardController>().reload();
      if (!mounted) return;
      context.pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    return PulsoFormScaffold(
      title: 'Importar extrato',
      child: ListView(
        padding: const EdgeInsets.all(PulsoTokens.space4),
        children: [
          const PulsoPageHeader(
            title: 'Importar extrato',
            subtitle: 'PDF da conta, VA ou VR — mesmo fluxo da web.',
            icon: Icons.upload_file_outlined,
          ),
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: PulsoTokens.space6),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_step == 'pick') ...[
            for (final tipo in _tipos)
              PulsoSurface(
                margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
                onTap: () => _escolherPdf(tipo.id),
                child: Row(
                  children: [
                    PulsoSoftIcon(
                      icon: tipo.id == 'CONTA'
                          ? Icons.account_balance_outlined
                          : Icons.restaurant_outlined,
                      color: PulsoColors.accent(brightness),
                    ),
                    const SizedBox(width: PulsoTokens.space3),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            tipo.label,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          Text(
                            tipo.desc,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right),
                  ],
                ),
              ),
          ] else if (_step == 'mapping' && _analise != null) ...[
            Text(
              'Mapeie as colunas detectadas e selecione o PDF de novo.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: PulsoTokens.space3),
            for (final coluna in const ['data', 'valor', 'descricao', 'tipo'])
              DropdownButtonFormField<String>(
                initialValue: _mapeamento[coluna],
                decoration: InputDecoration(labelText: 'Coluna $coluna'),
                items: [
                  for (final disponivel in _analise!.colunasDisponiveis)
                    DropdownMenuItem(
                      value: disponivel,
                      child: Text(disponivel),
                    ),
                ],
                onChanged: (value) {
                  if (value == null) return;
                  setState(() => _mapeamento[coluna] = value);
                },
              ),
            const SizedBox(height: PulsoTokens.space4),
            FilledButton(
              onPressed: _aplicarMapeamento,
              child: const Text('Aplicar mapeamento'),
            ),
          ] else if (_step == 'preview' && _analise != null) ...[
            PulsoSurface(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Origem ${_analise!.origem}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(
                    '${_analise!.totalDetectadas} detectadas · ${_analise!.duplicatas} duplicatas',
                  ),
                  if (_analise!.saldoExtrato != null)
                    Text(
                      'Saldo do extrato ${formatBrl(_analise!.saldoExtrato!)}',
                    ),
                  if ((_analise!.arquivo ?? '').isNotEmpty)
                    Text(_analise!.arquivo!),
                ],
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            ..._analise!.linhas
                .take(40)
                .map(
                  (linha) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('${linha['descricao'] ?? 'Lançamento'}'),
                    subtitle: Text(
                      '${linha['data'] ?? ''} · ${linha['tipo'] ?? ''}',
                    ),
                    trailing: Text(
                      formatBrl(
                        double.tryParse(
                              '${linha['valor']}'.replaceAll(',', '.'),
                            ) ??
                            0,
                      ),
                    ),
                  ),
                ),
            const SizedBox(height: PulsoTokens.space4),
            FilledButton(
              onPressed: _confirmar,
              child: const Text('Confirmar importação'),
            ),
            TextButton(
              onPressed: () => setState(() {
                _step = 'pick';
                _analise = null;
                _mapeamento.clear();
              }),
              child: const Text('Escolher outro arquivo'),
            ),
          ],
        ],
      ),
    );
  }
}
