class PulsoTag {
  const PulsoTag({required this.id, required this.nome, this.icone, this.cor});

  final String id;
  final String nome;
  final String? icone;
  final String? cor;

  factory PulsoTag.fromJson(Map<String, dynamic> json) {
    return PulsoTag(
      id: json['id'] as String,
      nome: json['nome'] as String? ?? '',
      icone: json['icone'] as String?,
      cor: json['cor'] as String?,
    );
  }
}

class PulsoCategoria {
  const PulsoCategoria({
    required this.id,
    required this.nome,
    required this.tipo,
    this.icone,
    this.cor,
    this.grupoBeneficio,
    this.padrao = false,
  });

  final String id;
  final String nome;
  final String tipo;
  final String? icone;
  final String? cor;
  final String? grupoBeneficio;
  final bool padrao;

  factory PulsoCategoria.fromJson(Map<String, dynamic> json) {
    return PulsoCategoria(
      id: json['id'] as String,
      nome: json['nome'] as String? ?? '',
      tipo: json['tipo'] as String? ?? 'DESPESA',
      icone: json['icone'] as String?,
      cor: json['cor'] as String?,
      grupoBeneficio: json['grupoBeneficio'] as String?,
      padrao: json['padrao'] == true,
    );
  }
}

class PulsoTransacao {
  const PulsoTransacao({
    required this.id,
    required this.tipo,
    required this.recurso,
    required this.valor,
    required this.data,
    required this.recorrente,
    this.recursoDestino,
    this.descricao,
    this.regraRecorrencia,
    this.paiId,
    this.categoria,
    this.tags = const [],
  });

  final String id;
  final String tipo;
  final String recurso;
  final String? recursoDestino;
  final double valor;
  final String? descricao;
  final DateTime data;
  final bool recorrente;
  final String? regraRecorrencia;
  final String? paiId;
  final PulsoCategoria? categoria;
  final List<PulsoTag> tags;

  bool get isRecorrenteSerie =>
      recorrente || (paiId != null && paiId!.isNotEmpty);

  factory PulsoTransacao.fromJson(Map<String, dynamic> json) {
    return PulsoTransacao(
      id: _asRequiredString(json['id']),
      tipo: _asRequiredString(json['tipo'], 'DESPESA'),
      recurso: _asRequiredString(json['recurso'], 'PESSOAL'),
      recursoDestino: json['recursoDestino'] as String?,
      valor: _asMoney(json['valor']),
      descricao: json['descricao'] as String?,
      data: _asDate(json['data']),
      recorrente: json['recorrente'] == true,
      regraRecorrencia: json['regraRecorrencia'] as String?,
      paiId: json['paiId'] as String?,
      categoria: json['categoria'] is Map<String, dynamic>
          ? PulsoCategoria.fromJson(json['categoria'] as Map<String, dynamic>)
          : null,
      tags: (json['tags'] as List<dynamic>? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoTag.fromJson)
          .toList(),
    );
  }
}

class TransactionResumo {
  const TransactionResumo({
    required this.receitas,
    required this.despesas,
    required this.saldo,
    this.quantidadeReceitas = 0,
    this.quantidadeDespesas = 0,
    this.modo,
  });

  final double receitas;
  final double despesas;
  final double saldo;
  final int quantidadeReceitas;
  final int quantidadeDespesas;
  final String? modo;

  factory TransactionResumo.fromJson(Map<String, dynamic> json) {
    return TransactionResumo(
      receitas: _asMoney((json['receitas'] as Map?)?['total']),
      despesas: _asMoney((json['despesas'] as Map?)?['total']),
      saldo: _asMoney(json['saldo']),
      quantidadeReceitas: _asInt((json['receitas'] as Map?)?['quantidade']),
      quantidadeDespesas: _asInt((json['despesas'] as Map?)?['quantidade']),
      modo: json['modo'] as String?,
    );
  }
}

class FilterOption {
  const FilterOption({required this.value, required this.label});

  final String value;
  final String label;

  factory FilterOption.fromJson(Map<String, dynamic> json) {
    return FilterOption(
      value: json['value'] as String,
      label: json['label'] as String? ?? json['value'] as String,
    );
  }
}

class TransactionFilterOptions {
  const TransactionFilterOptions({
    required this.categorias,
    required this.tags,
    required this.tipos,
    required this.recursos,
    required this.formRecursos,
    required this.frequencias,
    required this.ateQuando,
  });

  final List<PulsoCategoria> categorias;
  final List<PulsoTag> tags;
  final List<FilterOption> tipos;
  final List<FilterOption> recursos;
  final List<FilterOption> formRecursos;
  final List<FilterOption> frequencias;
  final List<FilterOption> ateQuando;

  factory TransactionFilterOptions.fromJson(Map<String, dynamic> json) {
    final form = json['formulario'] as Map<String, dynamic>? ?? {};
    return TransactionFilterOptions(
      categorias: (json['categorias'] as List<dynamic>? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoCategoria.fromJson)
          .toList(),
      tags: (json['tags'] as List<dynamic>? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoTag.fromJson)
          .toList(),
      tipos: _options(json['tipos']),
      recursos: _options(json['recursos']),
      formRecursos: _options(form['recursos']),
      frequencias: _options(form['frequencias']),
      ateQuando: _options(form['ateQuando']),
    );
  }

  static List<FilterOption> _options(dynamic raw) {
    return (raw as List<dynamic>? ?? [])
        .whereType<Map<String, dynamic>>()
        .map(FilterOption.fromJson)
        .toList();
  }
}

class TransactionListPage {
  const TransactionListPage({
    required this.transacoes,
    required this.total,
    required this.paginas,
    required this.pagina,
  });

  final List<PulsoTransacao> transacoes;
  final int total;
  final int paginas;
  final int pagina;
}

class TransactionFilters {
  const TransactionFilters({
    required this.periodo,
    this.tipo = 'TODOS',
    this.recurso = 'TODOS',
    this.categoriaId,
    this.busca = '',
  });

  final String periodo;
  final String tipo;
  final String recurso;
  final String? categoriaId;
  final String busca;

  bool get hasExtraFilters =>
      tipo != 'TODOS' ||
      recurso != 'TODOS' ||
      (categoriaId != null && categoriaId!.isNotEmpty) ||
      busca.trim().isNotEmpty;

  TransactionFilters copyWith({
    String? periodo,
    String? tipo,
    String? recurso,
    String? categoriaId,
    bool clearCategoria = false,
    String? busca,
  }) {
    return TransactionFilters(
      periodo: periodo ?? this.periodo,
      tipo: tipo ?? this.tipo,
      recurso: recurso ?? this.recurso,
      categoriaId: clearCategoria ? null : (categoriaId ?? this.categoriaId),
      busca: busca ?? this.busca,
    );
  }

  Map<String, dynamic> toQuery({required int pagina, int limite = 20}) {
    return {
      'periodo': periodo,
      if (tipo != 'TODOS') 'tipo': tipo,
      if (recurso != 'TODOS') 'recurso': recurso,
      if (categoriaId != null && categoriaId!.isNotEmpty)
        'categoria': categoriaId,
      if (busca.trim().isNotEmpty) 'busca': busca.trim(),
      'pagina': pagina,
      'limite': limite,
    };
  }
}

String _asRequiredString(dynamic value, [String fallback = '']) {
  if (value == null) return fallback;
  if (value is String) return value;
  return value.toString();
}

DateTime _asDate(dynamic value) {
  if (value is DateTime) return value.toLocal();
  if (value is String && value.isNotEmpty) {
    return DateTime.tryParse(value)?.toLocal() ??
        DateTime.fromMillisecondsSinceEpoch(0, isUtc: true).toLocal();
  }
  return DateTime.fromMillisecondsSinceEpoch(0, isUtc: true).toLocal();
}

double _asMoney(dynamic value) {
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0;
  return 0;
}

int _asInt(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.round();
  if (value is String) return int.tryParse(value) ?? 0;
  return 0;
}
