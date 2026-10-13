import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/purchase/data/purchase_models.dart';
import 'package:pulso/features/purchase/data/purchase_repository.dart';

class PurchaseController extends ChangeNotifier {
  PurchaseController(this._repository);

  final PurchasePlanningRepository _repository;

  PurchasePainel? painel;
  bool loading = false;
  String? error;

  Future<void> bootstrap() => reload();

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      painel = await _repository.obterPainel();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> excluir(PurchaseItem item) async {
    await _repository.excluir(item.id);
    await reload();
  }

  Future<void> comprar(PurchaseItem item) async {
    await _repository.comprar(item.id);
    await reload();
  }
}
