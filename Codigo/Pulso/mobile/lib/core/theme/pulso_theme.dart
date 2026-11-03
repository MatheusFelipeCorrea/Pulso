import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';

class PulsoTheme {
  static ThemeData light() => _build(Brightness.light);
  static ThemeData dark() => _build(Brightness.dark);

  static OutlineInputBorder _border(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
      borderSide: BorderSide(color: color),
    );
  }

  static ButtonStyle _filledStyle() {
    return ButtonStyle(
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.disabled)) {
          return PulsoColors.button.withValues(alpha: 0.5);
        }
        if (states.contains(WidgetState.pressed))
          return PulsoColors.buttonActive;
        if (states.contains(WidgetState.hovered))
          return PulsoColors.buttonHover;
        return PulsoColors.button;
      }),
      foregroundColor: const WidgetStatePropertyAll(Colors.white),
      // Avoid Size.fromHeight (width=∞) — breaks FilledButton inside Rows.
      minimumSize: const WidgetStatePropertyAll(
        Size(64, PulsoTokens.buttonLg),
      ),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: PulsoTokens.space4,
          vertical: PulsoTokens.space3,
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
        ),
      ),
      textStyle: WidgetStatePropertyAll(
        GoogleFonts.inter(
          fontSize: PulsoTokens.fontMd,
          fontWeight: PulsoTokens.weightMedium,
          height: PulsoTokens.lineTight,
        ),
      ),
      elevation: const WidgetStatePropertyAll(0),
    );
  }

  static ButtonStyle _outlineStyle(ColorScheme scheme) {
    return ButtonStyle(
      foregroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.hovered) ||
            states.contains(WidgetState.pressed)) {
          return Colors.white;
        }
        return PulsoColors.button;
      }),
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.pressed)) return PulsoColors.button;
        if (states.contains(WidgetState.hovered))
          return PulsoColors.buttonHover;
        return Colors.transparent;
      }),
      side: WidgetStateProperty.resolveWith((states) {
        final color =
            states.contains(WidgetState.hovered) ||
                states.contains(WidgetState.pressed)
            ? PulsoColors.buttonHover
            : PulsoColors.button;
        return BorderSide(color: color);
      }),
      minimumSize: const WidgetStatePropertyAll(
        Size(64, PulsoTokens.buttonMd),
      ),
      padding: const WidgetStatePropertyAll(
        EdgeInsets.symmetric(horizontal: PulsoTokens.space5),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
        ),
      ),
      textStyle: WidgetStatePropertyAll(
        GoogleFonts.inter(
          fontSize: PulsoTokens.fontMd,
          fontWeight: PulsoTokens.weightMedium,
        ),
      ),
    );
  }

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final scheme = ColorScheme(
      brightness: brightness,
      primary: isDark ? PulsoColors.primaryLight : PulsoColors.primary,
      onPrimary: Colors.white,
      primaryContainer: PulsoColors.button,
      onPrimaryContainer: Colors.white,
      secondary: PulsoColors.primaryLight,
      onSecondary: Colors.white,
      tertiary: isDark ? PulsoColors.cyanDark : PulsoColors.cyan,
      onTertiary: Colors.white,
      error: isDark ? PulsoColors.dangerDark : PulsoColors.danger,
      onError: Colors.white,
      surface: isDark ? PulsoColors.darkCard : PulsoColors.lightCard,
      onSurface: isDark ? PulsoColors.darkText : PulsoColors.lightText,
      onSurfaceVariant: isDark
          ? PulsoColors.darkSecondary
          : PulsoColors.lightSecondary,
      outline: isDark ? PulsoColors.darkBorder : PulsoColors.lightBorder,
      outlineVariant: isDark
          ? PulsoColors.darkInputBorder
          : PulsoColors.lightBorder,
      surfaceContainerHighest: isDark
          ? PulsoColors.darkSurface
          : PulsoColors.lightSurface,
      inverseSurface: isDark ? PulsoColors.lightCard : PulsoColors.darkCard,
      onInverseSurface: isDark ? PulsoColors.lightText : PulsoColors.darkText,
      inversePrimary: PulsoColors.primary,
      scrim: isDark ? PulsoTokens.overlayDark : PulsoTokens.overlay,
    );

    final baseText = TextTheme(
      headlineSmall: GoogleFonts.inter(
        fontSize: PulsoTokens.fontXl,
        fontWeight: PulsoTokens.weightBold,
        height: PulsoTokens.lineTight,
        color: scheme.onSurface,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: PulsoTokens.fontLg,
        fontWeight: PulsoTokens.weightSemibold,
        height: PulsoTokens.lineTight,
        color: scheme.onSurface,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: PulsoTokens.fontMd,
        fontWeight: PulsoTokens.weightSemibold,
        color: scheme.onSurface,
      ),
      titleSmall: GoogleFonts.inter(
        fontSize: PulsoTokens.fontSm,
        fontWeight: PulsoTokens.weightSemibold,
        color: scheme.onSurface,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: PulsoTokens.fontMd,
        fontWeight: PulsoTokens.weightNormal,
        height: PulsoTokens.lineNormal,
        color: scheme.onSurface,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: PulsoTokens.fontSm,
        height: PulsoTokens.lineNormal,
        color: scheme.onSurface,
      ),
      bodySmall: GoogleFonts.inter(
        fontSize: PulsoTokens.fontXs,
        height: PulsoTokens.lineNormal,
        color: scheme.onSurfaceVariant,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: PulsoTokens.fontSm,
        fontWeight: PulsoTokens.weightMedium,
        color: scheme.onSurface,
      ),
      labelSmall: GoogleFonts.inter(
        fontSize: PulsoTokens.fontXs,
        fontWeight: PulsoTokens.weightMedium,
        color: scheme.onSurfaceVariant,
      ),
    );

    final shapeMd = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      textTheme: baseText,
      scaffoldBackgroundColor: isDark
          ? PulsoColors.darkBackground
          : PulsoColors.lightBackground,
      canvasColor: isDark
          ? PulsoColors.darkBackground
          : PulsoColors.lightBackground,
      dividerColor: scheme.outline,
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: isDark
            ? PulsoColors.darkBackground
            : PulsoColors.lightBackground,
        foregroundColor: scheme.onSurface,
        titleTextStyle: GoogleFonts.inter(
          fontSize: PulsoTokens.fontLg,
          fontWeight: PulsoTokens.weightSemibold,
          color: scheme.onSurface,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark ? PulsoColors.darkInputBg : Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: PulsoTokens.space4,
          vertical: 14,
        ),
        border: _border(
          isDark ? PulsoColors.darkInputBorder : PulsoColors.lightInputBorder,
        ),
        enabledBorder: _border(
          isDark ? PulsoColors.darkInputBorder : PulsoColors.lightInputBorder,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
          borderSide: const BorderSide(color: PulsoColors.button, width: 1.5),
        ),
        errorBorder: _border(scheme.error),
        hintStyle: GoogleFonts.inter(
          color: isDark
              ? PulsoColors.darkPlaceholder
              : PulsoColors.lightPlaceholder,
          fontSize: PulsoTokens.fontMd,
        ),
        labelStyle: GoogleFonts.inter(
          color: scheme.onSurfaceVariant,
          fontSize: PulsoTokens.fontSm,
          fontWeight: PulsoTokens.weightMedium,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(style: _filledStyle()),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: _outlineStyle(scheme),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: PulsoColors.button,
          textStyle: GoogleFonts.inter(
            fontSize: PulsoTokens.fontMd,
            fontWeight: PulsoTokens.weightMedium,
          ),
        ),
      ),
      iconTheme: IconThemeData(color: scheme.onSurfaceVariant, size: 22),
      listTileTheme: ListTileThemeData(
        iconColor: scheme.onSurfaceVariant,
        textColor: scheme.onSurface,
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(
          foregroundColor: scheme.onSurfaceVariant,
          minimumSize: const Size(PulsoTokens.buttonMd, PulsoTokens.buttonMd),
          shape: const CircleBorder(),
        ),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: PulsoColors.button,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(PulsoTokens.radiusMd)),
        ),
      ),
      chipTheme: ChipThemeData(
        shape: StadiumBorder(
          side: BorderSide(color: scheme.outline.withValues(alpha: 0.4)),
        ),
        selectedColor: PulsoColors.button.withValues(alpha: 0.12),
        labelStyle: GoogleFonts.inter(
          fontSize: PulsoTokens.fontXs,
          fontWeight: PulsoTokens.weightSemibold,
        ),
        padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space2),
      ),
      segmentedButtonTheme: SegmentedButtonThemeData(
        style: ButtonStyle(
          shape: WidgetStatePropertyAll(shapeMd),
          foregroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) return Colors.white;
            return scheme.primary;
          }),
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected))
              return PulsoColors.button;
            return Colors.transparent;
          }),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: 68,
        elevation: 0,
        backgroundColor: isDark ? PulsoColors.darkCard : PulsoColors.lightCard,
        indicatorColor: PulsoColors.button.withValues(alpha: 0.14),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return GoogleFonts.inter(
            fontSize: 12,
            fontWeight: selected
                ? PulsoTokens.weightSemibold
                : PulsoTokens.weightMedium,
            color: selected ? PulsoColors.button : scheme.onSurfaceVariant,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            size: 22,
            color: selected ? PulsoColors.button : scheme.onSurfaceVariant,
          );
        }),
      ),
      cardTheme: CardThemeData(
        color: scheme.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
          side: BorderSide(color: scheme.outline),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: scheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        ),
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: scheme.surface,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(PulsoTokens.radiusXl),
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: isDark
            ? PulsoColors.darkInputBg
            : PulsoColors.lightText,
        contentTextStyle: GoogleFonts.inter(
          color: Colors.white,
          fontSize: PulsoTokens.fontSm,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
        ),
      ),
      checkboxTheme: CheckboxThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(PulsoTokens.radiusSm),
        ),
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return PulsoColors.button;
          return Colors.transparent;
        }),
      ),
      expansionTileTheme: ExpansionTileThemeData(
        shape: const Border(),
        collapsedShape: const Border(),
        iconColor: scheme.onSurfaceVariant,
      ),
    );
  }
}
