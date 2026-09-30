import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/trips/data/trip_models.dart';

class TripRepository {
  TripRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  List<PulsoViagem> _parseList(dynamic data) {
    if (data is List) {
      return data.whereType<Map<String, dynamic>>().map(PulsoViagem.fromJson).toList();
    }
    if (data is Map<String, dynamic> && data['viagens'] is List) {
      return (data['viagens'] as List).whereType<Map<String, dynamic>>().map(PulsoViagem.fromJson).toList();
    }
    return const [];
  }

  Future<List<PulsoViagem>> listar() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/viagens');
      return _parseList(response.data);
    });
  }

  Future<PulsoViagem> obter(String id) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>('/viagens/$id');
      return PulsoViagem.fromJson(response.data ?? {});
    });
  }

  Future<List<TripDestinationHint>> listarDestinos({String? q}) {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>(
        '/viagens/destinos',
        queryParameters: {if (q != null && q.trim().isNotEmpty) 'q': q.trim()},
      );
      final data = response.data;
      final list = data is List
          ? data
          : (data is Map && data['destinos'] is List ? data['destinos'] as List : const []);
      return list.whereType<Map<String, dynamic>>().map(TripDestinationHint.fromJson).toList();
    });
  }

  Future<PulsoViagem> criar({
    required String destino,
    required String moeda,
    required DateTime dataPrevista,
    String? metaId,
    Map<String, dynamic>? destinoMeta,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/viagens',
        data: {
          'destino': destino,
          'moeda': moeda,
          'dataPrevista': DateTime(dataPrevista.year, dataPrevista.month, dataPrevista.day, 12)
              .toUtc()
              .toIso8601String(),
          'metaId': ?metaId,
          if (destinoMeta != null) 'destinoMeta': destinoMeta,
        },
      );
      return PulsoViagem.fromJson(response.data ?? {});
    });
  }

  Future<PulsoViagem> editar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>('/viagens/$id', data: payload);
      return PulsoViagem.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/viagens/$id');
    });
  }

  Future<PulsoViagem> criarDespesa(
    String viagemId, {
    required String categoria,
    required double valorEstimado,
    String? descricao,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/viagens/$viagemId/despesas',
        data: {
          'categoria': categoria,
          'valorEstimado': valorEstimado,
          'descricao': ?descricao,
        },
      );
      return PulsoViagem.fromJson(response.data ?? {});
    });
  }

  Future<void> excluirDespesa(String viagemId, String despesaId) {
    return _guard(() async {
      await _api.raw.delete<void>('/viagens/$viagemId/despesas/$despesaId');
    });
  }

  Future<PulsoViagem> criarObservacao(String viagemId, {required String titulo, required String conteudo}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/viagens/$viagemId/observacoes',
        data: {'titulo': titulo, 'conteudo': conteudo},
      );
      return PulsoViagem.fromJson(response.data ?? {});
    });
  }
}
