import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/data/group_repository.dart';

class GroupsController extends ChangeNotifier {
  GroupsController(this._repository);

  final GroupRepository _repository;

  List<PulsoGrupo> grupos = const [];
  bool loading = false;
  String? error;

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      grupos = await _repository.listar();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> excluir(String id) async {
    await _repository.excluir(id);
    await reload();
  }
}
