class PulsoNotificacao {
  const PulsoNotificacao({
    required this.id,
    required this.tipo,
    required this.titulo,
    required this.mensagem,
    required this.lida,
    this.linkAcao,
    this.criadoEm,
  });

  final String id;
  final String tipo;
  final String titulo;
  final String mensagem;
  final bool lida;
  final String? linkAcao;
  final DateTime? criadoEm;

  factory PulsoNotificacao.fromJson(Map<String, dynamic> json) {
    return PulsoNotificacao(
      id: json['id'] as String? ?? '',
      tipo: json['tipo'] as String? ?? 'ERRO',
      titulo: json['titulo'] as String? ?? 'Notificação',
      mensagem: json['mensagem'] as String? ?? '',
      lida: json['lida'] == true,
      linkAcao: json['linkAcao'] as String?,
      criadoEm: DateTime.tryParse(json['criadoEm'] as String? ?? ''),
    );
  }
}
