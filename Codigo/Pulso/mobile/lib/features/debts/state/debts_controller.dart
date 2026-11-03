import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/debts/data/debt_models.dart';
import 'package:pulso/features/debts/data/debt_repository.dart';

class DebtsController extends ChangeNotifier {
  DebtsController(this._repository);

  final DebtRepository _repository;

  List<PulsoDivida> dividas = const [];
  DebtResumo resumo = const DebtResumo(
    meDevem: DebtBucket(total: 0, quantidade: 0),
    euDevo: DebtBucket(total: 0, quantidade: 0),
  );
  bool loading = false;
  String? error;

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final page = await _repository.listar();
      resumo = await _repository.resumo();
      dividas = page.dividas;
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
