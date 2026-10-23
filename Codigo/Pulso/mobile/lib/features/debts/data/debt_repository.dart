import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/debts/data/debt_models.dart';

class DebtRepository {
  DebtRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  int _header(Response<dynamic> response, String name, int fallback) {
    final raw = response.headers.value(name);
    return int.tryParse(raw ?? '') ?? fallback;
  }

  Future<DebtPage> listar({int pagina = 1, int limite = 50}) {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>(
        '/dividas',
        queryParameters: {'pagina': pagina, 'limite': limite},
      );
      final data = response.data;
      final dividas = data is List
          ? data
                .whereType<Map>()
                .map(
                  (item) =>
                      PulsoDivida.fromJson(Map<String, dynamic>.from(item)),
                )
                .toList()
          : <PulsoDivida>[];
      return DebtPage(
        dividas: dividas,
        total: _header(response, 'x-total-count', dividas.length),
        paginas: _header(response, 'x-total-pages', 1),
        pagina: _header(response, 'x-current-page', pagina),
      );
    });
  }

  Future<DebtResumo> resumo() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/dividas/resumo',
      );
      return DebtResumo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivida> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/dividas',
        data: payload,
      );
      return PulsoDivida.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivida> registrarPagamento(String id, {required double valor}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/dividas/$id/pagamentos',
        data: {
          'valor': valor,
          'dataPagamento': DateTime.now().toUtc().toIso8601String(),
        },
      );
      return PulsoDivida.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivida> quitar(String id) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/dividas/$id/quitar',
      );
      return PulsoDivida.fromJson(response.data ?? {});
    });
  }

  Future<PulsoDivida> reabrir(String id) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/dividas/$id/reabrir',
      );
      return PulsoDivida.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/dividas/$id');
    });
  }
}
