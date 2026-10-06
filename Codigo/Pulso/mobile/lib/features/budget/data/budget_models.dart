double _num(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}


class BudgetResumo {
  const BudgetResumo({
    this.orcamentoTotal = 0,
    this.gastoTotal = 0,
    this.restanteTotal = 0,
    this.percentualUsado = 0,
    this.orcamentoExcedeRenda = false,
  });

  final double orcamentoTotal;
  final double gastoTotal;
  final double restanteTotal;
  final double percentualUsado;
  final bool orcamentoExcedeRenda;

  factory BudgetResumo.fromJson(Map<String, dynamic> json) {
    return BudgetResumo(
      orcamentoTotal: _num(json['orcamentoTotal']),
      gastoTotal: _num(json['gastoTotal']),
      restanteTotal: _num(json['restanteTotal']),
      percentualUsado: _num(json['percentualUsado']),
      orcamentoExcedeRenda: json['orcamentoExcedeRenda'] == true,
    );
  }
}

class BudgetCategoria {
  const BudgetCategoria({
    required this.categoriaId,
    required this.categoriaNome,
    this.categoriaIcone,
    this.categoriaCor,
    this.limiteValor = 0,
    this.gastoValor = 0,
    this.restanteValor = 0,
    this.percentualUsado = 0,
    this.status = 'normal',
    this.rolloverAtivo = false,
    this.valorRollover = 0,
  });

  final String categoriaId;
  final String categoriaNome;
  final String? categoriaIcone;
  final String? categoriaCor;
  final double limiteValor;
  final double gastoValor;
  final double restanteValor;
  final double percentualUsado;
  final String status;
  final bool rolloverAtivo;
  final double valorRollover;

  factory BudgetCategoria.fromJson(Map<String, dynamic> json) {
    return BudgetCategoria(
      categoriaId: json['categoriaId'] as String? ?? '',
      categoriaNome: json['categoriaNome'] as String? ?? '',
      categoriaIcone: json['categoriaIcone'] as String?,
      categoriaCor: json['categoriaCor'] as String?,
      limiteValor: _num(json['limiteValor']),
      gastoValor: _num(json['gastoValor']),
      restanteValor: _num(json['restanteValor']),
      percentualUsado: _num(json['percentualUsado']),
      status: json['status'] as String? ?? 'normal',
      rolloverAtivo: json['rolloverAtivo'] == true,
      valorRollover: _num(json['valorRollover']),
    );
  }
}

class BudgetCategoriaLivre {
  const BudgetCategoriaLivre({required this.id, required this.nome, this.icone, this.cor});

  final String id;
  final String nome;
  final String? icone;
  final String? cor;

  factory BudgetCategoriaLivre.fromJson(Map<String, dynamic> json) {
    return BudgetCategoriaLivre(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? '',
      icone: json['icone'] as String?,
      cor: json['cor'] as String?,
    );
  }
}

class BudgetStatus {
  const BudgetStatus({
    required this.mesReferencia,
    this.mesQuery,
    this.rendaMensalPlanejada = 0,
    required this.resumo,
    this.categorias = const [],
    this.categoriasSemOrcamento = const [],
  });

  final String mesReferencia;
  final String? mesQuery;
  final double rendaMensalPlanejada;
  final BudgetResumo resumo;
  final List<BudgetCategoria> categorias;
  final List<BudgetCategoriaLivre> categoriasSemOrcamento;

  factory BudgetStatus.fromJson(Map<String, dynamic> json) {
    return BudgetStatus(
      mesReferencia: json['mesReferencia'] as String? ?? '',
      mesQuery: json['mesQuery'] as String?,
      rendaMensalPlanejada: _num(json['rendaMensalPlanejada']),
      resumo: BudgetResumo.fromJson(json['resumo'] as Map<String, dynamic>? ?? const {}),
      categorias: (json['categorias'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(BudgetCategoria.fromJson)
          .toList(),
      categoriasSemOrcamento: (json['categoriasSemOrcamento'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(BudgetCategoriaLivre.fromJson)
          .toList(),
    );
  }
}

class BudgetLimiteInput {
  const BudgetLimiteInput({
    required this.categoriaId,
    required this.limiteValor,
    this.rolloverAtivo = false,
  });

  final String categoriaId;
  final double limiteValor;
  final bool rolloverAtivo;

  Map<String, dynamic> toJson() => {
        'categoriaId': categoriaId,
        'limiteValor': limiteValor,
        'rolloverAtivo': rolloverAtivo,
      };
}
