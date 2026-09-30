const grupoAlimentacao = 'ALIMENTACAO';
const grupoCompras = 'COMPRAS';

String normalizeName(String value) {
  return value
      .toLowerCase()
      .trim()
      .replaceAll(RegExp(r'[\u0300-\u036f]'), '');
}

String? inferirGrupoBeneficioPorNome(String? nome) {
  final normalized = normalizeName(
    (nome ?? '').replaceAll(RegExp(r'[áàâã]'), 'a').replaceAll(RegExp(r'[éê]'), 'e').replaceAll('í', 'i').replaceAll(RegExp(r'[óôõ]'), 'o').replaceAll('ú', 'u').replaceAll('ç', 'c'),
  );
  const defaults = {
    'alimentacao': grupoAlimentacao,
    'compras': grupoCompras,
    'transporte': 'TRANSPORTE',
    'mercado': grupoCompras,
    'supermercado': grupoCompras,
    'ifood': grupoAlimentacao,
    'uber': 'TRANSPORTE',
  };
  return defaults[normalized];
}

String? resolverGrupoBeneficio({String? grupoBeneficio, String? nome}) {
  if (grupoBeneficio != null && grupoBeneficio.isNotEmpty) return grupoBeneficio;
  return inferirGrupoBeneficioPorNome(nome);
}

String? validarRecursoCategoria({
  required String recurso,
  required String tipo,
  String? categoriaNome,
  String? grupoBeneficio,
}) {
  if (recurso == 'VT') return 'VT não está disponível';
  if (tipo != 'DESPESA' || recurso == 'DINHEIRO' || recurso == 'POUPANCA') {
    return null;
  }

  final grupo = resolverGrupoBeneficio(grupoBeneficio: grupoBeneficio, nome: categoriaNome);
  final nome = (categoriaNome ?? '').trim().isEmpty ? 'esta categoria' : categoriaNome!.trim();

  if (recurso == 'VA') {
    final ok = grupo == grupoAlimentacao || grupo == grupoCompras;
    return ok
        ? null
        : 'A categoria "$nome" não aceita Vale Alimentação (VA). Use uma categoria de refeições ou mercado.';
  }

  if (recurso == 'VR') {
    return grupo == grupoAlimentacao
        ? null
        : 'A categoria "$nome" não aceita Vale Refeição (VR). VR só vale para refeições.';
  }

  return null;
}

String? validarTransferencia(String? origem, String? destino) {
  if (origem == null || destino == null || origem.isEmpty || destino.isEmpty) {
    return 'Recurso de destino é obrigatório para transferências';
  }
  if (origem == destino) {
    return 'Recurso de destino deve ser diferente do recurso de origem';
  }
  return null;
}

String buildRecurrenceRule({
  required String frequencia,
  required String ateQuando,
  DateTime? dataFim,
}) {
  const freqMap = {
    'SEMANAL': 'FREQ=WEEKLY;INTERVAL=1',
    'QUINZENAL': 'FREQ=WEEKLY;INTERVAL=2',
    'MENSAL': 'FREQ=MONTHLY;INTERVAL=1',
    'ANUAL': 'FREQ=YEARLY;INTERVAL=1',
  };
  var rule = freqMap[frequencia] ?? freqMap['MENSAL']!;
  if (ateQuando == 'DATA' && dataFim != null) {
    final y = dataFim.year.toString().padLeft(4, '0');
    final m = dataFim.month.toString().padLeft(2, '0');
    final d = dataFim.day.toString().padLeft(2, '0');
    rule += ';UNTIL=$y$m${d}T235959Z';
  }
  return rule;
}
