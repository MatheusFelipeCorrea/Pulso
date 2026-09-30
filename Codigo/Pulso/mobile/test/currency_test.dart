import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/currency/data/currency_repository.dart';

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

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('CurrencyRepository converte via /moedas/converter', () async {
    FlutterSecureStorage.setMockInitialValues({'pulso_access': 'access-token', 'pulso_refresh': 'refresh-token'});
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      expect(options.path, '/moedas/converter');
      expect(options.queryParameters['de'], 'BRL');
      expect(options.queryParameters['para'], 'USD');
      return ResponseBody.fromString(
        jsonEncode({'valorConvertido': '18.00', 'taxa': '0.18'}),
        200,
        headers: {Headers.contentTypeHeader: [Headers.jsonContentType]},
      );
    });
    final result = await CurrencyRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio)).converter(
      valor: 100,
      de: 'BRL',
      para: 'USD',
    );
    expect(result.valorConvertido, 18);
    expect(result.taxa, 0.18);
  });
}
