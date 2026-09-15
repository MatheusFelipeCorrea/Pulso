import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeController extends ChangeNotifier {
  ThemeMode mode = ThemeMode.light;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final value = prefs.getString('ds-theme-preference');
    mode = switch (value) {
      'dark' => ThemeMode.dark,
      'system' => ThemeMode.system,
      _ => ThemeMode.light,
    };
    notifyListeners();
  }

  Future<void> toggle() async {
    mode = mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ds-theme-preference', mode == ThemeMode.dark ? 'dark' : 'light');
    notifyListeners();
  }
}
