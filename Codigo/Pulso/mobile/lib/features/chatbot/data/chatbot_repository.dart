import 'package:dio/dio.dart';
import 'package:pulso/core/api/api_client.dart';

class ChatbotSugestao {
  const ChatbotSugestao({required this.id, required this.label, this.icon});

  final String id;
  final String label;
  final String? icon;

  factory ChatbotSugestao.fromJson(Map<String, dynamic> json) {
    return ChatbotSugestao(
      id: json['id'] as String? ?? '',
      label: json['label'] as String? ?? '',
      icon: json['icon'] as String?,
    );
  }
}

class ChatbotConversaResumo {
  const ChatbotConversaResumo({
    required this.id,
    required this.titulo,
    this.preview,
    this.atualizadoEm,
  });

  final String id;
  final String titulo;
  final String? preview;
  final DateTime? atualizadoEm;

  factory ChatbotConversaResumo.fromJson(Map<String, dynamic> json) {
    DateTime? at;
    final raw = json['atualizadoEm'];
    if (raw is String) at = DateTime.tryParse(raw);
    return ChatbotConversaResumo(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? 'Conversa',
      preview: json['preview'] as String?,
      atualizadoEm: at,
    );
  }
}

class ChatbotMsgDto {
  const ChatbotMsgDto({
    required this.id,
    required this.role,
    required this.content,
    this.at,
  });

  final String id;
  final String role;
  final String content;
  final DateTime? at;

  factory ChatbotMsgDto.fromJson(Map<String, dynamic> json) {
    DateTime? at;
    final raw = json['at'];
    if (raw is String) at = DateTime.tryParse(raw);
    return ChatbotMsgDto(
      id: json['id'] as String? ?? '',
      role: json['role'] as String? ?? 'assistant',
      content: json['content'] as String? ?? '',
      at: at,
    );
  }
}

class ChatbotConversaDetalhe {
  const ChatbotConversaDetalhe({
    required this.id,
    required this.titulo,
    required this.mensagens,
  });

  final String id;
  final String titulo;
  final List<ChatbotMsgDto> mensagens;

  factory ChatbotConversaDetalhe.fromJson(Map<String, dynamic> json) {
    final rawMsgs = json['mensagens'];
    final msgs = <ChatbotMsgDto>[];
    if (rawMsgs is List) {
      for (final item in rawMsgs.whereType<Map>()) {
        msgs.add(ChatbotMsgDto.fromJson(Map<String, dynamic>.from(item)));
      }
    }
    return ChatbotConversaDetalhe(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? 'Conversa',
      mensagens: msgs,
    );
  }
}

class ChatbotPropostaTx {
  const ChatbotPropostaTx({
    required this.tipo,
    required this.valor,
    this.descricao,
    this.recurso = 'DINHEIRO',
    this.data,
    this.categoriaId,
    this.categoriaNome,
  });

  final String tipo;
  final double valor;
  final String? descricao;
  final String recurso;
  final String? data;
  final String? categoriaId;
  final String? categoriaNome;

  factory ChatbotPropostaTx.fromJson(Map<String, dynamic> json) {
    return ChatbotPropostaTx(
      tipo: json['tipo'] as String? ?? 'DESPESA',
      valor: (json['valor'] as num?)?.toDouble() ?? 0,
      descricao: json['descricao'] as String?,
      recurso: json['recurso'] as String? ?? 'DINHEIRO',
      data: json['data'] as String?,
      categoriaId: json['categoriaId'] as String?,
      categoriaNome: json['categoriaNome'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'tipo': tipo,
    'valor': valor,
    if (descricao != null) 'descricao': descricao,
    'recurso': recurso,
    if (data != null) 'data': data,
    if (categoriaId != null) 'categoriaId': categoriaId,
    if (categoriaNome != null) 'categoriaNome': categoriaNome,
  };
}

class ChatbotReply {
  const ChatbotReply({
    required this.resposta,
    this.recusada = false,
    this.propostaTransacao,
    this.conversaId,
  });

  final String resposta;
  final bool recusada;
  final ChatbotPropostaTx? propostaTransacao;
  final String? conversaId;

  factory ChatbotReply.fromJson(Map<String, dynamic> json) {
    final proposta = json['propostaTransacao'];
    return ChatbotReply(
      resposta: json['resposta'] as String? ?? '',
      recusada: json['recusada'] == true,
      conversaId: json['conversaId'] as String?,
      propostaTransacao: proposta is Map
          ? ChatbotPropostaTx.fromJson(Map<String, dynamic>.from(proposta))
          : null,
    );
  }
}

class ChatbotRepository {
  ChatbotRepository(this._api);

  final ApiClient _api;

  Future<T> _guard<T>(Future<T> Function() run) async {
    try {
      return await run();
    } on DioException catch (error) {
      throw ApiClient.toApiException(error);
    }
  }

  Future<List<ChatbotSugestao>> listarSugestoes() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/chatbot/sugestoes');
      final data = response.data;
      if (data is! List) return const [];
      return data
          .whereType<Map>()
          .map((e) => ChatbotSugestao.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    });
  }

  Future<List<ChatbotConversaResumo>> listarConversas() {
    return _guard(() async {
      final response = await _api.raw.get<dynamic>('/chatbot/conversas');
      final data = response.data;
      if (data is! List) return const [];
      return data
          .whereType<Map>()
          .map(
            (e) => ChatbotConversaResumo.fromJson(Map<String, dynamic>.from(e)),
          )
          .toList();
    });
  }

  Future<ChatbotConversaDetalhe> obterConversa(String id) {
    return _guard(() async {
      final response = await _api.raw.get<Map<String, dynamic>>(
        '/chatbot/conversas/$id',
      );
      return ChatbotConversaDetalhe.fromJson(response.data ?? {});
    });
  }

  Future<void> excluirConversa(String id) {
    return _guard(() async {
      await _api.raw.delete<dynamic>('/chatbot/conversas/$id');
    });
  }

  Future<ChatbotReply> enviarMensagem({
    required String mensagem,
    List<Map<String, String>> historico = const [],
    String modo = 'chat',
    String? conversaId,
  }) {
    return _guard(() async {
      final response = await _api.raw.post<Map<String, dynamic>>(
        '/chatbot/mensagem',
        data: {
          'mensagem': mensagem,
          'historico': historico,
          'modo': modo,
          'conversaId': ?conversaId,
        },
      );
      return ChatbotReply.fromJson(response.data ?? {});
    });
  }

  Future<void> confirmarTransacao(ChatbotPropostaTx proposta) {
    return _guard(() async {
      await _api.raw.post<dynamic>(
        '/chatbot/confirmar-transacao',
        data: proposta.toJson(),
      );
    });
  }
}
