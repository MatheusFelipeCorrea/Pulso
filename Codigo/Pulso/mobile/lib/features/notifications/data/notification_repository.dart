import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/notifications/data/notification_models.dart';

class NotificationRepository {
  NotificationRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<List<PulsoNotificacao>> listar({
    int pagina = 1,
    int limite = 30,
    bool? lida,
  }) {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>(
        '/notificacoes',
        queryParameters: {'pagina': pagina, 'limite': limite, 'lida': ?lida},
      );
      final data = response.data;
      final list = data is List
          ? data
          : (data is Map && data['notificacoes'] is List
                ? data['notificacoes'] as List
                : const []);
      return list
          .whereType<Map>()
          .map(
            (item) =>
                PulsoNotificacao.fromJson(Map<String, dynamic>.from(item)),
          )
          .toList();
    });
  }

  Future<int> contarNaoLidas() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/notificacoes/contador',
      );
      final data = response.data ?? const {};
      final q = data['quantidade'];
      if (q is int) return q;
      return int.tryParse('$q') ?? 0;
    });
  }

  Future<void> marcarComoLida(String id) {
    return _guard(() async {
      await _api.raw.patch('/notificacoes/$id/marcar-lida');
    });
  }

  Future<void> marcarTodasLidas() {
    return _guard(() async {
      await _api.raw.patch('/notificacoes/marcar-todas-lidas');
    });
  }
}
