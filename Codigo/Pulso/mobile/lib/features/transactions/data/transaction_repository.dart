import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';

class TransactionRepository {
  TransactionRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<TransactionFilterOptions> obterOpcoes() {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>('/transacoes/filtros');
      return TransactionFilterOptions.fromJson(response.data ?? {});
    });
  }

  Future<TransactionResumo> obterResumo(TransactionFilters filtros) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/transacoes/resumo',
        queryParameters: filtros.toQuery(pagina: 1)..remove('pagina')..remove('limite'),
      );
      return TransactionResumo.fromJson(response.data ?? {});
    });
  }

  Future<TransactionListPage> listar(TransactionFilters filtros, {required int pagina}) {
    return _guard(() async {
      final response = await _api.raw.get<List<dynamic>>(
        '/transacoes',
        queryParameters: filtros.toQuery(pagina: pagina),
      );
      final data = response.data;
      final items = (data is List ? data : const [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoTransacao.fromJson)
          .toList();
      final headers = response.headers;
      return TransactionListPage(
        transacoes: items,
        total: int.tryParse(headers.value('x-total-count') ?? '') ?? items.length,
        paginas: int.tryParse(headers.value('x-total-pages') ?? '') ?? 1,
        pagina: int.tryParse(headers.value('x-current-page') ?? '') ?? pagina,
      );
    });
  }

  Future<String?> sugerirCategoria({required String tipo, required String descricao}) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/transacoes/sugestao-categoria',
        queryParameters: {'tipo': tipo, 'descricao': descricao},
      );
      return response.data?['categoriaId'] as String?;
    });
  }

  Future<PulsoTransacao> criar(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>('/transacoes', data: payload);
      return PulsoTransacao.fromJson(response.data ?? {});
    });
  }

  Future<PulsoTransacao> atualizar(String id, Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.patch<Map<String, dynamic>>('/transacoes/$id', data: payload);
      return PulsoTransacao.fromJson(response.data ?? {});
    });
  }

  Future<void> excluir(String id, {bool excluirFuturas = false, DateTime? dataCorte}) {
    return _guard(() async {
      await _api.raw.delete<void>(
        '/transacoes/$id',
        queryParameters: {
          'excluirFuturas': excluirFuturas ? 'true' : 'false',
          if (excluirFuturas && dataCorte != null) 'dataCorte': dataCorte.toUtc().toIso8601String(),
        },
      );
    });
  }

  Future<List<PulsoCategoria>> listarCategorias() {
    return _guard(() async {
      final response = await _api.raw.get<List<dynamic>>('/categorias');
      return (response.data ?? [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoCategoria.fromJson)
          .toList();
    });
  }

  Future<PulsoCategoria> criarCategoria(Map<String, dynamic> payload) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>('/categorias', data: payload);
      return PulsoCategoria.fromJson(response.data ?? {});
    });
  }

  Future<void> excluirCategoria(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/categorias/$id');
    });
  }

  Future<List<PulsoTag>> listarTags() {
    return _guard(() async {
      final response = await _api.raw.get<List<dynamic>>('/tags');
      return (response.data ?? []).whereType<Map<String, dynamic>>().map(PulsoTag.fromJson).toList();
    });
  }

  Future<PulsoTag> criarTag({required String nome}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/tags',
        data: {'nome': nome.trim(), 'icone': 'Tag', 'cor': '#7C3AED'},
      );
      return PulsoTag.fromJson(response.data ?? {});
    });
  }

  Future<void> excluirTag(String id) {
    return _guard(() async {
      await _api.raw.delete<void>('/tags/$id');
    });
  }

  Future<List<String>> resolverTagIds({
    required List<String> ids,
    required List<String> nomesNovos,
  }) async {
    final resolved = [...ids];
    for (final nome in nomesNovos) {
      final tag = await criarTag(nome: nome);
      resolved.add(tag.id);
    }
    return resolved.toSet().toList();
  }
}
