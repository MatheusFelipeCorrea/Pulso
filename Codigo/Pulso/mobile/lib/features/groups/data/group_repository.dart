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

  Future<PulsoGrupoPreview> previewPorCodigo(String codigo) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/grupos/preview',
        queryParameters: {'codigo': codigo},
      );
      return PulsoGrupoPreview.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> criar({
    required String nome,
    String? descricao,
    String? modoDivisao,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos',
        data: {
          'nome': nome,
          if (descricao != null && descricao.trim().isNotEmpty)
            'descricao': descricao.trim(),
          if (modoDivisao != null) 'modoDivisao': modoDivisao,
        },
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> editar(
    String id, {
    String? nome,
    String? descricao,
  }) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/grupos/$id',
        data: {
          if (nome != null) 'nome': nome.trim(),
          if (descricao != null) 'descricao': descricao.trim(),
        },
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> atualizarModoDivisao(String id, String modoDivisao) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/grupos/$id/modo-divisao',
        data: {'modoDivisao': modoDivisao},
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

  Future<PulsoGrupo> renovarCodigo(String id) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/$id/codigo/renovar',
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<void> removerMembro(String grupoId, String usuarioId) {
    return _guard(() async {
      await _api.raw.delete<void>('/grupos/$grupoId/membros/$usuarioId');
    });
  }

  Future<PulsoGrupo> alterarPapel(
    String grupoId,
    String usuarioId, {
    required String papel,
  }) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/grupos/$grupoId/membros/$usuarioId',
        data: {'papel': papel},
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<List<PulsoGrupoMensagem>> listarMensagens(
    String id, {
    int pagina = 1,
    int limite = 40,
  }) {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>(
        '/grupos/$id/mensagens',
        queryParameters: {'pagina': pagina, 'limite': limite},
      );
      final data = response.data;
      final lista = data is List
          ? data
          : (data is Map && data['mensagens'] is List)
          ? data['mensagens'] as List
          : const [];
      return lista
          .whereType<Map>()
          .map(
            (item) =>
                PulsoGrupoMensagem.fromJson(Map<String, dynamic>.from(item)),
          )
          .toList();
    });
  }

  Future<PulsoGrupoMensagem> enviarMensagem(
    String id, {
    required String texto,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/$id/mensagens',
        data: {'texto': texto.trim()},
      );
      return PulsoGrupoMensagem.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> criarMetas(String id, List<Map<String, dynamic>> metas) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/$id/metas',
        data: {'metas': metas},
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> registrarAporte(
    String id,
    String metaId, {
    required double valor,
    DateTime? data,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/$id/metas/$metaId/aportes',
        data: {
          'valor': valor,
          'data': (data ?? DateTime.now()).toUtc().toIso8601String(),
        },
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> criarViagem(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/grupos/$id/viagem',
        data: payload,
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> editarViagem(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>(
        '/grupos/$id/viagem',
        data: payload,
      );
      return PulsoGrupo.fromJson(response.data ?? {});
    });
  }

  Future<PulsoGrupo> desvincularViagem(String id) {
    return _guard(() async {
      final response = await _api.raw.delete<Map<String, dynamic>>(
        '/grupos/$id/viagem',
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
