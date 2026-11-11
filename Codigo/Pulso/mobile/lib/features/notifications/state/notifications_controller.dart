import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/features/notifications/data/notification_models.dart';
import 'package:pulso/features/notifications/data/notification_repository.dart';

class NotificationsController extends ChangeNotifier {
  NotificationsController(this._repository) {
    unawaited(refreshCount());
    _timer = Timer.periodic(const Duration(seconds: 45), (_) {
      unawaited(refreshCount());
    });
  }

  final NotificationRepository _repository;
  Timer? _timer;

  List<PulsoNotificacao> items = const [];
  int unread = 0;
  bool loading = false;
  String? error;

  Future<void> refreshCount() async {
    try {
      unread = await _repository.contarNaoLidas();
      notifyListeners();
    } catch (_) {
      /* ignore background poll errors */
    }
  }

  Future<void> load() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      items = await _repository.listar();
      unread = await _repository.contarNaoLidas();
    } on ApiException catch (err) {
      error = err.message;
    } catch (_) {
      error = 'Não foi possível carregar as notificações.';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> markRead(String id) async {
    await _repository.marcarComoLida(id);
    items = [
      for (final item in items)
        if (item.id == id)
          PulsoNotificacao(
            id: item.id,
            tipo: item.tipo,
            titulo: item.titulo,
            mensagem: item.mensagem,
            lida: true,
            linkAcao: item.linkAcao,
            criadoEm: item.criadoEm,
          )
        else
          item,
    ];
    unread = unread > 0 ? unread - 1 : 0;
    notifyListeners();
  }

  Future<void> markAll() async {
    await _repository.marcarTodasLidas();
    items = [
      for (final item in items)
        PulsoNotificacao(
          id: item.id,
          tipo: item.tipo,
          titulo: item.titulo,
          mensagem: item.mensagem,
          lida: true,
          linkAcao: item.linkAcao,
          criadoEm: item.criadoEm,
        ),
    ];
    unread = 0;
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
