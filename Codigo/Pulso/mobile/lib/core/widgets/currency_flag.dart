import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Mesmas bandeiras circulares da web (`hatscripts/circle-flags`).
const _flagCodes = <String, String>{
  'AED': 'ae',
  'AFN': 'af',
  'ANG': 'cw',
  'ARS': 'ar',
  'AUD': 'au',
  'BHD': 'bh',
  'BOB': 'bo',
  'BRL': 'br',
  'BYN': 'by',
  'CAD': 'ca',
  'CHF': 'ch',
  'CLP': 'cl',
  'CNY': 'cn',
  'COP': 'co',
  'CRC': 'cr',
  'CZK': 'cz',
  'DKK': 'dk',
  'EGP': 'eg',
  'EUR': 'eu',
  'FJD': 'fj',
  'GBP': 'gb',
  'GEL': 'ge',
  'GHS': 'gh',
  'HKD': 'hk',
  'HUF': 'hu',
  'IDR': 'id',
  'ILS': 'il',
  'INR': 'in',
  'IQD': 'iq',
  'IRR': 'ir',
  'JOD': 'jo',
  'JPY': 'jp',
  'KES': 'ke',
  'KRW': 'kr',
  'KWD': 'kw',
  'KYD': 'ky',
  'MAD': 'ma',
  'MXN': 'mx',
  'MYR': 'my',
  'NIO': 'ni',
  'NOK': 'no',
  'NZD': 'nz',
  'PEN': 'pe',
  'PHP': 'ph',
  'PLN': 'pl',
  'PYG': 'py',
  'RON': 'ro',
  'RSD': 'rs',
  'RUB': 'ru',
  'SAR': 'sa',
  'SDG': 'sd',
  'SEK': 'se',
  'SGD': 'sg',
  'SYP': 'sy',
  'THB': 'th',
  'TRY': 'tr',
  'TWD': 'tw',
  'UAH': 'ua',
  'USD': 'us',
  'UYU': 'uy',
  'VEF': 've',
  'VND': 'vn',
  'XAG': 'un',
  'XAU': 'un',
  'XCD': 'ag',
  'XOF': 'sn',
  'XPF': 'pf',
  'ZAR': 'za',
};

String? currencyFlagUrl(String? code) {
  final flag = _flagCodes[code?.toUpperCase()];
  if (flag == null) return null;
  return 'https://hatscripts.github.io/circle-flags/flags/$flag.svg';
}

class CurrencyFlag extends StatelessWidget {
  const CurrencyFlag({super.key, required this.code, this.size = 22});

  final String code;
  final double size;

  @override
  Widget build(BuildContext context) {
    final url = currencyFlagUrl(code);
    final fallback = _Fallback(code: code, size: size);
    if (url == null) return fallback;
    return SizedBox(
      width: size,
      height: size,
      child: ClipOval(
        child: SvgPicture.network(
          url,
          width: size,
          height: size,
          fit: BoxFit.cover,
          placeholderBuilder: (_) => fallback,
          errorBuilder: (context, error, stackTrace) => fallback,
        ),
      ),
    );
  }
}

class _Fallback extends StatelessWidget {
  const _Fallback({required this.code, required this.size});

  final String code;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.12),
      ),
      child: Text(
        code.length >= 2 ? code.substring(0, 2) : code,
        style: TextStyle(
          fontSize: size * 0.38,
          fontWeight: FontWeight.w700,
          height: 1,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}

class CurrencyCodeChip extends StatelessWidget {
  const CurrencyCodeChip({super.key, required this.code, this.size = 18});

  final String code;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        CurrencyFlag(code: code, size: size),
        const SizedBox(width: 6),
        Text(code, style: Theme.of(context).textTheme.labelLarge),
      ],
    );
  }
}
