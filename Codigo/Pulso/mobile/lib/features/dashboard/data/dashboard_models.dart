double dashboardMoney(dynamic value) {
  if (value is num) return value.toDouble();
  final raw = '${value ?? ''}'.trim().replaceAll(',', '.');
  return double.tryParse(raw) ?? 0;
}

class DashboardVariacao {
  const DashboardVariacao({required this.tipo, required this.valor});

  final String tipo;
  final double valor;

  factory DashboardVariacao.fromJson(dynamic json) {
    if (json is! Map) return const DashboardVariacao(tipo: 'igual', valor: 0);
    return DashboardVariacao(
      tipo: json['tipo'] as String? ?? 'igual',
      valor: dashboardMoney(json['valor']),
    );
  }
}

class DashboardRecurso {
  const DashboardRecurso({
    required this.tipo,
    required this.saldo,
    this.sugestaoDiaria,
  });

  final String tipo;
  final double saldo;
  final double? sugestaoDiaria;

  factory DashboardRecurso.fromJson(Map<String, dynamic> json) {
    final sugestao = json['sugestaoDiaria'];
    return DashboardRecurso(
      tipo: json['tipo'] as String? ?? 'DINHEIRO',
      saldo: dashboardMoney(json['saldo']),
      sugestaoDiaria: sugestao == null ? null : dashboardMoney(sugestao),
    );
  }
}

class DashboardCategoriaGasto {
  const DashboardCategoriaGasto({
    required this.nome,
    required this.total,
    required this.percentual,
    this.cor,
  });

  final String nome;
  final double total;
  final double percentual;
  final String? cor;

  factory DashboardCategoriaGasto.fromJson(Map<String, dynamic> json) {
    return DashboardCategoriaGasto(
      nome: json['nome'] as String? ?? 'Outros',
      total: dashboardMoney(json['total']),
      percentual: dashboardMoney(json['percentual']),
      cor: json['cor'] as String?,
    );
  }
}

class DashboardAlerta {
  const DashboardAlerta({
    required this.categoriaNome,
    required this.percentualUsado,
    this.status,
  });

  final String categoriaNome;
  final double percentualUsado;
  final String? status;

  bool get estourou => percentualUsado >= 100;

  factory DashboardAlerta.fromJson(Map<String, dynamic> json) {
    return DashboardAlerta(
      categoriaNome: json['categoriaNome'] as String? ?? 'Categoria',
      percentualUsado: dashboardMoney(json['percentualUsado']),
      status: json['status'] as String?,
    );
  }
}

class DashboardTransacao {
  const DashboardTransacao({
    required this.id,
    required this.tipo,
    required this.valor,
    required this.data,
    this.descricao,
    this.categoriaNome,
  });

  final String id;
  final String tipo;
  final double valor;
  final DateTime? data;
  final String? descricao;
  final String? categoriaNome;

  factory DashboardTransacao.fromJson(Map<String, dynamic> json) {
    final categoria = json['categoria'];
    return DashboardTransacao(
      id: json['id'] as String? ?? '',
      tipo: json['tipo'] as String? ?? 'DESPESA',
      valor: dashboardMoney(json['valor']),
      data: DateTime.tryParse(json['data'] as String? ?? ''),
      descricao: json['descricao'] as String?,
      categoriaNome: categoria is Map ? categoria['nome'] as String? : null,
    );
  }
}

class DashboardMeta {
  const DashboardMeta({
    required this.nome,
    required this.progresso,
    this.status = 'ATIVA',
    this.valorAtual = 0,
    this.valorAlvo = 0,
  });

  final String nome;
  final double progresso;
  final String status;
  final double valorAtual;
  final double valorAlvo;

  factory DashboardMeta.fromJson(Map<String, dynamic> json) {
    return DashboardMeta(
      nome: json['nome'] as String? ?? 'Meta',
      progresso: dashboardMoney(json['progresso'] ?? json['percentual']),
      status: json['status'] as String? ?? 'ATIVA',
      valorAtual: dashboardMoney(json['valorAtual']),
      valorAlvo: dashboardMoney(json['valorAlvo']),
    );
  }
}

class DashboardChecklistItem {
  const DashboardChecklistItem({
    required this.id,
    required this.ok,
    required this.texto,
  });

  final String id;
  final bool ok;
  final String texto;

  factory DashboardChecklistItem.fromJson(Map<String, dynamic> json) {
    return DashboardChecklistItem(
      id: json['id'] as String? ?? '',
      ok: json['ok'] == true,
      texto: json['texto'] as String? ?? '',
    );
  }
}

class DashboardSaude {
  const DashboardSaude({
    required this.score,
    required this.label,
    required this.mensagem,
    this.checklist = const [],
  });

  final int score;
  final String label;
  final String mensagem;
  final List<DashboardChecklistItem> checklist;

  factory DashboardSaude.fromJson(dynamic json) {
    if (json is! Map) {
      return const DashboardSaude(score: 0, label: 'Regular', mensagem: '');
    }
    final items = json['checklist'];
    return DashboardSaude(
      score: dashboardMoney(json['score']).round(),
      label: json['label'] as String? ?? 'Regular',
      mensagem: json['mensagem'] as String? ?? '',
      checklist: items is List
          ? items
                .whereType<Map>()
                .map(
                  (item) => DashboardChecklistItem.fromJson(
                    Map<String, dynamic>.from(item),
                  ),
                )
                .toList()
          : const [],
    );
  }
}

class PulsoDashboard {
  const PulsoDashboard({
    required this.mes,
    required this.saldoTotal,
    required this.variacao,
    required this.receitas,
    required this.despesas,
    this.recursos = const [],
    this.categorias = const [],
    this.alertas = const [],
    this.transacoes = const [],
    this.metas = const [],
    required this.saude,
  });

  final String mes;
  final double saldoTotal;
  final DashboardVariacao variacao;
  final double receitas;
  final double despesas;
  final List<DashboardRecurso> recursos;
  final List<DashboardCategoriaGasto> categorias;
  final List<DashboardAlerta> alertas;
  final List<DashboardTransacao> transacoes;
  final List<DashboardMeta> metas;
  final DashboardSaude saude;

  factory PulsoDashboard.fromJson(Map<String, dynamic> json) {
    final saldo = json['saldoTotal'];
    final fluxo = json['receitasDespesas'];
    final resumo = json['resumoMes'];
    double totalDe(String chave) {
      if (fluxo is Map && fluxo['${chave}Total'] != null) {
        return dashboardMoney(fluxo['${chave}Total']);
      }
      if (resumo is Map && resumo[chave] is Map) {
        return dashboardMoney((resumo[chave] as Map)['total']);
      }
      return 0;
    }

    List<T> lista<T>(dynamic raw, T Function(Map<String, dynamic>) parse) {
      if (raw is! List) return <T>[];
      return raw
          .whereType<Map>()
          .map((item) => parse(Map<String, dynamic>.from(item)))
          .toList();
    }

    return PulsoDashboard(
      mes: json['mes'] as String? ?? '',
      saldoTotal: saldo is Map
          ? dashboardMoney(saldo['valor'])
          : dashboardMoney(saldo),
      variacao: DashboardVariacao.fromJson(
        saldo is Map ? saldo['variacao'] : null,
      ),
      receitas: totalDe('receitas'),
      despesas: totalDe('despesas'),
      recursos: lista(json['recursos'], DashboardRecurso.fromJson),
      categorias: lista(
        json['gastosPorCategoria'],
        DashboardCategoriaGasto.fromJson,
      ),
      alertas: lista(json['alertasOrcamento'], DashboardAlerta.fromJson),
      transacoes: lista(json['ultimasTransacoes'], DashboardTransacao.fromJson),
      metas: lista(json['metasAtivas'], DashboardMeta.fromJson),
      saude: DashboardSaude.fromJson(json['saudeFinanceira']),
    );
  }
}
