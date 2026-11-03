import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';

class DashboardRepository {
  DashboardRepository(this._api);

  final ApiClient _api;

  Future<PulsoDashboard> obter({required String mes}) async {
    try {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/dashboard',
        queryParameters: {'mes': mes},
      );
      return PulsoDashboard.fromJson(response.data ?? {});
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }
}
