import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

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

  test('TripRepository lista /viagens', () async {
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      expect(options.path, '/viagens');
      return _json(200, [
        {
          'id': 'v1',
          'destino': 'Lisboa',
          'moeda': 'EUR',
          'dataPrevista': '2026-11-10T12:00:00.000Z',
          'totalBrl': '0.00',
          'despesas': [],
          'observacoes': [],
        },
      ]);
    });
    final list = await TripRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio)).listar();
    expect(list, hasLength(1));
    expect(list.first.destino, 'Lisboa');
    expect(list.first.moeda, 'EUR');
  });

  test('GroupRepository lista /grupos no contrato da web', () async {
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      expect(options.path, '/grupos');
      return _json(200, {
        'grupos': [
          {'id': 'g1', 'nome': 'Família', 'quantidadeMembros': 3},
        ],
      });
    });
    final list = await GroupRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio)).listar();
    expect(list.single.nome, 'Família');
    expect(list.single.quantidadeMembros, 3);
  });
}
