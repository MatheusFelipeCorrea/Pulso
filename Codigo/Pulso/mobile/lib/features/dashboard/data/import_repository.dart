import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';

class ImportAnalise {
  const ImportAnalise({
    required this.origem,
    required this.linhas,
    required this.totalDetectadas,
    required this.duplicatas,
    this.precisaMapeamento = false,
    this.colunasDisponiveis = const [],
    this.saldoExtrato,
    this.arquivo,
    this.parser,
  });

  final String origem;
  final List<Map<String, dynamic>> linhas;
  final int totalDetectadas;
  final int duplicatas;
  final bool precisaMapeamento;
  final List<String> colunasDisponiveis;
  final double? saldoExtrato;
  final String? arquivo;
  final String? parser;

  factory ImportAnalise.fromJson(Map<String, dynamic> json) {
    final linhas = json['linhas'];
    final colunas = json['colunasDisponiveis'];
    return ImportAnalise(
      origem: json['origem'] as String? ?? 'CONTA',
      linhas: linhas is List
          ? linhas
                .whereType<Map>()
                .map((item) => Map<String, dynamic>.from(item))
                .toList()
          : const [],
      totalDetectadas: _int(json['totalDetectadas']),
      duplicatas: _int(json['duplicatas']),
      precisaMapeamento: json['precisaMapeamento'] == true,
      colunasDisponiveis: colunas is List
          ? colunas.map((item) => '$item').toList()
          : const [],
      saldoExtrato: json['saldoExtrato'] == null
          ? null
          : double.tryParse('${json['saldoExtrato']}'.replaceAll(',', '.')),
      arquivo: json['arquivo'] as String?,
      parser: json['parser'] as String?,
    );
  }

  static int _int(dynamic value) {
    if (value is num) return value.toInt();
    return int.tryParse('$value') ?? 0;
  }
}

class ImportConfirmacao {
  const ImportConfirmacao({
    required this.importadas,
    this.ajusteSaldo = false,
    this.saldoExtrato,
  });

  final int importadas;
  final bool ajusteSaldo;
  final double? saldoExtrato;

  factory ImportConfirmacao.fromJson(Map<String, dynamic> json) {
    return ImportConfirmacao(
      importadas: ImportAnalise._int(json['importadas']),
      ajusteSaldo: json['ajusteSaldo'] == true,
      saldoExtrato: json['saldoExtrato'] == null
          ? null
          : double.tryParse('${json['saldoExtrato']}'.replaceAll(',', '.')),
    );
  }
}

class ImportRepository {
  ImportRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<ImportAnalise> analisar({
    required MultipartFile arquivo,
    required String origem,
    Map<String, String>? mapeamento,
  }) {
    return _guard(() async {
      final form = FormData.fromMap({
        'arquivo': arquivo,
        'origem': origem,
        if (mapeamento != null && mapeamento.isNotEmpty)
          'mapeamento': jsonEncode(mapeamento),
      });
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/importacoes/analisar',
        data: form,
        options: Options(contentType: 'multipart/form-data'),
      );
      return ImportAnalise.fromJson(response.data ?? {});
    });
  }

  Future<ImportConfirmacao> confirmar({
    required String origem,
    required List<Map<String, dynamic>> linhas,
    double? saldoExtrato,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/importacoes/confirmar',
        data: {
          'origem': origem,
          'linhas': linhas,
          if (saldoExtrato != null) 'saldoExtrato': saldoExtrato,
        },
      );
      return ImportConfirmacao.fromJson(response.data ?? {});
    });
  }
}
