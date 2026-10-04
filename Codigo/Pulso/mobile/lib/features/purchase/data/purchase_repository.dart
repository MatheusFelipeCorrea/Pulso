import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';

class PurchasePlanningRepository {
  PurchasePlanningRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<PurchasePainel> obterPainel() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>('/planejamento-compra');
      return PurchasePainel.fromJson(response.data ?? {});
    });
  }

  Future<PurchaseItem> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>('/planejamento-compra', data: payload);
      return PurchaseItem.fromJson(response.data ?? {});
    });
  }

  Future<PurchaseItem> atualizar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>('/planejamento-compra/$id', data: payload);
      return PurchaseItem.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete('/planejamento-compra/$id');
    });
  }

  Future<PurchaseItem> vincularMeta(String id, {required String metaId, bool ajustarMetaValor = false}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/planejamento-compra/$id/vincular-meta',
        data: {'metaId': metaId, 'ajustarMetaValor': ajustarMetaValor},
      );
      return PurchaseItem.fromJson(response.data ?? {});
    });
  }

  Future<PurchaseItem> comprar(String id) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/planejamento-compra/$id/comprar',
        data: const {},
      );
      return PurchaseItem.fromJson(response.data ?? {});
    });
  }
}
