import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/calendar/data/calendar_repository.dart';

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

  test('PulsoLembrete parseia valor string ou nulo e diasAteVencimento', () {
    final pago = PulsoLembrete.fromJson({
      'id': 'l1',
      'titulo': 'Aluguel',
      'valor': '1200.50',
      'dataVencimento': '2026-10-10T12:00:00.000Z',
      'horaLembrete': '09:00',
      'antecedencia': 'UM_DIA',
      'categoria': 'ALUGUEL',
      'diasAteVencimento': 4,
    });
    expect(pago.valor, 1200.50);
    expect(pago.temValor, isTrue);
    expect(pago.diasAteVencimento, 4);

    final semValor = PulsoLembrete.fromJson({
      'id': 'l2',
      'titulo': 'Reunião',
      'valor': null,
      'dataVencimento': '2026-10-11T12:00:00.000Z',
    });
    expect(semValor.valor, isNull);
    expect(semValor.temValor, isFalse);
  });

  test('CalendarMonthView parseia resumo, dias e próximos vencimentos', () {
    final mes = CalendarMonthView.fromJson({
      'mes': '2026-10',
      'resumo': {'receitasTotal': '100.00', 'despesasTotal': '40.00', 'saldo': '60.00', 'totalTransacoes': 3},
      'dias': {
        '2026-10-01': {'temReceita': true, 'receitas': '100.00', 'temLembrete': true, 'lembretes': 1},
      },
      'proximosVencimentos': [
        {'id': 'l1', 'titulo': 'Luz', 'dataVencimento': '2026-10-08T12:00:00.000Z', 'valor': '80'},
      ],
    });
    expect(mes.resumo.saldo, 60);
    expect(mes.dias['2026-10-01']?.temReceita, isTrue);
    expect(mes.proximosVencimentos.single.titulo, 'Luz');
  });

  test('CalendarRepository consulta /calendario/mes e /dia', () async {
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      if (options.path == '/calendario/mes') {
        expect(options.queryParameters['mes'], '2026-10');
        return _json(200, {
          'mes': '2026-10',
          'resumo': {'receitasTotal': 0, 'despesasTotal': 0, 'saldo': 0, 'totalTransacoes': 0},
          'dias': {},
          'proximosVencimentos': [],
        });
      }
      if (options.path == '/calendario/dia') {
        expect(options.queryParameters['data'], '2026-10-06');
        return _json(200, {
          'data': '2026-10-06',
          'lembretes': [],
          'totais': {'receitas': '10.00', 'despesas': '0', 'saldo': '10.00'},
          'transacoes': [
            {'id': 't1'},
          ],
        });
      }
      return _json(404, {'message': options.path});
    });
    final api = ApiClient(tokenStorage: TokenStorage(), dio: dio);
    final repo = CalendarRepository(api);
    final mes = await repo.obterMes('2026-10');
    expect(mes.mes, '2026-10');
    final dia = await repo.obterDia('2026-10-06');
    expect(dia.receitas, 10);
    expect(dia.transacoesCount, 1);
  });

  test('ReminderRepository cria, atualiza, paga e exclui em /lembretes', () async {
    final calls = <String>[];
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      calls.add('${options.method} ${options.path}');
      if (options.method == 'POST' && options.path == '/lembretes') {
        return _json(201, {'id': 'l1', 'titulo': 'Aluguel', 'dataVencimento': '2026-10-10T12:00:00.000Z'});
      }
      if (options.method == 'PATCH' && options.path == '/lembretes/l1') {
        return _json(200, {'id': 'l1', 'titulo': 'Aluguel novo', 'dataVencimento': '2026-10-10T12:00:00.000Z'});
      }
      if (options.method == 'POST' && options.path == '/lembretes/l1/pagar') {
        return _json(200, {'id': 'l1', 'titulo': 'Aluguel', 'pago': true, 'dataVencimento': '2026-10-10T12:00:00.000Z'});
      }
      if (options.method == 'DELETE' && options.path == '/lembretes/l1') {
        return _json(204, {});
      }
      return _json(404, {'message': options.path});
    });
    final repo = ReminderRepository(ApiClient(tokenStorage: TokenStorage(), dio: dio));
    expect((await repo.criar({'titulo': 'Aluguel'})).id, 'l1');
    expect((await repo.atualizar('l1', {'titulo': 'Aluguel novo'})).titulo, 'Aluguel novo');
    expect((await repo.pagar('l1')).pago, isTrue);
    await repo.excluir('l1');
    expect(calls, [
      'POST /lembretes',
      'PATCH /lembretes/l1',
      'POST /lembretes/l1/pagar',
      'DELETE /lembretes/l1',
    ]);
  });
}
