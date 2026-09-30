import 'package:flutter/foundation.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/data/transaction_repository.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TransactionsController extends ChangeNotifier {
  TransactionsController(this._repository);

  final TransactionRepository _repository;

  TransactionFilters filters = TransactionFilters(periodo: TransactionPeriod.current());
  TransactionFilterOptions? options;
  TransactionResumo? resumo;
  final List<PulsoTransacao> transacoes = [];

  bool loading = false;
  bool loadingMore = false;
  String? error;
  int pagina = 1;
  int paginas = 1;

  bool get hasMore => pagina < paginas;

  Future<void> bootstrap() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      options = await _repository.obterOpcoes();
      await _fetch();
    } catch (err) {
      error = err.toString();
      loading = false;
      notifyListeners();
    }
  }

  Future<void> applyFilters(TransactionFilters next) async {
    filters = next;
    await _fetch();
  }

  Future<void> shiftPeriod(int delta) {
    return applyFilters(filters.copyWith(periodo: TransactionPeriod.shift(filters.periodo, delta)));
  }

  Future<void> loadMore() async {
    if (loadingMore || !hasMore) return;
    loadingMore = true;
    notifyListeners();
    try {
      final page = await _repository.listar(filters, pagina: pagina + 1);
      transacoes.addAll(page.transacoes);
      pagina = page.pagina;
      paginas = page.paginas;
    } catch (err) {
      error = err.toString();
    } finally {
      loadingMore = false;
      notifyListeners();
    }
  }

  Future<void> reload() => _fetch();

  Future<void> excluir(PulsoTransacao tx, {required bool excluirFuturas}) async {
    await _repository.excluir(
      tx.id,
      excluirFuturas: excluirFuturas,
      dataCorte: excluirFuturas ? tx.data : null,
    );
    await _fetch();
  }

  Future<void> _fetch() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final results = await Future.wait([
        _repository.listar(filters, pagina: 1),
        _repository.obterResumo(filters),
      ]);
      final page = results[0] as TransactionListPage;
      resumo = results[1] as TransactionResumo;
      transacoes
        ..clear()
        ..addAll(page.transacoes);
      pagina = page.pagina;
      paginas = page.paginas;
    } catch (err) {
      error = err.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> refreshOptions() async {
    options = await _repository.obterOpcoes();
    notifyListeners();
  }
}
