import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/groups/data/group_models.dart';

class GroupRepository {
  GroupRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  List<PulsoGrupo> _parseList(dynamic data) {
    if (data is List) {
      return data
          .whereType<Map>()
          .map((item) => PulsoGrupo.fromJson(Map<String, dynamic>.from(item)))
          .toList();
    }
    if (data is Map && data['grupos'] is List) {
      return (data['grupos'] as List)
          .whereType<Map>()
          .map((item) => PulsoGrupo.fromJson(Map<String, dynamic>.from(item)))
          .toList();
    }
    return const [];
  }

  Future<List<PulsoGrupo>> listar() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/grupos');
      return _parseList(response.data);
    });
  }

  Future<PulsoGrupo> obter(String id) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>('/grupos/$id');
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> criar({required String nome, String? descricao}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos',
        data: {
          'nome': nome,
          if (descricao != null && descricao.trim().isNotEmpty)
            'descricao': descricao.trim(),
        },
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> entrar({required String codigoConvite}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/entrar',
        data: {'codigoConvite': codigoConvite},
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/grupos/$id');
    });
  }

  Future<void> sair(String id) {
    return _guard(() async {
      await _api.raw.post<void>('/grupos/$id/sair');
    });
  }
}
