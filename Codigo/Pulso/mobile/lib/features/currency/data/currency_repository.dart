import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/currency/data/currency_models.dart';

class CurrencyRepository {
  CurrencyRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<List<CurrencyItem>> obterCatalogo() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/moedas/catalogo');
      final data = response.data;
      final list = data is List
          ? data
          : (data is Map && data['moedas'] is List ? data['moedas'] as List : const []);
      return list.whereType<Map<String, dynamic>>().map(CurrencyItem.fromJson).toList();
    });
  }

  Future<CurrencyConversion> converter({
    required double valor,
    String de = 'BRL',
    String para = 'USD',
  }) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/moedas/converter',
        queryParameters: {'valor': valor, 'de': de, 'para': para},
      );
      return CurrencyConversion.fromJson(response.data ?? {});
    });
  }

  Future<List<FavoriteCurrency>> listarFavoritas() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/moedas/favoritas');
      final data = response.data;
      final list = data is List
          ? data
          : (data is Map && data['favoritas'] is List ? data['favoritas'] as List : const []);
      return list.whereType<Map<String, dynamic>>().map(FavoriteCurrency.fromJson).toList();
    });
  }

  Future<void> adicionarFavorita(String codigo) {
    return _guard(() async {
      await _api.raw.post<void>('/moedas/favoritas', data: {'codigo': codigo});
    });
  }

  Future<void> removerFavorita(String codigo) {
    return _guard(() async {
      await _api.raw.delete<void>('/moedas/favoritas/$codigo');
    });
  }
}
