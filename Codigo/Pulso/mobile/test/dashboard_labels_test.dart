import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';
import 'package:pulso/features/dashboard/utils/dashboard_labels.dart';

void main() {
  test('rotulos de variacao, saude e alerta', () {
    expect(dashboardVariacaoLabel('igual', 0), 'Estável no mês');
    expect(dashboardVariacaoLabel('sem_base', 0), 'Sem base anterior');
    expect(dashboardVariacaoLabel('valor_novo', 10), 'Saldo novo neste mês');
    expect(
      dashboardVariacaoLabel('percentual', 12.5),
      '+12.5% vs mês anterior',
    );
    expect(dashboardVariacaoLabel('percentual', -3), '-3.0% vs mês anterior');
    expect(dashboardVariacaoLabel('outro', 0), 'Variação indisponível');
    expect(dashboardVariacaoVisual('percentual', 2).tom, 'alta');
    expect(dashboardVariacaoVisual('percentual', -2).tom, 'queda');
    expect(dashboardVariacaoVisual('igual', 0).tom, 'neutro');
    expect(dashboardSaudeTom(90), 'excelente');
    expect(dashboardSaudeTom(70), 'bom');
    expect(dashboardSaudeTom(50), 'regular');
    expect(dashboardSaudeTom(20), 'atencao');
    expect(dashboardAlertaLabel(80), 'Em alerta · 80%');
    expect(dashboardAlertaLabel(120), 'Estourou · 120%');
  });

  test('modelo lê o payload do dashboard', () {
    final dash = PulsoDashboard.fromJson({
      'mes': '2026-10',
      'saldoTotal': {
        'valor': '1500.50',
        'variacao': {'tipo': 'percentual', 'valor': 8.2},
      },
      'receitasDespesas': {
        'receitasTotal': '3000.00',
        'despesasTotal': '1200.00',
      },
      'recursos': [
        {'tipo': 'VR', 'saldo': '80.00', 'sugestaoDiaria': '8.00'},
        {'tipo': 'DINHEIRO', 'saldo': '20.00', 'sugestaoDiaria': null},
      ],
      'gastosPorCategoria': [
        {'nome': 'Mercado', 'total': 400, 'percentual': 40, 'cor': '#7C3AED'},
      ],
      'alertasOrcamento': [
        {
          'categoriaNome': 'Lazer',
          'percentualUsado': 110,
          'status': 'ESTOURADO',
        },
      ],
      'ultimasTransacoes': [
        {
          'id': 't1',
          'tipo': 'DESPESA',
          'valor': '42.90',
          'data': '2026-10-02T12:00:00.000Z',
          'descricao': 'Almoço',
          'categoria': {'nome': 'Alimentação'},
        },
      ],
      'metasAtivas': [
        {'nome': 'Reserva', 'progresso': 30, 'status': 'ATIVA'},
      ],
      'saudeFinanceira': {
        'score': 82,
        'label': 'Excelente',
        'mensagem': 'Mês saudável',
        'checklist': [
          {'id': 'fluxo', 'ok': true, 'texto': 'Receitas cobrem as despesas'},
        ],
      },
    });

    expect(dash.saldoTotal, 1500.50);
    expect(dash.variacao.tipo, 'percentual');
    expect(dash.receitas, 3000);
    expect(dash.despesas, 1200);
    expect(dash.recursos.first.sugestaoDiaria, 8);
    expect(dash.categorias.single.nome, 'Mercado');
    expect(dash.alertas.single.estourou, isTrue);
    expect(dash.transacoes.single.categoriaNome, 'Alimentação');
    expect(dash.metas.single.progresso, 30);
    expect(dash.saude.checklist.single.ok, isTrue);
    expect(PulsoDashboard.fromJson({}).saude.label, 'Regular');
    expect(dashboardMoney('1,5'), 1.5);
    expect(dashboardMoney(null), 0);
  });
}
