import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/data/user_model.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/utils/transaction_rules.dart';

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

ResponseBody _json(int status, Object body, {Map<String, List<String>> headers = const {}}) {
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

  test('período YYYY-MM anda mês a mês', () {
    expect(TransactionPeriod.shift('2026-01', -1), '2025-12');
    expect(TransactionPeriod.shift('2026-12', 1), '2027-01');
    expect(TransactionPeriod.label('2026-09'), 'Set/2026');
  });

  test('moeda BRL formata no padrão da Web', () {
    expect(formatBrl(1234.5), 'R\$ 1.234,50');
    expect(formatBrl(-10), '-R\$ 10,00');
    expect(parseMoney('R\$ 1.234,50'), 1234.5);
  });

  test('VA e VR seguem as mesmas regras de categoria da Web', () {
    expect(
      validarRecursoCategoria(
        recurso: 'VA',
        tipo: 'DESPESA',
        categoriaNome: 'Alimentação',
        grupoBeneficio: grupoAlimentacao,
      ),
      isNull,
    );
    expect(
      validarRecursoCategoria(
        recurso: 'VR',
        tipo: 'DESPESA',
        categoriaNome: 'Compras',
        grupoBeneficio: grupoCompras,
      ),
      isNotNull,
    );
    expect(validarTransferencia('DINHEIRO', 'DINHEIRO'), isNotNull);
    expect(validarTransferencia('DINHEIRO', 'POUPANCA'), isNull);
    expect(buildRecurrenceRule(frequencia: 'MENSAL', ateQuando: 'SEM_FIM'), 'FREQ=MONTHLY;INTERVAL=1');
  });

  test('ícones de categoria seguem os nomes Lucide da Web', () {
    expect(iconFromLucide('UtensilsCrossed'), Icons.restaurant);
    expect(iconFromLucide('GraduationCap'), Icons.school_outlined);
    expect(iconFromLucide('ShoppingBag'), Icons.shopping_bag_outlined);
    expect(iconFromLucide(null), Icons.label_outline);
  });

  test('badge de modo de uso espelha o catálogo da Web', () {
    expect(badgeFromModoUso('ESTAGIARIO').label, 'Estagiário');
    expect(badgeFromModoUso('CLT').label, 'CLT');
    expect(PulsoUser.fromJson({
      'id': '1',
      'nome': 'Ana',
      'email': 'ana@pulso.dev',
      'modoUso': 'PJ',
    }).modoUso, 'PJ');
  });

  test('filtros autenticados omitem tipo/recurso TODOS', () {
    final query = TransactionFilters(
      periodo: '2026-09',
      tipo: 'DESPESA',
      recurso: 'TODOS',
      busca: 'ru',
    ).toQuery(pagina: 2);
    expect(query['periodo'], '2026-09');
    expect(query['tipo'], 'DESPESA');
    expect(query.containsKey('recurso'), isFalse);
    expect(query['busca'], 'ru');
    expect(query['pagina'], 2);
  });

  group('API de transações com Bearer', () {
    late TokenStorage storage;

    setUp(() {
      FlutterSecureStorage.setMockInitialValues({
        'pulso_access': 'access-token',
        'pulso_refresh': 'refresh-token',
      });
      storage = TokenStorage();
    });

    test('lista, resumo e exclusão recorrente usam a mesma API da Web', () async {
      final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
      String? authHeader;
      String? deletePath;
      Map<String, dynamic>? deleteQuery;

      dio.httpClientAdapter = _ScriptedAdapter((options) async {
        authHeader = options.headers['Authorization'] as String?;
        if (options.path.contains('/transacoes/resumo')) {
          return _json(200, {
            'receitas': {'total': '100.00', 'quantidade': 1},
            'despesas': {'total': '40.00', 'quantidade': 1},
            'saldo': '60.00',
          });
        }
        if (options.method == 'GET' && options.path.endsWith('/transacoes')) {
          return _json(
            200,
            [
              {
                'id': 'tx-1',
                'tipo': 'DESPESA',
                'recurso': 'DINHEIRO',
                'valor': '40.00',
                'data': '2026-09-10T12:00:00.000Z',
                'recorrente': false,
                'descricao': 'Almoço',
                'categoria': {'id': 'cat-1', 'nome': 'Alimentação', 'tipo': 'DESPESA'},
                'tags': [],
              },
            ],
            headers: {
              'x-total-count': ['1'],
              'x-total-pages': ['1'],
              'x-current-page': ['1'],
            },
          );
        }
        if (options.method == 'DELETE') {
          deletePath = options.path;
          deleteQuery = options.queryParameters;
          return ResponseBody.fromString('', 204);
        }
        return _json(404, {'message': options.path});
      });

      final repo = TransactionRepository(ApiClient(tokenStorage: storage, dio: dio));
      final filtros = TransactionFilters(periodo: '2026-09');
      final page = await repo.listar(filtros, pagina: 1);
      final resumo = await repo.obterResumo(filtros);
      await repo.excluir('tx-1', excluirFuturas: true, dataCorte: DateTime.utc(2026, 9, 10, 12));

      expect(authHeader, 'Bearer access-token');
      expect(page.transacoes, hasLength(1));
      expect(page.transacoes.first.descricao, 'Almoço');
      expect(page.total, 1);
      expect(resumo.saldo, 60);
      expect(deletePath, '/transacoes/tx-1');
      expect(deleteQuery?['excluirFuturas'], 'true');
      expect(deleteQuery?['dataCorte'], isNotNull);
    });
  });
}
