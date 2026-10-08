import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';

class CalendarRepository {
  CalendarRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<CalendarMonthView> obterMes(String mes) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/calendario/mes',
        queryParameters: {'mes': mes},
      );
      return CalendarMonthView.fromJson(response.data ?? {});
    });
  }

  Future<CalendarDayDetail> obterDia(String data) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/calendario/dia',
        queryParameters: {'data': data},
      );
      return CalendarDayDetail.fromJson(response.data ?? {});
    });
  }

  Future<GoogleCalendarStatus> googleStatus() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/calendario/google/status',
      );
      return GoogleCalendarStatus.fromJson(response.data ?? {});
    });
  }
}

class ReminderRepository {
  ReminderRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<List<PulsoLembrete>> listar({String? mes}) {
    return _guard(() async {
      final response = await _api.raw.get<List<dynamic>>(
        '/lembretes',
        queryParameters: {if (mes != null) 'mes': mes},
      );
      return (response.data ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoLembrete.fromJson)
          .toList();
    });
  }

  Future<PulsoLembrete> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/lembretes',
        data: payload,
      );
      return PulsoLembrete.fromJson(response.data ?? {});
    });
  }

  Future<PulsoLembrete> atualizar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/lembretes/$id',
        data: payload,
      );
      return PulsoLembrete.fromJson(response.data ?? {});
    });
  }

  Future<PulsoLembrete> pagar(String id) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/lembretes/$id/pagar',
      );
      return PulsoLembrete.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete('/lembretes/$id');
    });
  }
}
