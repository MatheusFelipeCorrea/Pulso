import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/auth/data/user_model.dart';

class AuthRepository {
  AuthRepository({
    required this._api,
    required this._storage,
  });

  final ApiClient _api;
  final TokenStorage _storage;

  Future<AuthSession> login({
    required String identificador,
    required String senha,
    required bool lembrarMe,
  }) {
    return _sessionFrom(
      _api.raw.post<Map<String, dynamic>>(
        '/auth/login',
        data: {
          'email': identificador.trim(),
          'senha': senha,
          'lembrarMe': lembrarMe,
        },
        options: Options(extra: {'skipAuth': true}),
      ),
    );
  }

  Future<Map<String, dynamic>> register({
    required String nome,
    required String email,
    required String senha,
    required String confirmarSenha,
  }) async {
    try {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/auth/register',
        data: {
          'nome': nome.trim(),
          'email': email.trim().toLowerCase(),
          'senha': senha,
          'confirmarSenha': confirmarSenha,
        },
        options: Options(extra: {'skipAuth': true}),
      );
      return response.data ?? {};
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<PulsoUser> me() async {
    try {
      final response = await _api.raw.get<Map<String, dynamic>>('/auth/me');
      return PulsoUser.fromJson(response.data?['user'] as Map<String, dynamic>);
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<void> logout() async {
    final refresh = await _storage.readRefresh();
    try {
      await _api.raw.post<Map<String, dynamic>>(
        '/auth/logout',
        data: {'refreshToken': ?refresh},
        options: Options(extra: {'skipAuth': true}),
      );
    } on DioException {
      // Limpa local mesmo se a API falhar.
    } finally {
      await _storage.clear();
    }
  }

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/auth/forgot-password',
        data: {'email': email.trim().toLowerCase()},
        options: Options(extra: {'skipAuth': true}),
      );
      return response.data ?? {};
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<void> validateResetToken(String token) async {
    try {
      await _api.raw.get<Map<String, dynamic>>(
        '/auth/reset-password/$token',
        options: Options(extra: {'skipAuth': true}),
      );
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<void> resetPassword({
    required String token,
    required String senha,
    required String confirmarSenha,
  }) async {
    try {
      await _api.raw.post<Map<String, dynamic>>(
        '/auth/reset-password/$token',
        data: {'senha': senha, 'confirmarSenha': confirmarSenha},
        options: Options(extra: {'skipAuth': true}),
      );
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<Map<String, dynamic>> verifyEmail(String token) async {
    try {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/auth/verify-email/$token',
        options: Options(extra: {'skipAuth': true}),
      );
      return response.data ?? {};
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<void> resendVerification(String email) async {
    try {
      await _api.raw.post<Map<String, dynamic>>(
        '/auth/resend-verification',
        data: {'email': email.trim().toLowerCase()},
        options: Options(extra: {'skipAuth': true}),
      );
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<AuthSession> loginWithGoogle(String idToken) {
    return _sessionFrom(
      _api.raw.post<Map<String, dynamic>>(
        '/auth/google/mobile',
        data: {'idToken': idToken},
        options: Options(extra: {'skipAuth': true}),
      ),
    );
  }

  Future<AuthSession> exchangeOAuth(String exchange) {
    return _sessionFrom(
      _api.raw.post<Map<String, dynamic>>(
        '/auth/oauth/exchange',
        data: {'exchange': exchange},
        options: Options(extra: {'skipAuth': true}),
      ),
    );
  }

  Future<AuthSession> _sessionFrom(Future<Response<Map<String, dynamic>>> request) async {
    try {
      final response = await request;
      final data = response.data ?? {};
      final accessToken = data['accessToken'] as String?;
      final refreshToken = data['refreshToken'] as String?;
      final userJson = data['user'] as Map<String, dynamic>?;
      if (accessToken == null || refreshToken == null || userJson == null) {
        throw ApiException('A API não devolveu a sessão nativa. Verifique o header X-Pulso-Client.');
      }
      await _storage.save(accessToken: accessToken, refreshToken: refreshToken);
      return AuthSession(
        user: PulsoUser.fromJson(userJson),
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }
}
