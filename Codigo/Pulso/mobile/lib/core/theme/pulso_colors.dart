import 'package:flutter/material.dart';

/// Tokens alinhados a `Codigo/Pulso/web/src/design-system/styles/tokens.css`.
/// Laranja de badge (VR) segue o catálogo web `#EA580C`, não o `--ds-color-orange` legado.
class PulsoColors {
  static const primary = Color(0xFF7C3AED);
  static const primaryLight = Color(0xFFA78BFA);
  static const primaryDark = Color(0xFF5B21B6);
  static const button = Color(0xFF7C3AED);
  static const buttonHover = Color(0xFFA78BFA);
  static const buttonActive = Color(0xFF6D28D9);

  static const success = Color(0xFF10B981);
  static const successDark = Color(0xFF34D399);
  static const danger = Color(0xFFEF4444);
  static const dangerDark = Color(0xFFF87171);
  static const warning = Color(0xFFF59E0B);
  static const warningDark = Color(0xFFFBBF24);
  static const info = Color(0xFF3B82F6);
  static const infoDark = Color(0xFF60A5FA);
  static const cyan = Color(0xFF06B6D4);
  static const cyanDark = Color(0xFF22D3EE);
  static const orange = Color(0xFFEA580C);
  static const orangeDark = Color(0xFFFB923C);

  static const lightBackground = Color(0xFFFAFAFA);
  static const lightCard = Color(0xFFFFFFFF);
  static const lightSurface = Color(0xFFF4F4F5);
  static const lightBorder = Color(0xFFE4E4E7);
  static const lightText = Color(0xFF18181B);
  static const lightSecondary = Color(0xFF71717A);
  static const lightPlaceholder = Color(0xFFA1A1AA);
  static const lightInputBorder = Color(0xFFE4E4E7);
  static const lightHover = Color(0xFFF4F4F5);

  static const darkBackground = Color(0xFF09090B);
  static const darkCard = Color(0xFF18181B);
  static const darkSurface = Color(0xFF18181B);
  static const darkBorder = Color(0xFF27272A);
  static const darkText = Color(0xFFFAFAFA);
  static const darkSecondary = Color(0xFFA1A1AA);
  static const darkPlaceholder = Color(0xFF71717A);
  static const darkInputBg = Color(0xFF27272A);
  static const darkInputBorder = Color(0xFF3F3F46);
  static const darkHover = Color(0xFF27272A);

  static Color onBackground(Brightness brightness) =>
      brightness == Brightness.dark ? darkText : lightText;

  static Color secondaryText(Brightness brightness) =>
      brightness == Brightness.dark ? darkSecondary : lightSecondary;

  static Color surface(Brightness brightness) =>
      brightness == Brightness.dark ? darkCard : lightCard;

  static Color border(Brightness brightness) =>
      brightness == Brightness.dark ? darkBorder : lightBorder;

  static Color infoOf(Brightness brightness) =>
      brightness == Brightness.dark ? infoDark : info;

  static Color cyanOf(Brightness brightness) =>
      brightness == Brightness.dark ? cyanDark : cyan;

  static Color orangeOf(Brightness brightness) =>
      brightness == Brightness.dark ? orangeDark : orange;

  static Color successOf(Brightness brightness) =>
      brightness == Brightness.dark ? successDark : success;

  static Color dangerOf(Brightness brightness) =>
      brightness == Brightness.dark ? dangerDark : danger;

  static Color accent(Brightness brightness) =>
      brightness == Brightness.dark ? primaryLight : primary;
}
