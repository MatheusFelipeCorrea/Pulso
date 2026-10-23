import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';
import 'package:pulso/features/expense_split/utils/split_labels.dart';

void main() {
  test('rotulos de status, tipo e nomes', () {
    expect(splitStatusVisual('QUITADA').label, 'Quitada');
    expect(splitStatusVisual('ATIVA').tone, 'warning');
    expect(participanteStatusVisual('PAGO').label, 'Pago');
    expect(participanteStatusVisual('PENDENTE').tone, 'warning');
    expect(splitTipoLabel('PERSONALIZADA'), 'Personalizada');
    expect(splitTipoLabel('IGUAL'), 'Igual');
    expect(nomesParticipantes(' Ana, ana; Bruno\nVocê,  '), ['Ana', 'Bruno']);
    expect(nomesParticipantes(''), isEmpty);
  });

  test('modelo lê divisao e resumo', () {
    final divisao = PulsoDivisao.fromJson({
      'id': 's1',
      'titulo': 'Jantar',
      'valorTotal': '90.00',
      'tipo': 'IGUAL',
      'status': 'ATIVA',
      'data': '2026-10-23',
      'participantes': [
        {
          'id': 'p1',
          'nome': 'Você',
          'valor': 45,
          'ehOrganizador': true,
          'pagouAConta': true,
          'status': 'PAGO',
        },
        {
          'id': 'p2',
          'nome': 'Bruno',
          'valor': 45,
          'ehOrganizador': false,
          'pagouAConta': false,
          'status': 'PENDENTE',
        },
      ],
    });
    expect(divisao.pendentes, 1);
    expect(divisao.participantes.first.pago, isTrue);
    expect(divisao.quitada, isFalse);

    final resumo = SplitResumo.fromJson({
      'meDevem': 45,
      'euDevo': 0,
      'saldo': 45,
      'possuiDivisoes': true,
    });
    expect(resumo.saldo, 45);
    expect(resumo.possuiDivisoes, isTrue);
    expect(splitMoney('3,5'), 3.5);
    expect(PulsoDivisao.fromJson({}).titulo, 'Divisão');
  });
}
