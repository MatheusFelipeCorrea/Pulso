import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/router/app_router.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/auth/data/auth_repository.dart';
import 'package:pulso/features/auth/legal/legal_content.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/utils/email.dart';
import 'package:pulso/features/auth/utils/password_strength.dart';

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

ResponseBody _json(int status, Map<String, dynamic> body) {
  return ResponseBody.fromString(
    jsonEncode(body),
    status,
    headers: {
      Headers.contentTypeHeader: [Headers.jsonContentType],
    },
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('senha forte exige as mesmas regras da Web', () {
    expect(senhaForteRegex.hasMatch('fraca'), isFalse);
    expect(senhaForteRegex.hasMatch('Pulso@123'), isTrue);
    expect(allPasswordRulesPassed('Pulso@123'), isTrue);
    expect(getPasswordStrength('Pulso@123').label, 'Forte');
  });

  test('email inválido bloqueia cadastro e recuperação', () {
    expect(isValidEmail('nao-e-email'), isFalse);
    expect(isValidEmail('a@b'), isFalse);
    expect(isValidEmail('user@pulso.dev'), isTrue);
    expect(isValidEmail('  User@Pulso.dev  '), isTrue);
  });

  test('deep link de verificação e reset mapeiam para rotas do app', () {
    expect(
      locationFromAuthUri(Uri.parse('pulso://verify-email?token=abc')),
      '/verify-email/abc',
    );
    expect(
      locationFromAuthUri(Uri.parse('pulso://reset-password?token=xyz')),
      '/reset-password/xyz',
    );
    expect(
      locationFromAuthUri(
        Uri.parse('https://app.pulso.dev/reset-password/xyz'),
      ),
      '/reset-password/xyz',
    );
    expect(
      locationFromAuthUri(
        Uri.parse('http://localhost:5173/verify-email/tok.en'),
      ),
      '/verify-email/tok.en',
    );
    expect(locationFromAuthUri(Uri.parse('pulso://home')), isNull);
  });

  test('copy legal do app cobre os mesmos documentos da Web', () {
    expect(termsOfUseSections, hasLength(10));
    expect(privacyPolicySections, hasLength(12));
    expect(termsOfUseMeta.relatedPath, '/privacidade');
    expect(privacyPolicyMeta.relatedPath, '/termos');
  });

  group('sessão Bearer', () {
    late TokenStorage storage;

    setUp(() {
      FlutterSecureStorage.setMockInitialValues({});
      storage = TokenStorage();
    });

    AuthController controllerFor(Dio dio) {
      final api = ApiClient(tokenStorage: storage, dio: dio);
      return AuthController(
        repository: AuthRepository(api: api, storage: storage),
        storage: storage,
      );
    }

    test('bootstrap sem tokens não chama a API', () async {
      final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
      dio.httpClientAdapter = _ScriptedAdapter((_) async {
        fail('não deve chamar a API sem tokens');
      });

      final auth = controllerFor(dio);
      await auth.bootstrap();

      expect(auth.status, AuthStatus.unauthenticated);
      expect(auth.user, isNull);
    });

    test('bootstrap com refresh reemite access e autentica', () async {
      FlutterSecureStorage.setMockInitialValues({
        'pulso_access': '',
        'pulso_refresh': 'refresh-1',
      });
      storage = TokenStorage();

      var meCalls = 0;
      final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
      dio.httpClientAdapter = _ScriptedAdapter((options) async {
        if (options.method == 'POST' &&
            options.path.contains('/auth/refresh')) {
          return _json(200, {
            'accessToken': 'access-2',
            'refreshToken': 'refresh-2',
          });
        }
        if (options.method == 'GET' && options.path.contains('/auth/me')) {
          meCalls += 1;
          if (meCalls == 1) {
            return _json(401, {'message': 'expired'});
          }
          return _json(200, {
            'user': {'id': '1', 'nome': 'Ana', 'email': 'ana@pulso.dev'},
          });
        }
        return _json(404, {'message': options.path});
      });

      final auth = controllerFor(dio);
      await auth.bootstrap();

      expect(auth.status, AuthStatus.authenticated);
      expect(auth.user?.email, 'ana@pulso.dev');
      expect(await storage.readAccess(), 'access-2');
      expect(await storage.readRefresh(), 'refresh-2');
    });

    test('refresh falho limpa storage e notifica sessão expirada', () async {
      FlutterSecureStorage.setMockInitialValues({
        'pulso_access': 'access-old',
        'pulso_refresh': 'refresh-old',
      });
      storage = TokenStorage();

      var expired = false;
      final dio = Dio(BaseOptions(baseUrl: 'http://test/api'));
      final api = ApiClient(
        tokenStorage: storage,
        dio: dio,
        onSessionExpired: () => expired = true,
      );
      dio.httpClientAdapter = _ScriptedAdapter((options) async {
        if (options.path.contains('/auth/refresh')) {
          return _json(401, {'message': 'replay'});
        }
        return _json(401, {'message': 'expired'});
      });

      final auth = AuthController(
        repository: AuthRepository(api: api, storage: storage),
        storage: storage,
      );

      await auth.bootstrap();
      await Future<void>.delayed(Duration.zero);

      expect(auth.status, AuthStatus.unauthenticated);
      expect(await storage.readAccess(), isNull);
      expect(await storage.readRefresh(), isNull);
      expect(expired, isTrue);
    });
  });
}
