import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/goals/data/goal_models.dart';
import 'package:pulso/features/goals/data/goal_repository.dart';

class GoalsController extends ChangeNotifier {
  GoalsController(this._repository);

  final GoalRepository _repository;

  GoalFilters filters = const GoalFilters();
  GoalResumo? resumo;
  List<PulsoMeta> metas = const [];
  bool loading = false;
  String? error;

  Future<void> bootstrap() async {
    await reload();
  }

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final results = await Future.wait([
        _repository.obterResumo(),
        _repository.listar(filters.copyWith(pagina: 1)),
      ]);
      resumo = results[0] as GoalResumo;
      final page = results[1] as GoalListPage;
      metas = page.metas;
      filters = filters.copyWith(pagina: page.pagina);
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> applyTab(String? status) async {
    filters = filters.copyWith(
      clearStatus: status == null,
      status: status,
      pagina: 1,
    );
    await reload();
  }

  Future<void> search(String busca) async {
    filters = filters.copyWith(busca: busca, pagina: 1);
    await reload();
  }

  Future<void> excluir(PulsoMeta meta) async {
    await _repository.excluir(meta.id);
    await reload();
  }

  Future<void> togglePause(PulsoMeta meta) async {
    if (meta.status == 'PAUSADA') {
      await _repository.retomar(meta.id);
    } else if (meta.status == 'ATIVA') {
      await _repository.pausar(meta.id);
    }
    await reload();
  }
}
