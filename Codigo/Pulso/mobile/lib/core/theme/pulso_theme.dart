import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';

class PulsoTheme {
  static const _radius = 8.0;

  static ThemeData light() => _build(Brightness.light);
  static ThemeData dark() => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final scheme = ColorScheme(
      brightness: brightness,
      primary: PulsoColors.primary,
      onPrimary: Colors.white,
      secondary: PulsoColors.primaryLight,
      onSecondary: Colors.white,
      error: isDark ? const Color(0xFFF87171) : PulsoColors.danger,
      onError: Colors.white,
      surface: isDark ? PulsoColors.darkCard : PulsoColors.lightCard,
      onSurface: isDark ? PulsoColors.darkText : PulsoColors.lightText,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: isDark
          ? PulsoColors.darkBackground
          : PulsoColors.lightBackground,
      fontFamily: 'Segoe UI',
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: isDark
            ? PulsoColors.darkBackground
            : PulsoColors.lightBackground,
        foregroundColor: isDark ? PulsoColors.darkText : PulsoColors.lightText,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark ? PulsoColors.darkInputBg : Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(_radius),
          borderSide: BorderSide(
            color: isDark ? PulsoColors.darkInputBorder : PulsoColors.lightInputBorder,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(_radius),
          borderSide: BorderSide(
            color: isDark ? PulsoColors.darkInputBorder : PulsoColors.lightInputBorder,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(_radius),
          borderSide: const BorderSide(color: PulsoColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(_radius),
          borderSide: BorderSide(color: scheme.error),
        ),
        hintStyle: TextStyle(
          color: isDark ? PulsoColors.darkPlaceholder : PulsoColors.lightPlaceholder,
          fontSize: 16,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: PulsoColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(48),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(_radius),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            height: 1.25,
          ),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return PulsoColors.primary;
          return Colors.transparent;
        }),
      ),
    );
  }
}
