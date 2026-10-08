import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';
import 'package:pulso/features/goals/utils/goal_icon_rules.dart';

class _ScriptedAdapter implements HttpClientAdapter {
  _ScriptedAdapter(this._handler);
  final Future<ResponseBody> Function(RequestOptions options) _handler;
  @override
  void close({bool force = false}) {}
  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) {
    return _handler(options);
  }
}

ResponseBody _json(
  int status,
  Object body, {
  Map<String, List<String>> headers = const {},
}) {
  return ResponseBody.fromString(
    jsonEncode(body),
    status,
    headers: {
      Headers.contentTypeHeader: [Headers.jsonContentType],
      ...headers,
    },
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('meta parseia percentual e aportes da API', () {
    final meta = PulsoMeta.fromJson({
      'id': 'm1',
      'nome': 'Reserva',
      'valorAlvo': '1000.00',
      'valorAtual': '250.00',
      'valorRestante': '750.00',
      'percentual': '25.0',
      'prazo': '2026-12-31T12:00:00.000Z',
      'tipo': 'LONGO_PRAZO',
      'status': 'ATIVA',
      'aportes': [
        {'id': 'a1', 'valor': '250.00', 'data': '2026-09-01T12:00:00.000Z'},
      ],
    });
    expect(meta.valorAlvo, 1000);
    expect(meta.percentual, 25);
    expect(meta.aportes, hasLength(1));
  });

  test('GoalRepository lista /metas com os mesmos headers da web', () async {
    FlutterSecureStorage.setMockInitialValues({
      'pulso_access': 'access-token',
      'pulso_refresh': 'refresh-token',
    });
    final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
    dio.httpClientAdapter = _ScriptedAdapter((options) async {
      expect(options.path, '/metas');
      return _json(
        200,
        [
          {
            'id': 'm1',
            'nome': 'Viagem',
            'valorAlvo': '3000.00',
            'valorAtual': '0.00',
            'valorRestante': '3000.00',
            'percentual': '0.0',
            'prazo': '2026-12-31T12:00:00.000Z',
            'tipo': 'CURTO_PRAZO',
            'status': 'ATIVA',
            'aportes': [],
          },
        ],
        headers: {
          'x-total-count': ['1'],
          'x-total-pages': ['1'],
          'x-current-page': ['1'],
        },
      );
    });
    final page = await GoalRepository(
      ApiClient(tokenStorage: TokenStorage(), dio: dio),
    ).listar(const GoalFilters());
    expect(page.total, 1);
    expect(page.metas.first.nome, 'Viagem');
  });

  test('icone da meta segue o nome, como na web', () {
    expect(goalIconForName('Viagem para Paris'), Icons.flight);
    expect(goalIconForName('Reserva de emergência'), Icons.savings_outlined);
    expect(goalIconForName('Casa nova'), Icons.home_outlined);
    expect(goalIconForName('Carro'), Icons.directions_car_outlined);
    expect(goalIconForName('Algo aleatório'), Icons.flag_outlined);
  });

  test('badges de status e tipo da meta seguem o catálogo da web', () {
    expect(badgeKindFromMetaStatus('ATIVA'), PulsoBadgeKind.metaStatusAtiva);
    expect(
      badgeKindFromMetaStatus('CONCLUIDA'),
      PulsoBadgeKind.metaStatusConcluida,
    );
    expect(badgeKindFromMetaTipo('CURTO_PRAZO'), PulsoBadgeKind.metaTipoCurto);
    expect(
      badgeStyleForKind(
        PulsoBadgeKind.metaStatusConcluida,
        Brightness.light,
      ).label,
      'Concluída',
    );
    expect(
      badgeStyleForKind(PulsoBadgeKind.metaTipoLongo, Brightness.light).rounded,
      isTrue,
    );
  });
}
