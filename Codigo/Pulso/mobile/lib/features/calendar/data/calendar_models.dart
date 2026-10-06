double _num(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}

DateTime _date(dynamic value) {
  if (value is DateTime) return value;
  return DateTime.tryParse('$value') ?? DateTime.now();
}


const reminderAntecedenciaOptions = {
  'NO_DIA': 'No dia',
  'UM_DIA': '1 dia antes',
  'TRES_DIAS': '3 dias antes',
  'CINCO_DIAS': '5 dias antes',
  'UMA_SEMANA': '1 semana antes',
};

const reminderCategoriaOptions = {
  'ALUGUEL': 'Aluguel',
  'CONDOMINIO': 'Condomínio',
  'LUZ': 'Luz',
  'AGUA': 'Água',
  'INTERNET': 'Internet',
  'FATURA_CARTAO': 'Fatura do cartão',
  'EMPRESTIMO': 'Empréstimo',
  'PLANO_SAUDE': 'Plano de saúde',
  'STREAMING': 'Streaming',
  'OUTRO': 'Outro',
};

class PulsoLembrete {
  const PulsoLembrete({
    required this.id,
    required this.titulo,
    this.valor,
    required this.dataVencimento,
    this.horaLembrete = '10:00',
    this.antecedencia = 'UM_DIA',
    this.antecedenciaLabel,
    this.categoria = 'OUTRO',
    this.categoriaLabel,
    this.pago = false,
    this.sincronizado = false,
    this.repetirMensal = false,
    this.diaRecorrencia,
    this.diasAteVencimento,
  });

  final String id;
  final String titulo;
  final double? valor;
  final DateTime dataVencimento;
  final String horaLembrete;
  final String antecedencia;
  final String? antecedenciaLabel;
  final String categoria;
  final String? categoriaLabel;
  final bool pago;
  final bool sincronizado;
  final bool repetirMensal;
  final int? diaRecorrencia;
  final int? diasAteVencimento;

  bool get temValor => (valor ?? 0) > 0;

  factory PulsoLembrete.fromJson(Map<String, dynamic> json) {
    final rawValor = json['valor'];
    return PulsoLembrete(
      id: json['id'] as String? ?? '',
      titulo: json['titulo'] as String? ?? '',
      valor: rawValor == null ? null : _num(rawValor),
      dataVencimento: _date(json['dataVencimento']),
      horaLembrete: json['horaLembrete'] as String? ?? '10:00',
      antecedencia: json['antecedencia'] as String? ?? 'UM_DIA',
      antecedenciaLabel: json['antecedenciaLabel'] as String?,
      categoria: json['categoria'] as String? ?? 'OUTRO',
      categoriaLabel: json['categoriaLabel'] as String?,
      pago: json['pago'] == true,
      sincronizado: json['sincronizado'] == true,
      repetirMensal: json['repetirMensal'] == true,
      diaRecorrencia: json['diaRecorrencia'] is num ? (json['diaRecorrencia'] as num).toInt() : null,
      diasAteVencimento: json['diasAteVencimento'] is num ? (json['diasAteVencimento'] as num).toInt() : null,
    );
  }
}

class CalendarDayMarker {
  const CalendarDayMarker({
    this.receitas = 0,
    this.despesas = 0,
    this.temReceita = false,
    this.temDespesa = false,
    this.temLembrete = false,
    this.temRecebimentoFixo = false,
    this.lembretes = 0,
  });

  final double receitas;
  final double despesas;
  final bool temReceita;
  final bool temDespesa;
  final bool temLembrete;
  final bool temRecebimentoFixo;
  final int lembretes;

  factory CalendarDayMarker.fromJson(Map<String, dynamic> json) {
    return CalendarDayMarker(
      receitas: _num(json['receitas']),
      despesas: _num(json['despesas']),
      temReceita: json['temReceita'] == true,
      temDespesa: json['temDespesa'] == true,
      temLembrete: json['temLembrete'] == true,
      temRecebimentoFixo: json['temRecebimentoFixo'] == true,
      lembretes: json['lembretes'] is num ? (json['lembretes'] as num).toInt() : 0,
    );
  }
}

class CalendarMonthResumo {
  const CalendarMonthResumo({
    this.receitasTotal = 0,
    this.despesasTotal = 0,
    this.saldo = 0,
    this.totalTransacoes = 0,
  });

  final double receitasTotal;
  final double despesasTotal;
  final double saldo;
  final int totalTransacoes;

  factory CalendarMonthResumo.fromJson(Map<String, dynamic> json) {
    return CalendarMonthResumo(
      receitasTotal: _num(json['receitasTotal']),
      despesasTotal: _num(json['despesasTotal']),
      saldo: _num(json['saldo']),
      totalTransacoes: json['totalTransacoes'] is num ? (json['totalTransacoes'] as num).toInt() : 0,
    );
  }
}

class CalendarMonthView {
  const CalendarMonthView({
    required this.mes,
    required this.resumo,
    this.dias = const {},
    this.proximosVencimentos = const [],
  });

  final String mes;
  final CalendarMonthResumo resumo;
  final Map<String, CalendarDayMarker> dias;
  final List<PulsoLembrete> proximosVencimentos;

  factory CalendarMonthView.fromJson(Map<String, dynamic> json) {
    final rawDias = json['dias'];
    final dias = <String, CalendarDayMarker>{};
    if (rawDias is Map) {
      for (final entry in rawDias.entries) {
        if (entry.value is Map<String, dynamic>) {
          dias['${entry.key}'] = CalendarDayMarker.fromJson(entry.value as Map<String, dynamic>);
        }
      }
    }
    return CalendarMonthView(
      mes: json['mes'] as String? ?? '',
      resumo: CalendarMonthResumo.fromJson(json['resumo'] as Map<String, dynamic>? ?? const {}),
      dias: dias,
      proximosVencimentos: (json['proximosVencimentos'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoLembrete.fromJson)
          .toList(),
    );
  }
}

class CalendarDayDetail {
  const CalendarDayDetail({
    required this.data,
    this.lembretes = const [],
    this.receitas = 0,
    this.despesas = 0,
    this.saldo = 0,
    this.transacoesCount = 0,
  });

  final String data;
  final List<PulsoLembrete> lembretes;
  final double receitas;
  final double despesas;
  final double saldo;
  final int transacoesCount;

  factory CalendarDayDetail.fromJson(Map<String, dynamic> json) {
    final totais = json['totais'] as Map<String, dynamic>? ?? const {};
    final transacoes = json['transacoes'] as List<dynamic>? ?? const [];
    return CalendarDayDetail(
      data: json['data'] as String? ?? '',
      lembretes: (json['lembretes'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PulsoLembrete.fromJson)
          .toList(),
      receitas: _num(totais['receitas']),
      despesas: _num(totais['despesas']),
      saldo: _num(totais['saldo']),
      transacoesCount: transacoes.length,
    );
  }
}

class GoogleCalendarStatus {
  const GoogleCalendarStatus({this.conectado = false, this.email});

  final bool conectado;
  final String? email;

  factory GoogleCalendarStatus.fromJson(Map<String, dynamic> json) {
    return GoogleCalendarStatus(
      conectado: json['conectado'] == true,
      email: json['email'] as String?,
    );
  }
}
