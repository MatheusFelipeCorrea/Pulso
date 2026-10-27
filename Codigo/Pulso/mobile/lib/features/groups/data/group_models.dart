class PulsoGrupoMembro {
  const PulsoGrupoMembro({
    required this.id,
    required this.nome,
    this.urlAvatar,
    this.papel = 'MEMBRO',
    this.souEu = false,
  });

  final String id;
  final String nome;
  final String? urlAvatar;
  final String papel;
  final bool souEu;

  factory PulsoGrupoMembro.fromJson(Map<String, dynamic> json) {
    return PulsoGrupoMembro(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? 'Membro',
      urlAvatar: json['urlAvatar'] as String?,
      papel: json['papel'] as String? ?? 'MEMBRO',
      souEu: json['souEu'] == true,
    );
  }
}

class PulsoGrupoViagem {
  const PulsoGrupoViagem({
    required this.id,
    required this.destino,
    this.moeda,
    this.totalGrupo = '0.00',
  });

  final String id;
  final String destino;
  final String? moeda;
  final String totalGrupo;

  factory PulsoGrupoViagem.fromJson(Map<String, dynamic> json) {
    return PulsoGrupoViagem(
      id: json['id'] as String? ?? '',
      destino: json['destino'] as String? ?? 'Viagem',
      moeda: json['moeda'] as String?,
      totalGrupo: json['totalGrupo']?.toString() ?? '0.00',
    );
  }
}

class PulsoGrupoMeta {
  const PulsoGrupoMeta({
    this.id,
    required this.nome,
    this.valorAlvo = '0.00',
    this.valorAtual = '0.00',
    this.percentual = 0,
    this.status = 'ATIVA',
  });

  final String? id;
  final String nome;
  final String valorAlvo;
  final String valorAtual;
  final int percentual;
  final String status;

  factory PulsoGrupoMeta.fromJson(Map<String, dynamic> json) {
    final raw = json['percentual'];
    return PulsoGrupoMeta(
      id: json['id'] as String?,
      nome: json['nome'] as String? ?? 'Meta do grupo',
      valorAlvo: json['valorAlvo']?.toString() ?? '0.00',
      valorAtual: json['valorAtual']?.toString() ?? '0.00',
      percentual: raw is num ? raw.round() : int.tryParse('$raw') ?? 0,
      status: json['status'] as String? ?? 'ATIVA',
    );
  }
}

class PulsoGrupoMensagem {
  const PulsoGrupoMensagem({
    required this.id,
    required this.texto,
    this.autorNome,
    this.autorId,
    this.criadoEm,
    this.souEu = false,
  });

  final String id;
  final String texto;
  final String? autorNome;
  final String? autorId;
  final DateTime? criadoEm;
  final bool souEu;

  factory PulsoGrupoMensagem.fromJson(Map<String, dynamic> json) {
    final autor = json['autor'];
    return PulsoGrupoMensagem(
      id: json['id'] as String? ?? '',
      texto: json['texto'] as String? ?? json['conteudo'] as String? ?? '',
      autorNome: autor is Map
          ? autor['nome'] as String?
          : json['autorNome'] as String?,
      autorId: autor is Map
          ? autor['id'] as String?
          : json['autorId'] as String?,
      criadoEm: DateTime.tryParse(
        json['criadoEm'] as String? ?? json['createdAt'] as String? ?? '',
      ),
      souEu: json['souEu'] == true,
    );
  }
}

class PulsoGrupoPreview {
  const PulsoGrupoPreview({
    required this.nome,
    this.quantidadeMembros = 0,
    this.urlImagem,
  });

  final String nome;
  final int quantidadeMembros;
  final String? urlImagem;

  factory PulsoGrupoPreview.fromJson(Map<String, dynamic> json) {
    final qtd = json['quantidadeMembros'];
    return PulsoGrupoPreview(
      nome: json['nome'] as String? ?? 'Grupo',
      quantidadeMembros: qtd is num ? qtd.toInt() : int.tryParse('$qtd') ?? 0,
      urlImagem: json['urlImagem'] as String? ?? json['imagemExibicao'] as String?,
    );
  }
}

class PulsoGrupo {
  const PulsoGrupo({
    required this.id,
    required this.nome,
    this.descricao,
    this.codigoConvite,
    this.urlImagem,
    this.imagemExibicao,
    this.meuPapel,
    this.quantidadeMembros = 0,
    this.membrosPreview = const [],
    this.membros = const [],
    this.ultimaAtividade,
    this.viagem,
    this.meta,
  });

  final String id;
  final String nome;
  final String? descricao;
  final String? codigoConvite;
  final String? urlImagem;
  final String? imagemExibicao;
  final String? meuPapel;
  final int quantidadeMembros;
  final List<PulsoGrupoMembro> membrosPreview;
  final List<PulsoGrupoMembro> membros;
  final String? ultimaAtividade;
  final PulsoGrupoViagem? viagem;
  final PulsoGrupoMeta? meta;

  bool get isAdmin => meuPapel == 'ADMIN';

  String? get capa =>
      (imagemExibicao != null && imagemExibicao!.trim().isNotEmpty)
      ? imagemExibicao
      : (urlImagem != null && urlImagem!.trim().isNotEmpty)
      ? urlImagem
      : null;

  List<PulsoGrupoMembro> get pessoas =>
      membros.isNotEmpty ? membros : membrosPreview;

  factory PulsoGrupo.fromJson(Map<String, dynamic> json) {
    final membrosJson = json['membros'];
    final previewJson = json['membrosPreview'];
    final membros = membrosJson is List
        ? membrosJson
              .whereType<Map>()
              .map(
                (item) =>
                    PulsoGrupoMembro.fromJson(Map<String, dynamic>.from(item)),
              )
              .toList()
        : const <PulsoGrupoMembro>[];
    final preview = previewJson is List
        ? previewJson
              .whereType<Map>()
              .map(
                (item) =>
                    PulsoGrupoMembro.fromJson(Map<String, dynamic>.from(item)),
              )
              .toList()
        : const <PulsoGrupoMembro>[];
    final viagemJson = json['viagem'];
    final metaJson = json['meta'];

    return PulsoGrupo(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? json['titulo'] as String? ?? 'Grupo',
      descricao: json['descricao'] as String?,
      codigoConvite:
          json['codigoConvite'] as String? ?? json['codigo'] as String?,
      urlImagem: json['urlImagem'] as String?,
      imagemExibicao: json['imagemExibicao'] as String?,
      meuPapel: json['meuPapel'] as String?,
      quantidadeMembros: json['quantidadeMembros'] is num
          ? (json['quantidadeMembros'] as num).toInt()
          : (membrosJson is List ? membrosJson.length : membros.length),
      membrosPreview: preview,
      membros: membros,
      ultimaAtividade: json['ultimaAtividade'] as String?,
      viagem: viagemJson is Map<String, dynamic>
          ? PulsoGrupoViagem.fromJson(viagemJson)
          : null,
      meta: metaJson is Map<String, dynamic>
          ? PulsoGrupoMeta.fromJson(metaJson)
          : null,
    );
  }
}
