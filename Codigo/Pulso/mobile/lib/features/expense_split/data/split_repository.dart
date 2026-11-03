import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';

class ExpenseSplitRepository {
  ExpenseSplitRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  List<PulsoDivisao> _lista(dynamic data) {
    if (data is List) {
      return data
          .whereType<Map>()
          .map((item) => PulsoDivisao.fromJson(Map<String, dynamic>.from(item)))
          .toList();
    }
    if (data is Map && data['divisoes'] is List) {
      return _lista(data['divisoes']);
    }
    return const [];
  }

  Future<List<PulsoDivisao>> listarAtivas() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/divisoes/ativas');
      return _lista(response.data);
    });
  }

  Future<SplitPage> listarHistorico({int pagina = 1}) {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>(
        '/divisoes/historico',
        queryParameters: {'pagina': pagina, 'limite': 20},
      );
      final divisoes = _lista(response.data);
      final total =
          int.tryParse(response.headers.value('x-total-count') ?? '') ??
          divisoes.length;
      final paginas =
          int.tryParse(response.headers.value('x-total-pages') ?? '') ?? 1;
      return SplitPage(divisoes: divisoes, total: total, paginas: paginas);
    });
  }

  Future<SplitResumo> resumo() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/divisoes/resumo',
      );
      return SplitResumo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivisao> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/divisoes',
        data: payload,
      );
      return PulsoDivisao.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivisao> atualizar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/divisoes/$id',
        data: payload,
      );
      return PulsoDivisao.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivisao> marcarPago(String id, String participanteId) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/divisoes/$id/participantes/$participanteId/pagar',
      );
      return PulsoDivisao.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivisao> desmarcarPago(String id, String participanteId) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/divisoes/$id/participantes/$participanteId/despagar',
      );
      return PulsoDivisao.fromJson(response.data ?? {});
    });
  }

  Future<void> criarLembrete(String id, {Map<String, dynamic>? payload}) {
    return _guard(() async {
      await _api.raw.post<void>(
        '/divisoes/$id/lembrete',
        data: payload ?? const {},
      );
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/divisoes/$id');
    });
  }
}
