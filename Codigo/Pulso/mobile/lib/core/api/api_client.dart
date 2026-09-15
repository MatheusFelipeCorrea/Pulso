import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/config/app_config.dart';
import 'package:pulso/core/storage/token_storage.dart';

class ApiClient {
  ApiClient({
    required this._tokenStorage,
    this.onSessionExpired,
    Dio? dio,
    String? baseUrl,
  }) {
    _dio = dio ??
        Dio(
          BaseOptions(
            baseUrl: '${baseUrl ?? AppConfig.apiBaseUrl}/api',
            connectTimeout: const Duration(seconds: 20),
            receiveTimeout: const Duration(seconds: 20),
            headers: const {
              'Content-Type': 'application/json',
              'X-Pulso-Client': 'mobile',
            },
          ),
        );
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onError: _onError,
      ),
    );
  }

  final TokenStorage _tokenStorage;
  VoidCallback? onSessionExpired;
  late final Dio _dio;
  Completer<void>? _refreshLock;

  Dio get raw => _dio;

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    options.headers['X-Pulso-Client'] = 'mobile';
    if (options.extra['skipAuth'] == true) {
      return handler.next(options);
    }
    final access = await _tokenStorage.readAccess();
    if (access != null && access.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $access';
    }
    handler.next(options);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    final status = error.response?.statusCode;
    final request = error.requestOptions;
    if (status != 401 || request.extra['retried'] == true || request.extra['skipAuth'] == true) {
      return handler.next(error);
    }

    try {
      await _refreshTokens();
      request.extra['retried'] = true;
      final access = await _tokenStorage.readAccess();
      if (access != null) {
        request.headers['Authorization'] = 'Bearer $access';
      }
      final response = await _dio.fetch(request);
      return handler.resolve(response);
    } catch (_) {
      await _tokenStorage.clear();
      final expired = onSessionExpired;
      if (expired != null) {
        Future.microtask(expired);
      }
      return handler.next(error);
    }
  }

  Future<void> _refreshTokens() async {
    final inflight = _refreshLock;
    if (inflight != null) {
      return inflight.future;
    }
    final lock = Completer<void>();
    _refreshLock = lock;
    lock.future.ignore();
    try {
      final refresh = await _tokenStorage.readRefresh();
      if (refresh == null || refresh.isEmpty) {
        throw ApiException('Sessão expirada. Faça login novamente.', statusCode: 401);
      }
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refresh},
        options: Options(extra: {'skipAuth': true}),
      );
      final data = response.data ?? {};
      final accessToken = data['accessToken'] as String?;
      final refreshToken = data['refreshToken'] as String?;
      if (accessToken == null || refreshToken == null) {
        throw ApiException('Sessão expirada. Faça login novamente.', statusCode: 401);
      }
      await _tokenStorage.save(accessToken: accessToken, refreshToken: refreshToken);
      if (!lock.isCompleted) lock.complete();
    } catch (error) {
      if (!lock.isCompleted) lock.completeError(error);
      rethrow;
    } finally {
      _refreshLock = null;
    }
  }

  static ApiException toApiException(DioException error) {
    final data = error.response?.data;
    String message = 'Não foi possível concluir a operação. Tente novamente.';
    if (data is Map && data['message'] is String) {
      message = data['message'] as String;
    } else if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      message = 'Não foi possível conectar à API. Confira se ela está no ar.';
    }
    return ApiException(message, statusCode: error.response?.statusCode);
  }
}
