import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/debts/data/debt_models.dart';
import 'package:pulso/features/debts/utils/debt_status.dart';

void main() {
  final hoje = DateTime(2026, 10, 23);

  test('status da divida segue os prazos da web', () {
    expect(debtDirecaoLabel('ME_DEVEM'), 'Me devem');
    expect(debtDirecaoLabel('EU_DEVO'), 'Eu devo');

    final quitada = debtStatusVisual(
      quitada: true,
      dataQuitacao: DateTime.utc(2026, 10, 1),
      valorPago: 10,
      valorRestante: 0,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(quitada.tone, 'success');
    expect(quitada.label, contains('Quitada'));

    final semPrazo = debtStatusVisual(
      quitada: false,
      valorPago: 0,
      valorRestante: 10,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(semPrazo.label, 'Sem prazo definido');

    final parcial = debtStatusVisual(
      quitada: false,
      valorPago: 4,
      valorRestante: 6,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(parcial.tone, 'warning');

    final vencida = debtStatusVisual(
      quitada: false,
      prazoDevolucao: DateTime(2026, 10, 21),
      valorPago: 2,
      valorRestante: 8,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(vencida.tone, 'danger');
    expect(vencida.label, contains('pago 20%'));

    final hojeStatus = debtStatusVisual(
      quitada: false,
      prazoDevolucao: hoje,
      valorPago: 0,
      valorRestante: 10,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(hojeStatus.label, 'Vence hoje');

    final breve = debtStatusVisual(
      quitada: false,
      prazoDevolucao: DateTime(2026, 10, 25),
      valorPago: 0,
      valorRestante: 10,
      valorTotal: 10,
      hoje: hoje,
    );
    expect(breve.label, 'Vence em 2 dias');
    expect(breve.tone, 'warning');
  });

  test('modelo lê divida e resumo', () {
    final divida = PulsoDivida.fromJson({
      'id': 'd1',
      'direcao': 'ME_DEVEM',
      'nomePessoa': 'Ana',
      'valor': '100.00',
      'valorPago': '40.00',
      'valorRestante': '60.00',
      'quitada': false,
      'pagamentos': [
        {'id': 'p1', 'valor': '40.00'},
      ],
    });
    expect(divida.pagamentos.single.valor, 40);
    expect(divida.valorRestante, 60);

    final resumo = DebtResumo.fromJson({
      'meDevem': {'total': '60.00', 'quantidade': 1},
      'euDevo': {'total': '0.00', 'quantidade': 0},
    });
    expect(resumo.meDevem.quantidade, 1);
    expect(DebtBucket.fromJson(null).total, 0);
    expect(debtMoney('2,5'), 2.5);
  });
}
