double tripNum(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}

DateTime tripDate(dynamic value) {
  if (value is DateTime) return value;
  return DateTime.tryParse('$value') ?? DateTime.now();
}

class TripExpense {
  const TripExpense({
    required this.id,
    required this.categoria,
    required this.valorEstimado,
    this.descricao,
  });

  final String id;
  final String categoria;
  final double valorEstimado;
  final String? descricao;

  factory TripExpense.fromJson(Map<String, dynamic> json) {
    return TripExpense(
      id: json['id'] as String? ?? '',
      categoria: json['categoria'] as String? ?? 'OUTROS',
      valorEstimado: tripNum(json['valorEstimado']),
      descricao: json['descricao'] as String?,
    );
  }
}

class TripNote {
  const TripNote({
    required this.id,
    required this.titulo,
    required this.conteudo,
  });

  final String id;
  final String titulo;
  final String conteudo;

  factory TripNote.fromJson(Map<String, dynamic> json) {
    return TripNote(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? '',
      conteudo: json['conteudo'] as String? ?? '',
    );
  }
}

class PulsoViagem {
  const PulsoViagem({
    required this.id,
    required this.destino,
    required this.moeda,
    required this.dataPrevista,
    this.metaId,
    this.totalBrl = 0,
    this.despesas = const [],
    this.observacoes = const [],
  });

  final String id;
  final String destino;
  final String moeda;
  final DateTime dataPrevista;
  final String? metaId;
  final double totalBrl;
  final List<TripExpense> despesas;
  final List<TripNote> observacoes;

  factory PulsoViagem.fromJson(Map<String, dynamic> json) {
    return PulsoViagem(
      id: json['id'] as String? ?? '',
      destino: json['destino'] as String? ?? '',
      moeda: json['moeda'] as String? ?? 'BRL',
      dataPrevista: tripDate(json['dataPrevista']),
      metaId: json['metaId'] as String?,
      totalBrl: tripNum(json['totalBrl']),
      despesas: (json['despesas'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(TripExpense.fromJson)
          .toList(),
      observacoes: (json['observacoes'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(TripNote.fromJson)
          .toList(),
    );
  }
}

class TripDestinationHint {
  const TripDestinationHint({
    required this.label,
    this.moedaSugerida = 'BRL',
    this.raw = const {},
  });

  final String label;
  final String moedaSugerida;
  final Map<String, dynamic> raw;

  Map<String, dynamic>? toDestinoMeta() {
    final catalogId = raw['catalogId'] as String? ?? raw['id'] as String?;
    final iata = raw['iata'] as String?;
    final countryCode = raw['countryCode'] as String?;
    if (catalogId == null || catalogId.isEmpty || iata == null || countryCode == null) {
      return null;
    }
    return {
      'source': raw['source'] ?? 'catalog',
      'catalogId': catalogId,
      'iata': iata,
      'label': raw['label'] ?? label,
      'countryCode': countryCode,
      'countryName': raw['countryName'] ?? '',
      'moedaSugerida': (raw['moedaSugerida'] as String? ?? moedaSugerida).toUpperCase(),
      'domestic': raw['domestic'] == true,
      if (raw['geonameId'] != null) 'geonameId': raw['geonameId'],
      if (raw['region'] != null) 'region': raw['region'],
    };
  }

  factory TripDestinationHint.fromJson(Map<String, dynamic> json) {
    return TripDestinationHint(
      label: json['label'] as String? ?? json['destino'] as String? ?? '',
      moedaSugerida: (json['moedaSugerida'] as String? ?? 'BRL').toUpperCase(),
      raw: json,
    );
  }
}
