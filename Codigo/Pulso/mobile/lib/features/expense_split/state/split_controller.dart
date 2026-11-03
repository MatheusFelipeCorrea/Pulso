import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';

class ExpenseSplitController extends ChangeNotifier {
  ExpenseSplitController(this._repository);

  final ExpenseSplitRepository _repository;

  List<PulsoDivisao> ativas = const [];
  List<PulsoDivisao> historico = const [];
  SplitResumo resumo = const SplitResumo(
    meDevem: 0,
    euDevo: 0,
    saldo: 0,
    possuiDivisoes: false,
  );
  bool loading = false;
  String? error;

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final page = await _repository.listarHistorico();
      ativas = await _repository.listarAtivas();
      resumo = await _repository.resumo();
      historico = page.divisoes;
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
