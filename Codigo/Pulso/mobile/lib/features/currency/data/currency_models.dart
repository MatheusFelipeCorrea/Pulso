class CurrencyItem {
  const CurrencyItem({
    required this.code,
    required this.name,
    this.symbol,
    this.flag,
  });

  final String code;
  final String name;
  final String? symbol;
  final String? flag;

  factory CurrencyItem.fromJson(Map<String, dynamic> json) {
    return CurrencyItem(
      code: (json['code'] as String? ?? json['codigo'] as String? ?? '').toUpperCase(),
      name: json['name'] as String? ?? json['nome'] as String? ?? '',
      symbol: json['symbol'] as String? ?? json['simbolo'] as String?,
      flag: json['flag'] as String?,
    );
  }
}

class CurrencyQuote {
  const CurrencyQuote({
    required this.code,
    required this.rate,
  });

  final String code;
  final double rate;

  factory CurrencyQuote.fromJson(Map<String, dynamic> json) {
    final rate = json['rate'] ?? json['taxa'] ?? json['valor'];
    return CurrencyQuote(
      code: (json['code'] as String? ?? json['codigo'] as String? ?? '').toUpperCase(),
      rate: rate is num ? rate.toDouble() : double.tryParse('$rate') ?? 0,
    );
  }
}

class CurrencyConversion {
  const CurrencyConversion({
    required this.valorConvertido,
    required this.taxa,
  });

  final double valorConvertido;
  final double taxa;

  factory CurrencyConversion.fromJson(Map<String, dynamic> json) {
    return CurrencyConversion(
      valorConvertido: _num(json['valorConvertido'] ?? json['resultado']),
      taxa: _num(json['taxa'] ?? json['rate']),
    );
  }
}

class FavoriteCurrency {
  const FavoriteCurrency({
    required this.code,
    this.name,
    this.rate,
  });

  final String code;
  final String? name;
  final double? rate;

  factory FavoriteCurrency.fromJson(Map<String, dynamic> json) {
    final moeda = json['moeda'];
    if (moeda is Map<String, dynamic>) {
      return FavoriteCurrency(
        code: (moeda['code'] as String? ?? json['codigo'] as String? ?? '').toUpperCase(),
        name: moeda['name'] as String?,
        rate: _nullableNum(json['rate'] ?? json['taxa']),
      );
    }
    return FavoriteCurrency(
      code: (json['codigo'] as String? ?? json['code'] as String? ?? '').toUpperCase(),
      name: json['name'] as String? ?? json['nome'] as String?,
      rate: _nullableNum(json['rate'] ?? json['taxa']),
    );
  }
}

double _num(dynamic value) {
  if (value is num) return value.toDouble();
  return double.tryParse('$value') ?? 0;
}

double? _nullableNum(dynamic value) {
  if (value == null) return null;
  return _num(value);
}
