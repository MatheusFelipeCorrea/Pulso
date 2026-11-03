import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:pulso/features/auth/data/auth_repository.dart';
import 'package:pulso/features/auth/data/user_model.dart';

enum AuthStatus { unknown, unauthenticated, authenticated }

class AuthController extends ChangeNotifier {
  AuthController({required this._repository, required this._storage});

  final AuthRepository _repository;
  final TokenStorage _storage;

  AuthStatus status = AuthStatus.unknown;
  PulsoUser? user;

  Future<void> bootstrap() async {
    final access = await _storage.readAccess();
    final refresh = await _storage.readRefresh();
    final hasAccess = access != null && access.isNotEmpty;
    final hasRefresh = refresh != null && refresh.isNotEmpty;
    if (!hasAccess && !hasRefresh) {
      status = AuthStatus.unauthenticated;
      notifyListeners();
      return;
    }
    try {
      user = await _repository.me();
      status = AuthStatus.authenticated;
    } catch (_) {
      await _storage.clear();
      user = null;
      status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  void clearLocalSession() {
    user = null;
    status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> login({
    required String identificador,
    required String senha,
    required bool lembrarMe,
  }) async {
    final session = await _repository.login(
      identificador: identificador,
      senha: senha,
      lembrarMe: lembrarMe,
    );
    _setAuthenticated(session.user);
  }

  Future<Map<String, dynamic>> register({
    required String nome,
    required String email,
    required String senha,
    required String confirmarSenha,
  }) {
    return _repository.register(
      nome: nome,
      email: email,
      senha: senha,
      confirmarSenha: confirmarSenha,
    );
  }

  Future<void> loginWithGoogleIdToken(String idToken) async {
    final session = await _repository.loginWithGoogle(idToken);
    _setAuthenticated(session.user);
  }

  Future<void> exchangeOAuth(String exchange) async {
    final session = await _repository.exchangeOAuth(exchange);
    _setAuthenticated(session.user);
  }

  Future<void> logout() async {
    await _repository.logout();
    user = null;
    status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> deleteAccount({required String confirmacao}) async {
    await _repository.deleteAccount(confirmacao: confirmacao);
    user = null;
    status = AuthStatus.unauthenticated;
    notifyListeners();
  }

  Future<void> forgotPassword(String email) =>
      _repository.forgotPassword(email);

  Future<void> validateResetToken(String token) =>
      _repository.validateResetToken(token);

  Future<void> resetPassword({
    required String token,
    required String senha,
    required String confirmarSenha,
  }) {
    return _repository.resetPassword(
      token: token,
      senha: senha,
      confirmarSenha: confirmarSenha,
    );
  }

  Future<Map<String, dynamic>> verifyEmail(String token) =>
      _repository.verifyEmail(token);

  Future<void> resendVerification(String email) =>
      _repository.resendVerification(email);

  void _setAuthenticated(PulsoUser next) {
    user = next;
    status = AuthStatus.authenticated;
    notifyListeners();
  }

  static String messageOf(Object error) {
    if (error is ApiException) return error.message;
    if (error is PlatformException) {
      return error.message ?? error.code;
    }
    return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
