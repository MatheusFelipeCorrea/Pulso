import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/calendar/data/reminder_visuals.dart';

void main() {
  test('reminderMeta usa catálogo e aliases da web', () {
    expect(reminderMeta('ALUGUEL').label, 'Aluguel');
    expect(reminderMeta('FATURA').label, 'Fatura do cartão');
    expect(reminderMeta('MENSALIDADE').label, 'Mensalidade faculdade');
    expect(reminderMeta('nao-existe').label, 'Outro');
    expect(reminderMeta(null).label, 'Outro');
    expect(reminderMeta('LUZ').icon, isNotNull);
  });
}
