import 'package:flutter/foundation.dart';

class AppConfig {
  static const _fromEnv = String.fromEnvironment('API_BASE_URL');
  static const googleServerClientId = String.fromEnvironment(
    'GOOGLE_SERVER_CLIENT_ID',
    defaultValue: '758052952163-rmaio9aiik5dvgnpb7cu9cqj96qmtkfr.apps.googleusercontent.com',
  );
  static const googleIosClientId = String.fromEnvironment(
    'GOOGLE_IOS_CLIENT_ID',
    defaultValue: '758052952163-tmobd71odlg5elq05louk81labdth94u.apps.googleusercontent.com',
  );

  static String get apiBaseUrl {
    if (_fromEnv.isNotEmpty) return _fromEnv;
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3333';
    }
    return 'http://localhost:3333';
  }
}
