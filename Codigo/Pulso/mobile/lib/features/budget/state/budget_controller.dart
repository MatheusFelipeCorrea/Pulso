import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/budget/data/budget_models.dart';
import 'package:pulso/features/budget/data/budget_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class BudgetController extends ChangeNotifier {
  BudgetController(this._repository);

  final BudgetRepository _repository;

  String mes = TransactionPeriod.current();
  BudgetStatus? status;
  bool loading = false;
  String? error;

  String get mesReferenciaApi => '$mes-01';

  Future<void> bootstrap() => reload();

  Future<void> shiftMonth(int delta) async {
    mes = TransactionPeriod.shift(mes, delta);
    await reload();
  }

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      status = await _repository.obterStatus(mes: mes);
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> salvar(List<BudgetLimiteInput> limites) async {
    await _repository.salvarLimites(
      mesReferencia: mesReferenciaApi,
      limites: limites,
    );
    await reload();
  }

  Future<void> copiarMesAnterior() async {
    final origem = '${TransactionPeriod.shift(mes, -1)}-01';
    await _repository.copiarMes(
      mesOrigem: origem,
      mesDestino: mesReferenciaApi,
    );
    await reload();
  }
}
