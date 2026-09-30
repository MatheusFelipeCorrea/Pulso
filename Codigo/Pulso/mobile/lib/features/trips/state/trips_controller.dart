import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/data/trip_repository.dart';

class TripsController extends ChangeNotifier {
  TripsController(this._repository);

  final TripRepository _repository;

  List<PulsoViagem> viagens = const [];
  bool loading = false;
  String? error;

  Future<void> reload() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      viagens = await _repository.listar();
    } on ApiException catch (err) {
      error = err.message;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> excluir(String id) async {
    await _repository.excluir(id);
    viagens = viagens.where((item) => item.id != id).toList();
    notifyListeners();
  }
}
