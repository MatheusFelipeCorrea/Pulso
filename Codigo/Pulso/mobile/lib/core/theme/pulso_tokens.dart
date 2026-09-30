import 'package:flutter/material.dart';

/// Espelha `Codigo/Pulso/web/src/design-system/styles/tokens.css`.
abstract final class PulsoTokens {
  static const space1 = 4.0;
  static const space2 = 8.0;
  static const space3 = 12.0;
  static const space4 = 16.0;
  static const space5 = 20.0;
  static const space6 = 24.0;
  static const space8 = 32.0;
  static const space10 = 40.0;
  static const space12 = 48.0;
  static const space16 = 64.0;

  static const radiusSm = 4.0;
  static const radiusMd = 8.0;
  static const radiusLg = 12.0;
  static const radiusXl = 16.0;
  static const radiusFull = 999.0;

  static const fontXs = 12.0;
  static const fontSm = 14.0;
  static const fontMd = 16.0;
  static const fontLg = 18.0;
  static const fontXl = 24.0;
  static const font2xl = 32.0;

  static const lineTight = 1.25;
  static const lineNormal = 1.5;
  static const lineRelaxed = 1.75;

  static const weightNormal = FontWeight.w400;
  static const weightMedium = FontWeight.w500;
  static const weightSemibold = FontWeight.w600;
  static const weightBold = FontWeight.w700;

  static const durationFast = Duration(milliseconds: 150);
  static const durationNormal = Duration(milliseconds: 200);
  static const durationSlow = Duration(milliseconds: 300);

  static const buttonSm = 32.0;
  static const buttonMd = 40.0;
  static const buttonLg = 48.0;

  static const overlay = Color(0x66000000);
  static const overlayDark = Color(0x99000000);

  static List<BoxShadow> shadowSm(bool isDark) => isDark
      ? const []
      : const [BoxShadow(color: Color(0x0D000000), blurRadius: 2, offset: Offset(0, 1))];

  static List<BoxShadow> shadowMd(bool isDark) => isDark
      ? const []
      : const [BoxShadow(color: Color(0x1A000000), blurRadius: 6, offset: Offset(0, 4))];
}
