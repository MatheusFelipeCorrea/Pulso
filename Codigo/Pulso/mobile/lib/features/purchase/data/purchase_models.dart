import 'package:flutter/material.dart';

double _num(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}

DateTime? _dateOrNull(dynamic value) {
  if (value is DateTime) return value;
  if (value == null) return null;
  return DateTime.tryParse('$value');
}

const purchasePrioridades = ['ALTA', 'MEDIA', 'BAIXA'];
const purchaseCategorias = {
  'ELETRONICOS': 'Eletrônicos',
  'CASA_ELETRODOMESTICOS': 'Casa e eletrodomésticos',
  'VESTUARIO': 'Vestuário',
  'VEICULO': 'Veículo',
  'ACESSORIOS': 'Acessórios',
  'OUTROS': 'Outros',
};

class PurchaseCategoryLook {
  const PurchaseCategoryLook({required this.lucide, required this.color});
  final String lucide;
  final Color color;
}

const purchaseCategoryLooks = {
  'ELETRONICOS': PurchaseCategoryLook(
    lucide: 'Smartphone',
    color: Color(0xFF3B82F6),
  ),
  'CASA_ELETRODOMESTICOS': PurchaseCategoryLook(
    lucide: 'Home',
    color: Color(0xFF7C3AED),
  ),
  'VESTUARIO': PurchaseCategoryLook(lucide: 'Shirt', color: Color(0xFFEC4899)),
  'VEICULO': PurchaseCategoryLook(lucide: 'Car', color: Color(0xFF06B6D4)),
  'ACESSORIOS': PurchaseCategoryLook(
    lucide: 'ShoppingBag',
    color: Color(0xFFF59E0B),
  ),
  'OUTROS': PurchaseCategoryLook(lucide: 'Sparkles', color: Color(0xFF94A3B8)),
};

PurchaseCategoryLook purchaseLook(String? categoria) =>
    purchaseCategoryLooks[categoria] ?? purchaseCategoryLooks['OUTROS']!;

class PurchaseMetaLink {
  const PurchaseMetaLink({
    required this.id,
    required this.nome,
    this.percentual = 0,
    this.status,
  });

  final String id;
  final String nome;
  final double percentual;
  final String? status;

  factory PurchaseMetaLink.fromJson(Map<String, dynamic> json) {
    return PurchaseMetaLink(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? '',
      percentual: _num(json['percentual']),
      status: json['status'] as String?,
    );
  }
}

class PurchaseSimulacao {
  const PurchaseSimulacao({
    required this.parcelas,
    required this.parcela,
    required this.percentual,
    required this.nivel,
  });

  final int parcelas;
  final double parcela;
  final double percentual;
  final String nivel;

  factory PurchaseSimulacao.fromJson(Map<String, dynamic> json) {
    return PurchaseSimulacao(
      parcelas: json['parcelas'] is num ? (json['parcelas'] as num).toInt() : 1,
      parcela: _num(json['parcela']),
      percentual: _num(json['percentual']),
      nivel: json['nivel'] as String? ?? 'saudavel',
    );
  }
}

class PurchaseItem {
  const PurchaseItem({
    required this.id,
    required this.nome,
    required this.valorEstimado,
    this.prioridade = 'MEDIA',
    this.categoria = 'OUTROS',
    this.categoriaLabel,
    this.observacoes,
    this.linkProduto,
    this.imagemUrl,
    this.simularParcelas = true,
    this.parcelas = 12,
    this.status = 'DESEJADO',
    this.mesesParaComprar,
    this.meta,
    this.simulacoes = const [],
    this.comprometimentoNivel,
    this.comprometimentoPercentual,
  });

  final String id;
  final String nome;
  final double valorEstimado;
  final String prioridade;
  final String categoria;
  final String? categoriaLabel;
  final String? observacoes;
  final String? linkProduto;
  final String? imagemUrl;
  final bool simularParcelas;
  final int parcelas;
  final String status;
  final int? mesesParaComprar;
  final PurchaseMetaLink? meta;
  final List<PurchaseSimulacao> simulacoes;
  final String? comprometimentoNivel;
  final double? comprometimentoPercentual;

  factory PurchaseItem.fromJson(Map<String, dynamic> json) {
    final comprometimento = json['comprometimentoPrincipal'];
    return PurchaseItem(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? '',
      valorEstimado: _num(json['valorEstimado']),
      prioridade: json['prioridade'] as String? ?? 'MEDIA',
      categoria: json['categoria'] as String? ?? 'OUTROS',
      categoriaLabel: json['categoriaLabel'] as String?,
      observacoes: json['observacoes'] as String?,
      linkProduto: json['linkProduto'] as String?,
      imagemUrl: json['imagemUrl'] as String?,
      simularParcelas: json['simularParcelas'] != false,
      parcelas: json['parcelas'] is num
          ? (json['parcelas'] as num).toInt()
          : 12,
      status: json['status'] as String? ?? 'DESEJADO',
      mesesParaComprar: json['mesesParaComprar'] is num
          ? (json['mesesParaComprar'] as num).toInt()
          : null,
      meta: json['meta'] is Map<String, dynamic>
          ? PurchaseMetaLink.fromJson(json['meta'] as Map<String, dynamic>)
          : null,
      simulacoes: (json['simulacoes'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PurchaseSimulacao.fromJson)
          .toList(),
      comprometimentoNivel: comprometimento is Map
          ? comprometimento['nivel'] as String?
          : null,
      comprometimentoPercentual: comprometimento is Map
          ? _num(comprometimento['percentual'])
          : null,
    );
  }
}

class PurchaseComprado {
  const PurchaseComprado({
    required this.id,
    required this.nome,
    required this.valorEstimado,
    this.categoria = 'OUTROS',
    this.categoriaLabel,
    this.imagemUrl,
    this.diasNaLista,
    this.compradoEm,
  });

  final String id;
  final String nome;
  final double valorEstimado;
  final String categoria;
  final String? categoriaLabel;
  final String? imagemUrl;
  final int? diasNaLista;
  final DateTime? compradoEm;

  factory PurchaseComprado.fromJson(Map<String, dynamic> json) {
    return PurchaseComprado(
      id: json['id'] as String? ?? '',
      nome: json['nome'] as String? ?? '',
      valorEstimado: _num(json['valorEstimado']),
      categoria: json['categoria'] as String? ?? 'OUTROS',
      categoriaLabel: json['categoriaLabel'] as String?,
      imagemUrl: json['imagemUrl'] as String?,
      diasNaLista: json['diasNaLista'] is num
          ? (json['diasNaLista'] as num).toInt()
          : null,
      compradoEm: _dateOrNull(json['compradoEm']),
    );
  }
}

class PurchaseCategoriaShare {
  const PurchaseCategoriaShare({
    required this.label,
    this.quantidade = 0,
    this.total = 0,
  });

  final String label;
  final int quantidade;
  final double total;

  factory PurchaseCategoriaShare.fromJson(Map<String, dynamic> json) {
    return PurchaseCategoriaShare(
      label: json['label'] as String? ?? '',
      quantidade: json['quantidade'] is num
          ? (json['quantidade'] as num).toInt()
          : 0,
      total: _num(json['total']),
    );
  }
}

class PurchaseResumo {
  const PurchaseResumo({
    this.totalValor = 0,
    this.totalItens = 0,
    this.mediaImpactoRenda = 0,
    this.rendaMensal = 0,
    this.sobraMensal = 0,
    this.categorias = const {},
    this.dicas = const [],
  });

  final double totalValor;
  final int totalItens;
  final double mediaImpactoRenda;
  final double rendaMensal;
  final double sobraMensal;
  final Map<String, PurchaseCategoriaShare> categorias;
  final List<String> dicas;

  factory PurchaseResumo.fromJson(Map<String, dynamic> json) {
    final rawCats = json['categorias'];
    final categorias = <String, PurchaseCategoriaShare>{};
    if (rawCats is Map) {
      for (final entry in rawCats.entries) {
        if (entry.value is Map<String, dynamic>) {
          categorias['${entry.key}'] = PurchaseCategoriaShare.fromJson(
            entry.value as Map<String, dynamic>,
          );
        }
      }
    }
    return PurchaseResumo(
      totalValor: _num(json['totalValor']),
      totalItens: json['totalItens'] is num
          ? (json['totalItens'] as num).toInt()
          : 0,
      mediaImpactoRenda: _num(json['mediaImpactoRenda']),
      rendaMensal: _num(json['rendaMensal']),
      sobraMensal: _num(json['sobraMensal']),
      categorias: categorias,
      dicas: (json['dicas'] as List<dynamic>? ?? const [])
          .map((item) => item is Map ? '${item['texto'] ?? ''}' : '$item')
          .where((text) => text.isNotEmpty)
          .toList(),
    );
  }
}

class PurchasePainel {
  const PurchasePainel({
    required this.resumo,
    this.itens = const [],
    this.comprados = const [],
  });

  final PurchaseResumo resumo;
  final List<PurchaseItem> itens;
  final List<PurchaseComprado> comprados;

  factory PurchasePainel.fromJson(Map<String, dynamic> json) {
    return PurchasePainel(
      resumo: PurchaseResumo.fromJson(
        json['resumo'] as Map<String, dynamic>? ?? const {},
      ),
      itens: (json['itens'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PurchaseItem.fromJson)
          .toList(),
      comprados: (json['comprados'] as List<dynamic>? ?? const [])
          .whereType<Map<String, dynamic>>()
          .map(PurchaseComprado.fromJson)
          .toList(),
    );
  }
}
