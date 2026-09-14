import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/config/app_config.dart';

class GoogleAuthClient {
  GoogleAuthClient._();

  static final GoogleAuthClient instance = GoogleAuthClient._();

  GoogleSignIn? _google;

  bool get isConfigured => AppConfig.googleServerClientId.isNotEmpty;

  String get missingConfigMessage =>
      'Google Sign-In nativo precisa de GOOGLE_SERVER_CLIENT_ID '
      '(mesmo Client ID web da API) e dos clients Android/iOS no Google Cloud.';

  GoogleSignIn _ensureGoogle() {
    final existing = _google;
    if (existing != null) return existing;

    if (!isConfigured) {
      throw ApiException(missingConfigMessage);
    }

    final client = GoogleSignIn(
      scopes: const ['email', 'profile'],
      serverClientId: AppConfig.googleServerClientId,
    );
    _google = client;
    return client;
  }

  /// Native (Android/iOS): custom button + ID token.
  Future<String?> signInForIdToken() async {
    if (kIsWeb) {
      throw ApiException(
        'No navegador o Google usa o mesmo redirect da Web, não o plugin nativo.',
      );
    }
    final account = await _ensureGoogle().signIn();
    if (account == null) return null;
    final idToken = (await account.authentication).idToken;
    if (idToken == null || idToken.isEmpty) {
      throw ApiException('Não foi possível obter o ID token do Google.');
    }
    return idToken;
  }
}
