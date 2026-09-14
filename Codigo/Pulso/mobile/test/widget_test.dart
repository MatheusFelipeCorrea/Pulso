import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/auth/utils/password_strength.dart';
import 'package:pulso/core/router/app_router.dart';

void main() {
  test('senha forte exige as mesmas regras da Web', () {
    expect(senhaForteRegex.hasMatch('fraca'), isFalse);
    expect(senhaForteRegex.hasMatch('Pulso@123'), isTrue);
    expect(allPasswordRulesPassed('Pulso@123'), isTrue);
    expect(getPasswordStrength('Pulso@123').label, 'Forte');
  });

  test('deep link de verificação e reset mapeiam para rotas do app', () {
    expect(
      locationFromAuthUri(Uri.parse('pulso://verify-email?token=abc')),
      '/verify-email/abc',
    );
    expect(
      locationFromAuthUri(Uri.parse('https://app.pulso.dev/reset-password/xyz')),
      '/reset-password/xyz',
    );
  });
}
