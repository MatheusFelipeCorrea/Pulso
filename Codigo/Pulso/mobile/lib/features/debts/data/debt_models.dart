double debtMoney(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('${value ?? ''}'.trim().replaceAll(',', '.')) ?? 0;
}

class PulsoPagamento {
  const PulsoPagamento({required this.id, required this.valor, this.data});

  final String id;
  final double valor;
  final DateTime? data;

  factory PulsoPagamento.fromJson(Map<String, dynamic> json) {
    return PulsoPagamento(
      id: json['id'] as String? ?? '',
      valor: debtMoney(json['valor']),
      data: DateTime.tryParse(
        json['data'] as String? ?? json['dataPagamento'] as String? ?? '',
      ),
    );
  }
}

class PulsoDivida {
  const PulsoDivida({
    required this.id,
    required this.direcao,
    required this.nomePessoa,
    required this.valor,
    required this.valorPago,
    required this.valorRestante,
    required this.quitada,
    this.dataEmprestimo,
    this.prazoDevolucao,
    this.dataQuitacao,
    this.observacao,
    this.pagamentos = const [],
  });

  final String id;
  final String direcao;
  final String nomePessoa;
  final double valor;
  final double valorPago;
  final double valorRestante;
  final bool quitada;
  final DateTime? dataEmprestimo;
  final DateTime? prazoDevolucao;
  final DateTime? dataQuitacao;
  final String? observacao;
  final List<PulsoPagamento> pagamentos;

  factory PulsoDivida.fromJson(Map<String, dynamic> json) {
    final pagamentos = json['pagamentos'];
    return PulsoDivida(
      id: json['id'] as String? ?? '',
      direcao: json['direcao'] as String? ?? 'EU_DEVO',
      nomePessoa: json['nomePessoa'] as String? ?? 'Pessoa',
      valor: debtMoney(json['valor']),
      valorPago: debtMoney(json['valorPago']),
      valorRestante: debtMoney(json['valorRestante']),
      quitada: json['quitada'] == true,
      dataEmprestimo: DateTime.tryParse(
        json['dataEmprestimo'] as String? ?? '',
      ),
      prazoDevolucao: DateTime.tryParse(
        json['prazoDevolucao'] as String? ?? '',
      ),
      dataQuitacao: DateTime.tryParse(json['dataQuitacao'] as String? ?? ''),
      observacao: json['observacao'] as String?,
      pagamentos: pagamentos is List
          ? pagamentos
                .whereType<Map>()
                .map(
                  (item) =>
                      PulsoPagamento.fromJson(Map<String, dynamic>.from(item)),
                )
                .toList()
          : const [],
    );
  }
}

class DebtBucket {
  const DebtBucket({required this.total, required this.quantidade});

  final double total;
  final int quantidade;

  factory DebtBucket.fromJson(dynamic json) {
    if (json is! Map) return const DebtBucket(total: 0, quantidade: 0);
    final qtd = json['quantidade'];
    return DebtBucket(
      total: debtMoney(json['total']),
      quantidade: qtd is num ? qtd.toInt() : int.tryParse('$qtd') ?? 0,
    );
  }
}

class DebtResumo {
  const DebtResumo({required this.meDevem, required this.euDevo});

  final DebtBucket meDevem;
  final DebtBucket euDevo;

  factory DebtResumo.fromJson(Map<String, dynamic> json) {
    return DebtResumo(
      meDevem: DebtBucket.fromJson(json['meDevem']),
      euDevo: DebtBucket.fromJson(json['euDevo']),
    );
  }
}

class DebtPage {
  const DebtPage({
    required this.dividas,
    required this.total,
    required this.paginas,
    required this.pagina,
  });

  final List<PulsoDivida> dividas;
  final int total;
  final int paginas;
  final int pagina;
}
