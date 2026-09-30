class PulsoGrupo {
  const PulsoGrupo({
    required this.id,
    required this.nome,
    this.codigoConvite,
    this.quantidadeMembros = 0,
  });

  final String id;
  final String nome;
  final String? codigoConvite;
  final int quantidadeMembros;

  factory PulsoGrupo.fromJson(Map<String, dynamic> json) {
    final membros = json['membros'];
    return PulsoGrupo(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? json['titulo'] as String? ?? 'Grupo',
      codigoConvite: json['codigoConvite'] as String? ?? json['codigo'] as String?,
      quantidadeMembros: membros is List
          ? membros.length
          : (json['quantidadeMembros'] is num ? (json['quantidadeMembros'] as num).toInt() : 0),
    );
  }
}
