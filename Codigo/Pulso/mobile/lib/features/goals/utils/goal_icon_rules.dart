import 'package:flutter/material.dart';

String _normalize(String nome) {
  const from = 'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ';
  const to = 'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN';
  final buffer = StringBuffer();
  for (final rune in nome.toLowerCase().runes) {
    final ch = String.fromCharCode(rune);
    final index = from.indexOf(ch);
    buffer.write(index >= 0 ? to[index] : ch);
  }
  return buffer.toString();
}

bool _matches(String normalized, String keyword) {
  final term = _normalize(keyword);
  if (term.isEmpty) return false;
  return ' $normalized '.contains(' $term ');
}

class _Rule {
  const _Rule(this.icon, this.keywords);
  final IconData icon;
  final List<String> keywords;
}

/// Primeira regra que bater vence — mesma ideia da web (`goalIconRules.js`).
const _rules = <_Rule>[
  _Rule(Icons.flight, [
    'viagem',
    'viajar',
    'trip',
    'ferias',
    'passagem',
    'aereo',
    'aviao',
    'voo',
    'turismo',
    'disney',
    'europa',
    'paris',
    'londres',
    'orlando',
    'intercambio',
    'aeroporto',
  ]),
  _Rule(Icons.beach_access, [
    'praia',
    'caribe',
    'resort',
    'tropical',
    'buzios',
    'salvador',
    'fortaleza',
    'recife',
    'noronha',
  ]),
  _Rule(Icons.public, [
    'mundo',
    'global',
    'internacional',
    'exterior',
    'passaporte',
    'visto',
  ]),
  _Rule(Icons.place_outlined, ['destino', 'roteiro', 'passeio', 'conhecer']),
  _Rule(Icons.explore_outlined, [
    'aventura',
    'explorar',
    'expedicao',
    'mochileiro',
  ]),
  _Rule(Icons.terrain, [
    'camping',
    'acampamento',
    'trilha',
    'trekking',
    'montanha',
    'serra',
    'chapada',
  ]),
  _Rule(Icons.luggage_outlined, [
    'mochila',
    'mala',
    'bagagem',
    'hostel',
    'airbnb',
    'malas',
  ]),
  _Rule(Icons.directions_boat_outlined, [
    'barco',
    'iate',
    'lancha',
    'navegar',
    'cruzeiro',
    'veleiro',
  ]),
  _Rule(Icons.train_outlined, ['trem', 'metro', 'ferrovia']),
  _Rule(Icons.directions_bus, ['onibus', 'van']),
  _Rule(Icons.confirmation_number_outlined, [
    'ingresso',
    'show',
    'evento',
    'festival',
  ]),
  _Rule(Icons.movie_outlined, [
    'cinema',
    'filme',
    'serie',
    'netflix',
    'streaming',
  ]),
  _Rule(Icons.surfing, ['surf', 'mergulho', 'lago', 'kayak']),
  _Rule(Icons.directions_car_outlined, [
    'carro',
    'automovel',
    'veiculo',
    'suv',
    'sedan',
    'ipva',
    'cnh',
    'uber',
    'estacionamento',
  ]),
  _Rule(Icons.two_wheeler, [
    'moto',
    'motocicleta',
    'scooter',
    'bicicleta',
    'bike',
  ]),
  _Rule(Icons.home_outlined, [
    'casa',
    'apartamento',
    'imovel',
    'aluguel',
    'financiamento',
    'reforma',
    'moveis',
    'sofa',
    'decoracao',
  ]),
  _Rule(Icons.key_outlined, ['entrada', 'sinal', 'chave']),
  _Rule(Icons.school_outlined, [
    'faculdade',
    'universidade',
    'mestrado',
    'doutorado',
    'curso',
    'estudo',
    'educacao',
    'ingles',
    'idioma',
  ]),
  _Rule(Icons.menu_book_outlined, ['livro', 'leitura', 'biblioteca']),
  _Rule(Icons.laptop_mac, [
    'notebook',
    'laptop',
    'computador',
    'pc',
    'macbook',
  ]),
  _Rule(Icons.smartphone, ['celular', 'iphone', 'android', 'smartphone']),
  _Rule(Icons.headphones, ['fone', 'airpods', 'headset']),
  _Rule(Icons.camera_alt_outlined, ['camera', 'fotografia']),
  _Rule(Icons.sports_esports_outlined, [
    'game',
    'videogame',
    'playstation',
    'xbox',
    'nintendo',
  ]),
  _Rule(Icons.monitor, ['monitor', 'tv', 'televisao']),
  _Rule(Icons.favorite_outline, [
    'casamento',
    'namoro',
    'relacionamento',
    'amor',
    'saude',
    'vida',
  ]),
  _Rule(Icons.child_friendly_outlined, ['bebe', 'enxoval', 'filho', 'crianca']),
  _Rule(Icons.card_giftcard, ['presente', 'aniversario', 'natal', 'formatura']),
  _Rule(Icons.pets_outlined, ['pet', 'cachorro', 'gato', 'veterinario']),
  _Rule(Icons.medical_services_outlined, [
    'medico',
    'consulta',
    'exame',
    'dentista',
    'hospital',
    'cirurgia',
  ]),
  _Rule(Icons.fitness_center, [
    'academia',
    'treino',
    'musculacao',
    'corrida',
    'esporte',
  ]),
  _Rule(Icons.restaurant, [
    'restaurante',
    'jantar',
    'comida',
    'alimentacao',
    'churrasco',
  ]),
  _Rule(Icons.coffee, ['cafe', 'cafeteria']),
  _Rule(Icons.savings_outlined, [
    'reserva',
    'emergencia',
    'poupanca',
    'guardar',
    'colchao',
  ]),
  _Rule(Icons.account_balance_wallet_outlined, [
    'divida',
    'cartao',
    'fatura',
    'emprestimo',
  ]),
  _Rule(Icons.trending_up, [
    'investir',
    'investimento',
    'acao',
    'renda',
    'tesouro',
  ]),
  _Rule(Icons.work_outline, ['trabalho', 'carreira', 'negocio', 'empresa']),
  _Rule(Icons.celebration_outlined, ['festa', 'formatura', 'reveillon']),
];

IconData goalIconForName(String? nome) {
  final normalized = _normalize(nome ?? '');
  if (normalized.trim().isEmpty) return Icons.flag_outlined;
  for (final rule in _rules) {
    if (rule.keywords.any((keyword) => _matches(normalized, keyword))) {
      return rule.icon;
    }
  }
  return Icons.flag_outlined;
}
