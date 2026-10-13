import 'package:web/web.dart' as web;

void launchPulsoGoogleOAuth(String apiBaseUrl) {
  final origin = web.window.location.origin;
  final url = Uri.parse('$apiBaseUrl/api/auth/google')
      .replace(queryParameters: {'returnTo': origin});
  web.window.location.assign(url.toString());
}
