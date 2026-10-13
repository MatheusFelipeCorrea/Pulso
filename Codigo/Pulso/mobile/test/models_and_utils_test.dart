import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/config/app_config.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/features/budget/data/budget_models.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/currency/data/currency_models.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/utils/transaction_rules.dart';
import 'package:pulso/features/trips/data/trip_models.dart';

void main() {
  test('formatters cobrem labels, cores e datas', () {
    expect(TransactionPeriod.current(), matches(RegExp(r'^\d{4}-\d{2}$')));
    expect(recursoLabel('DINHEIRO'), 'Dinheiro');
    expect(recursoLabel('VA'), 'VA');
    expect(recursoLabel('VR'), 'VR');
    expect(recursoLabel('VT'), 'VT');
    expect(recursoLabel('POUPANCA'), 'Poupança');
    expect(recursoLabel('X'), 'X');
    expect(parseHexColor(null), isNull);
    expect(parseHexColor(''), isNull);
    expect(parseHexColor('#123'), isNull);
    expect(parseHexColor('#7C3AED'), const Color(0xFF7C3AED));
    expect(parseHexColor('80FFFFFF'), isNotNull);
    expect(parseMoney(''), isNull);
    expect(formatDayHeader(DateTime(2026, 3, 9)), '09/03/2026');
    expect(isoDate(DateTime(2026, 3, 9)).contains('2026'), isTrue);
    expect(formatDayTitle('2026-03-09'), '9 de março');
    expect(formatDayTitle('ruim'), 'ruim');
    expect(formatShortDate(null), '—');
    expect(formatShortDate(DateTime(2026, 10, 8)), '08 out 2026');
  });

  test('regras de transação cobrem VT, grupos e recorrência', () {
    expect(inferirGrupoBeneficioPorNome('Alimentação'), grupoAlimentacao);
    expect(inferirGrupoBeneficioPorNome('mercado'), grupoCompras);
    expect(inferirGrupoBeneficioPorNome('uber'), 'TRANSPORTE');
    expect(resolverGrupoBeneficio(grupoBeneficio: 'COMPRAS'), grupoCompras);
    expect(
      validarRecursoCategoria(recurso: 'VT', tipo: 'DESPESA'),
      contains('VT'),
    );
    expect(
      validarRecursoCategoria(recurso: 'DINHEIRO', tipo: 'DESPESA'),
      isNull,
    );
    expect(
      validarRecursoCategoria(
        recurso: 'VA',
        tipo: 'DESPESA',
        categoriaNome: 'Lazer',
      ),
      isNotNull,
    );
    expect(
      validarRecursoCategoria(
        recurso: 'VR',
        tipo: 'DESPESA',
        categoriaNome: 'Alimentação',
        grupoBeneficio: grupoAlimentacao,
      ),
      isNull,
    );
    expect(validarTransferencia(null, 'VA'), isNotNull);
    expect(
      buildRecurrenceRule(frequencia: 'SEMANAL', ateQuando: 'SEM_FIM'),
      contains('WEEKLY'),
    );
    expect(
      buildRecurrenceRule(
        frequencia: 'ANUAL',
        ateQuando: 'DATA',
        dataFim: DateTime(2027, 1, 2),
      ),
      contains('UNTIL=20270102'),
    );
  });

  test('modelos extras parseiam payloads parciais', () {
    expect(
      PulsoGrupo.fromJson({
        'id': 'g',
        'membros': [{}, {}],
      }).quantidadeMembros,
      2,
    );
    expect(PulsoGrupo.fromJson({'titulo': 'Casa'}).nome, 'Casa');

    final viagem = PulsoViagem.fromJson({
      'id': 'v1',
      'destino': 'Lisboa',
      'dataPrevista': 'nao-data',
      'totalBrl': '10',
      'destinoMeta': {'coverImageUrl': ' https://img '},
      'despesas': [
        {'id': 'e1', 'valorEstimado': 20},
      ],
      'observacoes': [
        {'id': 'n1', 'titulo': 'Hotel'},
      ],
    });
    expect(viagem.coverImageUrl, 'https://img');
    expect(viagem.despesas.single.categoria, 'OUTROS');
    expect(
      PulsoViagem.fromJson({'id': 'v2', 'coverImageUrl': 'https://x'})
          .coverImageUrl,
      'https://x',
    );

    final hint = TripDestinationHint.fromJson({
      'label': 'SP',
      'catalogId': 'c1',
      'iata': 'GRU',
      'countryCode': 'BR',
      'geonameId': 1,
      'region': 'SP',
      'domestic': true,
    });
    expect(hint.toDestinoMeta()?['iata'], 'GRU');
    expect(
      TripDestinationHint.fromJson({'destino': 'X'}).toDestinoMeta(),
      isNull,
    );

    expect(tripNum('1.5'), 1.5);
    expect(tripDate(DateTime(2026, 1, 1)).year, 2026);

    final painel = PurchasePainel.fromJson({
      'resumo': {
        'categorias': {
          'ELETRONICOS': {
            'label': 'Eletrônicos',
            'quantidade': 1,
            'total': '10',
          },
        },
        'dicas': ['guarde'],
      },
      'itens': [
        {
          'id': 'p1',
          'nome': 'Fone',
          'valorEstimado': 'x',
          'meta': {'id': 'm', 'nome': 'Meta', 'percentual': '10'},
          'simulacoes': [
            {'parcelas': 3, 'parcela': '30', 'percentual': '5', 'nivel': 'ok'},
          ],
        },
      ],
      'comprados': [
        {
          'id': 'c1',
          'nome': 'Livro',
          'compradoEm': '2026-01-01T12:00:00.000Z',
          'diasNaLista': 2,
        },
      ],
    });
    expect(painel.resumo.categorias['ELETRONICOS']?.quantidade, 1);
    expect(painel.itens.single.meta?.nome, 'Meta');
    expect(painel.comprados.single.diasNaLista, 2);
    expect(purchaseLook('ELETRONICOS').lucide, 'Smartphone');
    expect(purchaseLook('NOPE').lucide, 'Sparkles');
    expect(
      const BudgetLimiteInput(
        categoriaId: 'c',
        limiteValor: 10,
        rolloverAtivo: true,
      ).toJson()['rolloverAtivo'],
      isTrue,
    );

    final dia = CalendarDayDetail.fromJson({
      'data': '2026-10-08',
      'totais': {'receitas': '1', 'despesas': '2', 'saldo': '-1'},
      'lembretes': [
        {'id': 'l', 'titulo': 'Luz', 'dataVencimento': DateTime(2026, 10, 8)},
      ],
      'transacoes': [
        {'id': 't'},
      ],
    });
    expect(dia.transacoesCount, 1);
    expect(
      GoogleCalendarStatus.fromJson({'conectado': true, 'email': 'a@b'})
          .conectado,
      isTrue,
    );

    expect(goalNum(null), 0);
    expect(goalDate(DateTime(2026)).year, 2026);
    final filtros = const GoalFilters(
      status: 'ATIVA',
      busca: '  casa  ',
    ).copyWith(clearTipo: true, pagina: 2);
    expect(filtros.toQuery()['busca'], 'casa');
    expect(GoalCategorySlice.fromJson(null).quantidade, 0);
    expect(
      GoalResumo.fromJson({'metasAtivas': '1', 'categorias': {}}).metasAtivas,
      1,
    );
    expect(
      ReservaEmergenciaSugestao.fromJson({'valorSugerido': '12'}).valorSugerido,
      12,
    );
    expect(
      const GoalFilters(tipo: 'CURTO_PRAZO')
          .copyWith(clearStatus: true, status: 'X')
          .tipo,
      'CURTO_PRAZO',
    );
    expect(
      GoalResumo.fromJson({
        'categorias': {
          'curtoPrazo': {'quantidade': 1, 'total': '10'},
          'longoPrazo': {'quantidade': 2, 'total': '20'},
          'concluidas': {'quantidade': 3, 'total': '30'},
          'pausadas': {'quantidade': 4, 'total': '40'},
        },
      }).pausadas.quantidade,
      4,
    );

    final resumoTx = TransactionResumo.fromJson({
      'receitas': {'total': '10', 'quantidade': '2'},
      'despesas': {'total': 4, 'quantidade': 1.2},
      'saldo': null,
      'modo': 'CLT',
    });
    expect(resumoTx.quantidadeReceitas, 2);
    expect(resumoTx.quantidadeDespesas, 1);
    expect(resumoTx.saldo, 0);
    expect(FilterOption.fromJson({'value': 'VA'}).label, 'VA');
    final opts = TransactionFilterOptions.fromJson({
      'categorias': [
        {
          'id': 'c1',
          'nome': 'Alimentação',
          'tipo': 'DESPESA',
          'padrao': true,
          'grupoBeneficio': 'ALIMENTACAO',
        },
      ],
      'tags': [
        {'id': 't1', 'icone': 'Tag', 'cor': '#fff'},
      ],
      'tipos': [
        {'value': 'DESPESA', 'label': 'Despesa'},
      ],
      'formulario': {
        'recursos': [
          {'value': 'DINHEIRO', 'label': 'Dinheiro'},
        ],
        'frequencias': [
          {'value': 'MENSAL', 'label': 'Mensal'},
        ],
        'ateQuando': [
          {'value': 'SEM_FIM', 'label': 'Sem fim'},
        ],
      },
    });
    expect(opts.categorias.single.padrao, isTrue);
    expect(opts.tags.single.nome, '');
    expect(opts.formRecursos.single.value, 'DINHEIRO');
    final filtrosTx = const TransactionFilters(
      periodo: '2026-10',
      categoriaId: 'c1',
      busca: '  x  ',
    );
    expect(filtrosTx.hasExtraFilters, isTrue);
    expect(
      filtrosTx.copyWith(clearCategoria: true, tipo: 'RECEITA').categoriaId,
      isNull,
    );
    expect(
      const TransactionFilters(
        periodo: '2026-10',
        recurso: 'VA',
      ).toQuery(pagina: 1)['recurso'],
      'VA',
    );
    expect(
      PulsoTransacao.fromJson({
        'id': 't',
        'data': DateTime.utc(2026, 1, 2),
        'valor': 'x',
        'paiId': 'p1',
      }).isRecorrenteSerie,
      isTrue,
    );

    expect(
      CurrencyItem.fromJson({'codigo': 'usd', 'nome': 'Dólar'}).code,
      'USD',
    );
    expect(CurrencyQuote.fromJson({'codigo': 'eur', 'taxa': '5.1'}).rate, 5.1);
    expect(
      FavoriteCurrency.fromJson({'codigo': 'jpy', 'bid': 0.04}).rate,
      0.04,
    );
    expect(
      FavoriteCurrency.fromJson({
        'moeda': {
          'code': 'cad',
          'name': 'Dólar canadense',
          'bid': 4.1,
          'pctChange': 1.2,
        },
      }).name,
      'Dólar canadense',
    );
    expect(
      CurrencyHistory.fromJson({
        'resumo': {'atual': 1, 'minima': 0.5, 'maxima': 2, 'variacao': 0.1},
        'pontos': [
          {'date': '2026-01-01', 'valor': '1.1'},
        ],
      }).pontos.single.bid,
      1.1,
    );
  });

  test('tokens, cores e erros da API', () {
    expect(PulsoTokens.shadowSm(true), isEmpty);
    expect(PulsoTokens.shadowSm(false), isNotEmpty);
    expect(PulsoTokens.shadowMd(true), isEmpty);
    expect(PulsoTokens.shadowMd(false), isNotEmpty);
    expect(PulsoTokens.shadowLg(true), isNotEmpty);
    expect(PulsoTokens.shadowLg(false), isNotEmpty);
    expect(PulsoColors.primary, const Color(0xFF7C3AED));
    expect(PulsoColors.onBackground(Brightness.dark), PulsoColors.darkText);
    expect(
      PulsoColors.secondaryText(Brightness.light),
      PulsoColors.lightSecondary,
    );
    expect(PulsoColors.surface(Brightness.light), PulsoColors.lightCard);
    expect(PulsoColors.border(Brightness.dark), PulsoColors.darkBorder);
    expect(PulsoColors.infoOf(Brightness.dark), PulsoColors.infoDark);
    expect(PulsoColors.cyanOf(Brightness.light), PulsoColors.cyan);
    expect(PulsoColors.orangeOf(Brightness.dark), PulsoColors.orangeDark);
    expect(PulsoColors.successOf(Brightness.light), PulsoColors.success);
    expect(PulsoColors.warningOf(Brightness.dark), PulsoColors.warningDark);
    expect(PulsoColors.dangerOf(Brightness.light), PulsoColors.danger);
    expect(PulsoColors.accent(Brightness.dark), PulsoColors.primaryLight);
    expect(PulsoColors.accent(Brightness.light), PulsoColors.primary);
    expect(AppConfig.apiBaseUrl, contains('3333'));
    final err = ApiException('x', statusCode: 401);
    expect(err.isUnauthorized, isTrue);
    expect(ApiException('x', statusCode: 403).isForbidden, isTrue);
    expect(ApiException('x', statusCode: 409).isConflict, isTrue);
    expect(err.toString(), 'x');
  });
}
