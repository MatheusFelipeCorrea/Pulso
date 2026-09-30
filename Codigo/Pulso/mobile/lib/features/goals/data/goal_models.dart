double goalNum(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}

DateTime goalDate(dynamic value) {
  if (value is DateTime) return value;
  return DateTime.tryParse('$value') ?? DateTime.now();
}

class GoalAporte {
  const GoalAporte({
    required this.id,
    required this.valor,
    required this.data,
  });

  final String id;
  final double valor;
  final DateTime data;

  factory GoalAporte.fromJson(Map<String, dynamic> json) {
    return GoalAporte(
      id: json['id'] as String? ?? '',
      valor: goalNum(json['valor']),
      data: goalDate(json['data']),
    );
  }
}

class PulsoMeta {
  const PulsoMeta({
    required this.id,
    required this.nome,
    required this.valorAlvo,
    required this.valorAtual,
    required this.valorRestante,
    required this.percentual,
    required this.prazo,
    required this.tipo,
    required this.status,
    this.prioridade,
    this.descricao,
    this.valorMensalSugerido = 0,
    this.mesesRestantes = 0,
    this.vencida = false,
    this.aportes = const [],
  });

  final String id;
  final String nome;
  final double valorAlvo;
  final double valorAtual;
  final double valorRestante;
  final double percentual;
  final DateTime prazo;
  final String tipo;
  final String status;
  final String? prioridade;
  final String? descricao;
  final double valorMensalSugerido;
  final int mesesRestantes;
  final bool vencida;
  final List<GoalAporte> aportes;

  factory PulsoMeta.fromJson(Map<String, dynamic> json) {
    return PulsoMeta(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? '',
      valorAlvo: goalNum(json['valorAlvo']),
      valorAtual: goalNum(json['valorAtual']),
      valorRestante: goalNum(json['valorRestante']),
      percentual: goalNum(json['percentual']),
      prazo: goalDate(json['prazo']),
      tipo: json['tipo'] as String? ?? 'CURTO_PRAZO',
      status: json['status'] as String? ?? 'ATIVA',
      prioridade: json['prioridade'] as String?,
      descricao: json['descricao'] as String?,
      valorMensalSugerido: goalNum(json['valorMensalSugerido']),
      mesesRestantes: goalNum(json['mesesRestantes']).round(),
      vencida: json['vencida'] == true,
      aportes: (json['aportes'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(GoalAporte.fromJson)
          .toList(),
    );
  }
}

class GoalCategorySlice {
  const GoalCategorySlice({this.quantidade = 0, this.total = 0});

  final int quantidade;
  final double total;

  factory GoalCategorySlice.fromJson(dynamic json) {
    if (json is! Map) return const GoalCategorySlice();
    return GoalCategorySlice(
      quantidade: goalNum(json['quantidade']).round(),
      total: goalNum(json['total']),
    );
  }
}

class GoalResumo {
  const GoalResumo({
    required this.totalEmMetas,
    required this.totalAcumulado,
    required this.progressoMedio,
    required this.metasAtivas,
    required this.sugestaoMensal,
    this.curtoPrazo = const GoalCategorySlice(),
    this.longoPrazo = const GoalCategorySlice(),
    this.concluidas = const GoalCategorySlice(),
    this.pausadas = const GoalCategorySlice(),
  });

  final double totalEmMetas;
  final double totalAcumulado;
  final double progressoMedio;
  final int metasAtivas;
  final double sugestaoMensal;
  final GoalCategorySlice curtoPrazo;
  final GoalCategorySlice longoPrazo;
  final GoalCategorySlice concluidas;
  final GoalCategorySlice pausadas;

  factory GoalResumo.fromJson(Map<String, dynamic> json) {
    final categorias = json['categorias'] is Map<String, dynamic>
        ? json['categorias'] as Map<String, dynamic>
        : const <String, dynamic>{};
    return GoalResumo(
      totalEmMetas: goalNum(json['totalEmMetas']),
      totalAcumulado: goalNum(json['totalAcumulado']),
      progressoMedio: goalNum(json['progressoMedio']),
      metasAtivas: goalNum(json['metasAtivas']).round(),
      sugestaoMensal: goalNum(json['sugestaoMensal']),
      curtoPrazo: GoalCategorySlice.fromJson(categorias['curtoPrazo']),
      longoPrazo: GoalCategorySlice.fromJson(categorias['longoPrazo']),
      concluidas: GoalCategorySlice.fromJson(categorias['concluidas']),
      pausadas: GoalCategorySlice.fromJson(categorias['pausadas']),
    );
  }
}

class GoalListPage {
  const GoalListPage({
    required this.metas,
    required this.total,
    required this.paginas,
    required this.pagina,
  });

  final List<PulsoMeta> metas;
  final int total;
  final int paginas;
  final int pagina;
}

class GoalFilters {
  const GoalFilters({
    this.status,
    this.tipo,
    this.busca = '',
    this.pagina = 1,
    this.limite = 10,
  });

  final String? status;
  final String? tipo;
  final String busca;
  final int pagina;
  final int limite;

  GoalFilters copyWith({
    String? status,
    bool clearStatus = false,
    String? tipo,
    bool clearTipo = false,
    String? busca,
    int? pagina,
  }) {
    return GoalFilters(
      status: clearStatus ? null : (status ?? this.status),
      tipo: clearTipo ? null : (tipo ?? this.tipo),
      busca: busca ?? this.busca,
      pagina: pagina ?? this.pagina,
      limite: limite,
    );
  }

  Map<String, dynamic> toQuery() {
    return {
      if (status != null) 'status': status,
      if (tipo != null) 'tipo': tipo,
      if (busca.trim().isNotEmpty) 'busca': busca.trim(),
      'pagina': pagina,
      'limite': limite,
    };
  }
}

class ReservaEmergenciaSugestao {
  const ReservaEmergenciaSugestao({required this.valorSugerido});

  final double valorSugerido;

  factory ReservaEmergenciaSugestao.fromJson(Map<String, dynamic> json) {
    return ReservaEmergenciaSugestao(valorSugerido: goalNum(json['valorSugerido']));
  }
}
