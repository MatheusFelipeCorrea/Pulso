import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/goals/data/goal_models.dart';

class GoalRepository {
  GoalRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<GoalResumo> obterResumo() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/metas/resumo',
      );
      return GoalResumo.fromJson(response.data ?? {});
    });
  }

  Future<GoalListPage> listar(GoalFilters filtros) {
    return _guard(() async {
      final response = await _api.raw.get<List<dynamic>>(
        '/metas',
        queryParameters: filtros.toQuery(),
      );
      final items = (response.data ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoMeta.fromJson)
          .toList();
      final headers = response.headers;
      return GoalListPage(
        metas: items,
        total:
            int.tryParse(headers.value('x-total-count') ?? '') ?? items.length,
        paginas: int.tryParse(headers.value('x-total-pages') ?? '') ?? 1,
        pagina:
            int.tryParse(headers.value('x-current-page') ?? '') ??
            filtros.pagina,
      );
    });
  }

  Future<ReservaEmergenciaSugestao> sugerirReserva({int? meses}) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/metas/sugestao-reserva-emergencia',
        queryParameters: {'meses': ?meses},
      );
      return ReservaEmergenciaSugestao.fromJson(response.data ?? {});
    });
  }

  Future<PulsoMeta> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/metas',
        data: payload,
      );
      return PulsoMeta.fromJson(response.data ?? {});
    });
  }

  Future<PulsoMeta> atualizar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/metas/$id',
        data: payload,
      );
      return PulsoMeta.fromJson(response.data ?? {});
    });
  }

  Future<PulsoMeta> registrarAporte(
    String id, {
    required double valor,
    required DateTime data,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/metas/$id/aportes',
        data: {'valor': valor, 'data': data.toUtc().toIso8601String()},
      );
      final body = response.data ?? {};
      final meta = body['meta'];
      if (meta is Map<String, dynamic>) return PulsoMeta.fromJson(meta);
      return PulsoMeta.fromJson(body);
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/metas/$id');
    });
  }

  Future<PulsoMeta> pausar(String id) => atualizar(id, {'status': 'PAUSADA'});

  Future<PulsoMeta> retomar(String id) => atualizar(id, {'status': 'ATIVA'});
}
