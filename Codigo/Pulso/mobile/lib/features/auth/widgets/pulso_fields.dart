import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';

class PulsoTextField extends StatelessWidget {
  const PulsoTextField({
    super.key,
    required this.controller,
    required this.hint,
    this.icon,
    this.keyboardType,
    this.errorText,
    this.onChanged,
    this.textCapitalization = TextCapitalization.none,
    this.autofillHints,
  });

  final TextEditingController controller;
  final String hint;
  final IconData? icon;
  final TextInputType? keyboardType;
  final String? errorText;
  final ValueChanged<String>? onChanged;
  final TextCapitalization textCapitalization;
  final Iterable<String>? autofillHints;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      textCapitalization: textCapitalization,
      autofillHints: autofillHints,
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: icon == null
            ? null
            : Icon(icon, color: isDark ? PulsoColors.darkSecondary : PulsoColors.lightSecondary),
        errorText: errorText,
      ),
    );
  }
}

class PulsoPasswordField extends StatefulWidget {
  const PulsoPasswordField({
    super.key,
    required this.controller,
    required this.hint,
    this.errorText,
    this.onChanged,
  });

  final TextEditingController controller;
  final String hint;
  final String? errorText;
  final ValueChanged<String>? onChanged;

  @override
  State<PulsoPasswordField> createState() => _PulsoPasswordFieldState();
}

class _PulsoPasswordFieldState extends State<PulsoPasswordField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return TextField(
      controller: widget.controller,
      obscureText: _obscure,
      onChanged: widget.onChanged,
      decoration: InputDecoration(
        hintText: widget.hint,
        prefixIcon: Icon(
          Icons.lock_outline,
          color: isDark ? PulsoColors.darkSecondary : PulsoColors.lightSecondary,
        ),
        suffixIcon: IconButton(
          onPressed: () => setState(() => _obscure = !_obscure),
          icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
        ),
        errorText: widget.errorText,
      ),
    );
  }
}
