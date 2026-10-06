import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/budget/data/budget_models.dart';

class BudgetRepository {
  BudgetRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<BudgetStatus> obterStatus({String? mes}) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/orcamentos/status',
        queryParameters: {if (mes != null) 'mes': mes},
      );
      return BudgetStatus.fromJson(response.data ?? {});
    });
  }

  Future<void> salvarLimites({required String mesReferencia, required List<BudgetLimiteInput> limites}) {
    return _guard(() async {
      await _api.raw.post<Map<String, dynamic>>(
        '/orcamentos',
        data: {
          'mesReferencia': mesReferencia,
          'limites': limites.map((item) => item.toJson()).toList(),
        },
      );
    });
  }

  Future<void> copiarMes({required String mesOrigem, required String mesDestino}) {
    return _guard(() async {
      await _api.raw.post<Map<String, dynamic>>(
        '/orcamentos/copiar',
        data: {'mesOrigem': mesOrigem, 'mesDestino': mesDestino},
      );
    });
  }
}
