import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';

class InsightChecklistItem {
  const InsightChecklistItem({
    required this.id,
    required this.ok,
    required this.texto,
  });

  final String id;
  final bool ok;
  final String texto;

  factory InsightChecklistItem.fromJson(Map<String, dynamic> json) {
    return InsightChecklistItem(
      id: json['id'] as String? ?? '',
      ok: json['ok'] == true,
      texto: json['texto'] as String? ?? '',
    );
  }
}

class InsightScore {
  const InsightScore({
    required this.valor,
    required this.label,
    this.checklist = const [],
  });

  final int valor;
  final String label;
  final List<InsightChecklistItem> checklist;

  factory InsightScore.fromJson(Map<String, dynamic> json) {
    final raw = json['checklist'];
    final list = <InsightChecklistItem>[];
    if (raw is List) {
      for (final item in raw.whereType<Map>()) {
        list.add(
          InsightChecklistItem.fromJson(Map<String, dynamic>.from(item)),
        );
      }
    }
    return InsightScore(
      valor: (json['valor'] as num?)?.round() ?? 0,
      label: json['label'] as String? ?? '',
      checklist: list,
    );
  }
}

class InsightVariacao {
  const InsightVariacao({
    required this.categoria,
    required this.percentual,
    this.comentario,
    this.atual,
    this.anterior,
  });

  final String categoria;
  final double percentual;
  final String? comentario;
  final double? atual;
  final double? anterior;

  factory InsightVariacao.fromJson(Map<String, dynamic> json) {
    return InsightVariacao(
      categoria: json['categoria'] as String? ?? '',
      percentual: (json['percentual'] as num?)?.toDouble() ?? 0,
      comentario: json['comentario'] as String?,
      atual: (json['atual'] as num?)?.toDouble(),
      anterior: (json['anterior'] as num?)?.toDouble(),
    );
  }
}

class InsightProjecao {
  const InsightProjecao({
    required this.id,
    required this.label,
    required this.descricao,
    required this.acumulado,
    this.saldoMensalEstimado,
  });

  final String id;
  final String label;
  final String descricao;
  final Map<String, double> acumulado;
  final double? saldoMensalEstimado;

  factory InsightProjecao.fromJson(Map<String, dynamic> json) {
    final raw = json['acumulado'];
    final map = <String, double>{};
    if (raw is Map) {
      raw.forEach((key, value) {
        if (value is num) map[key.toString()] = value.toDouble();
      });
    }
    return InsightProjecao(
      id: json['id'] as String? ?? '',
      label: json['label'] as String? ?? '',
      descricao: json['descricao'] as String? ?? '',
      acumulado: map,
      saldoMensalEstimado: (json['saldoMensalEstimado'] as num?)?.toDouble(),
    );
  }
}

class InsightSugestao {
  const InsightSugestao({
    required this.id,
    required this.titulo,
    required this.descricao,
    this.impactoEstimado,
    this.acaoPath,
  });

  final String id;
  final String titulo;
  final String descricao;
  final String? impactoEstimado;
  final String? acaoPath;

  factory InsightSugestao.fromJson(Map<String, dynamic> json) {
    return InsightSugestao(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? 'Sugestão',
      descricao: json['descricao'] as String? ?? '',
      impactoEstimado: json['impactoEstimado'] as String?,
      acaoPath: json['acaoPath'] as String?,
    );
  }
}

class InsightAlerta {
  const InsightAlerta({
    required this.mensagem,
    this.tipo,
    this.severidade = 'info',
  });

  final String mensagem;
  final String? tipo;
  final String severidade;

  factory InsightAlerta.fromJson(Map<String, dynamic> json) {
    return InsightAlerta(
      mensagem: json['mensagem'] as String? ?? '',
      tipo: json['tipo'] as String?,
      severidade: json['severidade'] as String? ?? 'info',
    );
  }
}

class InsightEducacao {
  const InsightEducacao({
    required this.titulo,
    required this.url,
    this.tipo = 'artigo',
    this.motivo,
  });

  final String titulo;
  final String url;
  final String tipo;
  final String? motivo;

  factory InsightEducacao.fromJson(Map<String, dynamic> json) {
    return InsightEducacao(
      titulo: json['titulo'] as String? ?? '',
      url: json['url'] as String? ?? '',
      tipo: json['tipo'] as String? ?? 'artigo',
      motivo: json['motivo'] as String?,
    );
  }
}

class InsightFluxo {
  const InsightFluxo({this.receitas = 0, this.despesas = 0, this.saldo = 0});

  final double receitas;
  final double despesas;
  final double saldo;

  factory InsightFluxo.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const InsightFluxo();
    return InsightFluxo(
      receitas: (json['receitas'] as num?)?.toDouble() ?? 0,
      despesas: (json['despesas'] as num?)?.toDouble() ?? 0,
      saldo: (json['saldo'] as num?)?.toDouble() ?? 0,
    );
  }
}

class InsightCota {
  const InsightCota({required this.usadas, required this.limite});

  final int usadas;
  final int limite;

  factory InsightCota.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const InsightCota(usadas: 0, limite: 3);
    return InsightCota(
      usadas: (json['usadas'] as num?)?.round() ?? 0,
      limite: (json['limite'] as num?)?.round() ?? 3,
    );
  }
}

class InsightPayload {
  const InsightPayload({
    required this.mesReferencia,
    required this.resumoMensal,
    required this.score,
    this.variacaoCategorias = const [],
    this.projecoes = const [],
    this.sugestoes = const [],
    this.alertas = const [],
    this.educacao = const [],
    this.fluxo = const InsightFluxo(),
    this.diasAteNegativo,
    this.geradoPor,
    this.cotaRegeneracao = const InsightCota(usadas: 0, limite: 3),
    this.fromCache = false,
  });

  final String mesReferencia;
  final String resumoMensal;
  final InsightScore score;
  final List<InsightVariacao> variacaoCategorias;
  final List<InsightProjecao> projecoes;
  final List<InsightSugestao> sugestoes;
  final List<InsightAlerta> alertas;
  final List<InsightEducacao> educacao;
  final InsightFluxo fluxo;
  final int? diasAteNegativo;
  final String? geradoPor;
  final InsightCota cotaRegeneracao;
  final bool fromCache;

  bool get semLancamentos => fluxo.receitas == 0 && fluxo.despesas == 0;

  factory InsightPayload.fromJson(Map<String, dynamic> json) {
    List<T> mapList<T>(dynamic raw, T Function(Map<String, dynamic>) map) {
      if (raw is! List) return <T>[];
      return raw
          .whereType<Map>()
          .map((e) => map(Map<String, dynamic>.from(e)))
          .toList();
    }

    return InsightPayload(
      mesReferencia: json['mesReferencia'] as String? ?? '',
      resumoMensal: json['resumoMensal'] as String? ?? '',
      score: InsightScore.fromJson(
        Map<String, dynamic>.from(json['score'] as Map? ?? const {}),
      ),
      variacaoCategorias: mapList(
        json['variacaoCategorias'],
        InsightVariacao.fromJson,
      ),
      projecoes: mapList(json['projecoes'], InsightProjecao.fromJson),
      sugestoes: mapList(json['sugestoes'], InsightSugestao.fromJson),
      alertas: mapList(json['alertas'], InsightAlerta.fromJson),
      educacao: mapList(json['educacao'], InsightEducacao.fromJson),
      fluxo: InsightFluxo.fromJson(
        json['fluxo'] is Map
            ? Map<String, dynamic>.from(json['fluxo'] as Map)
            : null,
      ),
      diasAteNegativo: (json['diasAteNegativo'] as num?)?.round(),
      geradoPor: json['geradoPor'] as String?,
      cotaRegeneracao: InsightCota.fromJson(
        json['cotaRegeneracao'] is Map
            ? Map<String, dynamic>.from(json['cotaRegeneracao'] as Map)
            : null,
      ),
      fromCache: json['fromCache'] == true,
    );
  }
}

class InsightRepository {
  InsightRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<InsightPayload> obterInsights({String? mes}) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/insights',
        queryParameters: {if (mes != null && mes.isNotEmpty) 'mes': mes},
      );
      return InsightPayload.fromJson(response.data ?? {});
    });
  }

  Future<InsightPayload> regenerarInsights({String? mes}) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/insights/regenerar',
        data: {if (mes != null && mes.isNotEmpty) 'mes': mes},
      );
      return InsightPayload.fromJson(response.data ?? {});
    });
  }
}
