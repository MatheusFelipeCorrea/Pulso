import 'package:shared_preferences/shared_preferences.dart';

class LoginPrefs {
  static const _identificadorKey = 'pulso_login_identificador';
  static const _lembrarKey = 'pulso_login_lembrar_me';

  static Future<({String identificador, bool lembrarMe})> load() async {
    final prefs = await SharedPreferences.getInstance();
    final lembrarMe = prefs.getBool(_lembrarKey) ?? false;
    final identificador =
        lembrarMe ? (prefs.getString(_identificadorKey) ?? '') : '';
    return (identificador: identificador, lembrarMe: lembrarMe);
  }

  static Future<void> save({
    required String identificador,
    required bool lembrarMe,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    if (lembrarMe) {
      await prefs.setBool(_lembrarKey, true);
      await prefs.setString(_identificadorKey, identificador.trim());
    } else {
      await prefs.remove(_lembrarKey);
      await prefs.remove(_identificadorKey);
    }
  }
}
