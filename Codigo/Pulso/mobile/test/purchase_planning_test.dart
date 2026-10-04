import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/purchase/data/purchase_repository.dart';

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

  test('PurchasePainel parseia resumo, itens desejados e comprados', () {
    final painel = PurchasePainel.fromJson({
      'resumo': {
        'totalValor': '3500.00',
        'totalItens': 1,
        'mediaImpactoRenda': '22.5',
        'rendaMensal': '4000.00',
        'sobraMensal': '800.00',
        'dicas': [
          {'texto': 'Prefira à vista se a sobra cobrir.'},
        ],
      },
      'itens': [
        {
          'id': 'p1',
          'nome': 'Notebook',
          'valorEstimado': '3500.00',
          'prioridade': 'ALTA',
          'categoria': 'ELETRONICOS',
          'mesesParaComprar': 5,
          'comprometimentoPrincipal': {'nivel': 'atencao', 'percentual': '22.5'},
        },
      ],
      'comprados': [
        {'id': 'p0', 'nome': 'Fone', 'valorEstimado': '200.00', 'diasNaLista': 12},
      ],
    });
    expect(painel.resumo.sobraMensal, 800);
    expect(painel.resumo.dicas.single, contains('à vista'));
    expect(painel.itens.single.comprometimentoNivel, 'atencao');
    expect(painel.comprados.single.diasNaLista, 12);
  });

  test('PurchasePlanningRepository bate nas rotas de painel, vincular-meta e comprar', () async {
    final calls = <String>[];
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      calls.add('${options.method} ${options.path}');
      if (options.path == '/planejamento-compra' && options.method == 'GET') {
        return _json(200, {
          'resumo': {'totalValor': 0, 'totalItens': 0, 'mediaImpactoRenda': 0, 'rendaMensal': 0, 'sobraMensal': 0, 'dicas': []},
          'itens': [],
          'comprados': [],
        });
      }
      if (options.path == '/planejamento-compra/p1/vincular-meta') {
        expect((options.data as Map)['metaId'], 'm1');
        return _json(200, {
          'id': 'p1',
          'nome': 'Notebook',
          'valorEstimado': 3500,
          'meta': {'id': 'm1', 'nome': 'Notebook', 'percentual': '10'},
        });
      }
      if (options.path == '/planejamento-compra/p1/comprar') {
        return _json(200, {'id': 'p1', 'nome': 'Notebook', 'valorEstimado': 3500, 'status': 'COMPRADO'});
      }
      return _json(404, {'message': options.path});
    });
    final repo = PurchasePlanningRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio));
    final painel = await repo.obterPainel();
    expect(painel.itens, isEmpty);
    final vinculado = await repo.vincularMeta('p1', metaId: 'm1');
    expect(vinculado.meta?.id, 'm1');
    expect((await repo.comprar('p1')).status, 'COMPRADO');
    expect(calls, [
      'GET /planejamento-compra',
      'POST /planejamento-compra/p1/vincular-meta',
      'POST /planejamento-compra/p1/comprar',
    ]);
  });
}
