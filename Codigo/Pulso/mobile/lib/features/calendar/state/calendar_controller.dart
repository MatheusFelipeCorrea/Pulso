import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/calendar/data/calendar_models.dart';
import 'package:pulso/features/calendar/data/calendar_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class CalendarController extends ChangeNotifier {
  CalendarController(this._calendar, this._reminders);

  final CalendarRepository _calendar;
  final ReminderRepository _reminders;

  String mes = TransactionPeriod.current();
  CalendarMonthView? visao;
  CalendarDayDetail? detalhe;
  GoogleCalendarStatus? google;
  String? selectedDate;
  bool loading = false;
  String? error;

  Future<void> bootstrap() async {
    selectedDate ??= DateTime.now().toIso8601String().substring(0, 10);
    await reload();
  }

  Future<void> shiftMonth(int delta) async {
    mes = TransactionPeriod.shift(mes, delta);
    selectedDate = '$mes-01';
    await reload();
  }

  Future<void> selectDay(String date) async {
    selectedDate = date;
    await _loadDay();
    notifyListeners();
  }

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      visao = await _calendar.obterMes(mes);
      try {
        google = await _calendar.googleStatus();
      } on ApiException {
        google = const GoogleCalendarStatus();
      }
      await _loadDay();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> _loadDay() async {
    final date = selectedDate;
    if (date == null) return;
    detalhe = await _calendar.obterDia(date);
  }

  Future<void> salvarLembrete(
    Map<String, dynamic> payload, {
    String? id,
  }) async {
    if (id == null) {
      await _reminders.criar(payload);
    } else {
      await _reminders.atualizar(id, payload);
    }
    await reload();
  }

  Future<void> pagar(PulsoLembrete lembrete) async {
    await _reminders.pagar(lembrete.id);
    await reload();
  }

  Future<void> excluir(PulsoLembrete lembrete) async {
    await _reminders.excluir(lembrete.id);
    await reload();
  }
}
