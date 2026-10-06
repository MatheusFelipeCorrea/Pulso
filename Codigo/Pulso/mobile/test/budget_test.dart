import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/budget/data/budget_models.dart';
import 'package:pulso/features/budget/data/budget_repository.dart';

class _ScriptedAdapter implements HttpClientAdapter {
  _ScriptedAdapter(this._handler);
  final Future<ResponseBody> Function(RequestOptions options) _handler;
  @override
  void close({bool force = false}) {}
  @override
  Future<ResponseBody> fetch(RequestOptions options, Stream<Uint8List>? requestStream, Future<void>? cancelFuture) {
    return _handler(options);
  }
}

ResponseBody _json(int status, Object body) {
  return ResponseBody.fromString(
    jsonEncode(body),
    status,
    headers: {Headers.contentTypeHeader: [Headers.jsonContentType]},
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    FlutterSecureStorage.setMockInitialValues({'pulso_access': 'access-token', 'pulso_refresh': 'refresh-token'});
  });

  test('BudgetStatus parseia resumo, categorias e categorias sem orçamento', () {
    final status = BudgetStatus.fromJson({
      'mesReferencia': '2026-10-01',
      'mesQuery': '2026-10',
      'rendaMensalPlanejada': '4000.00',
      'resumo': {
        'orcamentoTotal': '1500.00',
        'gastoTotal': '800.00',
        'restanteTotal': '700.00',
        'percentualUsado': '53.3',
        'orcamentoExcedeRenda': false,
      },
      'categorias': [
        {
          'categoriaId': 'c1',
          'categoriaNome': 'Moradia',
          'limiteValor': '1000.00',
          'gastoValor': '900.00',
          'restanteValor': '100.00',
          'percentualUsado': '90',
          'status': 'alerta',
          'rolloverAtivo': true,
          'valorRollover': '50.00',
        },
      ],
      'categoriasSemOrcamento': [
        {'id': 'c2', 'nome': 'Lazer'},
      ],
    });
    expect(status.resumo.gastoTotal, 800);
    expect(status.categorias.single.status, 'alerta');
    expect(status.categoriasSemOrcamento.single.nome, 'Lazer');
  });

  test('BudgetRepository consulta status e envia mesReferencia YYYY-MM-01', () async {
    Map<String, dynamic>? saved;
    Map<String, dynamic>? copied;
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      if (options.path == '/orcamentos/status') {
        expect(options.queryParameters['mes'], '2026-10');
        return _json(200, {
          'mesReferencia': '2026-10-01',
          'resumo': {'orcamentoTotal': 0, 'gastoTotal': 0, 'restanteTotal': 0, 'percentualUsado': 0},
          'categorias': [],
          'categoriasSemOrcamento': [],
        });
      }
      if (options.path == '/orcamentos' && options.method == 'POST') {
        saved = Map<String, dynamic>.from(options.data as Map);
        return _json(201, {});
      }
      if (options.path == '/orcamentos/copiar') {
        copied = Map<String, dynamic>.from(options.data as Map);
        return _json(201, {});
      }
      return _json(404, {'message': options.path});
    });
    final repo = BudgetRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio));
    final status = await repo.obterStatus(mes: '2026-10');
    expect(status.mesReferencia, '2026-10-01');
    await repo.salvarLimites(
      mesReferencia: '2026-10-01',
      limites: const [BudgetLimiteInput(categoriaId: 'c1', limiteValor: 200, rolloverAtivo: true)],
    );
    expect(saved?['mesReferencia'], '2026-10-01');
    expect((saved?['limites'] as List).single['limiteValor'], 200);
    await repo.copiarMes(mesOrigem: '2026-09-01', mesDestino: '2026-10-01');
    expect(copied, {'mesOrigem': '2026-09-01', 'mesDestino': '2026-10-01'});
  });
}
