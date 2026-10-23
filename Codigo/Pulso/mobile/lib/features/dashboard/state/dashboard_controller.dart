import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/dashboard/data/dashboard_models.dart';
import 'package:pulso/features/dashboard/data/dashboard_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DashboardController extends ChangeNotifier {
  DashboardController(this._repository);

  final DashboardRepository _repository;

  String mes = TransactionPeriod.current();
  PulsoDashboard? dados;
  bool loading = false;
  String? error;

  Future<void> bootstrap() => reload();

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      dados = await _repository.obter(mes: mes);
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> mudarMes(int delta) async {
    mes = TransactionPeriod.shift(mes, delta);
    await reload();
  }
}
