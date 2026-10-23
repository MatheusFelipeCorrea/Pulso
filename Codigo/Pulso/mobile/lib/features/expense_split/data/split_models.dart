double splitMoney(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('${value ?? ''}'.trim().replaceAll(',', '.')) ?? 0;
}

class SplitParticipante {
  const SplitParticipante({
    required this.id,
    required this.nome,
    required this.valor,
    required this.ehOrganizador,
    required this.pagouAConta,
    required this.status,
  });

  final String id;
  final String nome;
  final double valor;
  final bool ehOrganizador;
  final bool pagouAConta;
  final String status;

  bool get pago => status == 'PAGO';

  factory SplitParticipante.fromJson(Map<String, dynamic> json) {
    return SplitParticipante(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? 'Participante',
      valor: splitMoney(json['valor']),
      ehOrganizador: json['ehOrganizador'] == true,
      pagouAConta: json['pagouAConta'] == true,
      status: json['status'] as String? ?? 'PENDENTE',
    );
  }
}

class PulsoDivisao {
  const PulsoDivisao({
    required this.id,
    required this.titulo,
    required this.valorTotal,
    required this.tipo,
    required this.status,
    this.data,
    this.icone,
    this.participantes = const [],
  });

  final String id;
  final String titulo;
  final double valorTotal;
  final String tipo;
  final String status;
  final DateTime? data;
  final String? icone;
  final List<SplitParticipante> participantes;

  bool get quitada => status == 'QUITADA';

  int get pendentes => participantes.where((item) => !item.pago).length;

  factory PulsoDivisao.fromJson(Map<String, dynamic> json) {
    final pessoas = json['participantes'];
    return PulsoDivisao(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? 'Divisão',
      valorTotal: splitMoney(json['valorTotal']),
      tipo: json['tipo'] as String? ?? 'IGUAL',
      status: json['status'] as String? ?? 'ATIVA',
      data: DateTime.tryParse(json['data'] as String? ?? ''),
      icone: json['icone'] as String?,
      participantes: pessoas is List
          ? pessoas
                .whereType<Map>()
                .map(
                  (item) => SplitParticipante.fromJson(
                    Map<String, dynamic>.from(item),
                  ),
                )
                .toList()
          : const [],
    );
  }
}

class SplitResumo {
  const SplitResumo({
    required this.meDevem,
    required this.euDevo,
    required this.saldo,
    required this.possuiDivisoes,
  });

  final double meDevem;
  final double euDevo;
  final double saldo;
  final bool possuiDivisoes;

  factory SplitResumo.fromJson(Map<String, dynamic> json) {
    return SplitResumo(
      meDevem: splitMoney(json['meDevem']),
      euDevo: splitMoney(json['euDevo']),
      saldo: splitMoney(json['saldo']),
      possuiDivisoes: json['possuiDivisoes'] == true,
    );
  }
}

class SplitPage {
  const SplitPage({
    required this.divisoes,
    required this.total,
    required this.paginas,
  });

  final List<PulsoDivisao> divisoes;
  final int total;
  final int paginas;
}
