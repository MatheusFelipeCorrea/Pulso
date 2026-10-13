import 'package:flutter/material.dart';

class PulsoAssets {
  static const logoLight = 'assets/brand/LogoMClaro.png';
  static const logoDark = 'assets/brand/LogoMEscuro.png';
  static const icon = 'assets/brand/PulsoIcon.png';
  static const googleG = 'assets/brand/google_g.svg';

  /// Proporção dos PNGs oficiais (~2390×726), igual à Web.
  static const logoAspect = 2390 / 726;
}

class PulsoBrand extends StatelessWidget {
  const PulsoBrand({super.key, this.showTagline = false, this.height = 32});

  final bool showTagline;
  final double height;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final width = height * PulsoAssets.logoAspect;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Image.asset(
          isDark ? PulsoAssets.logoDark : PulsoAssets.logoLight,
          height: height,
          width: width,
          fit: BoxFit.contain,
          alignment: Alignment.centerLeft,
          filterQuality: FilterQuality.high,
        ),
        if (showTagline) ...[
          const SizedBox(height: 2),
          Text(
            'Seu monitoramento financeiro',
            style: Theme.of(context).textTheme.bodySmall
                ?.copyWith(fontSize: 11, height: 1.2),
          ),
        ],
      ],
    );
  }
}

class PulsoLogoMark extends StatelessWidget {
  const PulsoLogoMark({super.key, this.size = 32});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      PulsoAssets.icon,
      width: size,
      height: size,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
    );
  }
}
