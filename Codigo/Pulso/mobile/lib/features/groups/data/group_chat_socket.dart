import 'package:pulso/core/config/app_config.dart';
import 'package:pulso/core/storage/token_storage.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

typedef GrupoMensagemHandler = void Function(Map<String, dynamic> payload);

/// Socket.IO do chat de grupos — path `/api/socket.io`, auth via Bearer.
class GroupChatSocket {
  GroupChatSocket(this._storage);

  final TokenStorage _storage;
  io.Socket? _socket;

  Future<io.Socket?> connect() async {
    if (_socket?.connected == true) return _socket;

    final token = await _storage.readAccess();
    if (token == null || token.isEmpty) return null;

    _socket?.dispose();
    final socket = io.io(
      AppConfig.apiBaseUrl,
      io.OptionBuilder()
          .setPath('/api/socket.io')
          .setTransports(['websocket', 'polling'])
          .enableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );
    _socket = socket;
    return socket;
  }

  Future<void> joinGrupo(String grupoId) async {
    final socket = await connect();
    if (socket == null || grupoId.isEmpty) return;
    void emitJoin() => socket.emit('grupo:join', grupoId);
    if (socket.connected) {
      emitJoin();
    } else {
      socket.once('connect', (_) => emitJoin());
    }
  }

  Future<void Function()> onMensagem(GrupoMensagemHandler handler) async {
    final socket = await connect();
    if (socket == null) return () {};

    void listener(dynamic data) {
      if (data is Map) {
        handler(Map<String, dynamic>.from(data));
      }
    }

    socket.on('grupo:mensagem', listener);
    return () => socket.off('grupo:mensagem', listener);
  }

  void dispose() {
    _socket?.dispose();
    _socket = null;
  }
}
