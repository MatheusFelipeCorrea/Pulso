import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/chatbot/data/chatbot_repository.dart';

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key, this.modo = 'chat'});

  final String modo;

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatMsg {
  _ChatMsg({
    required this.role,
    required this.content,
    this.recusada = false,
    this.id,
  });

  final String? id;
  final String role;
  final String content;
  final bool recusada;
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  static const _welcome =
      'Olá! Sou o Pulso Assistente. Posso consultar seus gastos, metas, saldos e ajudar a lançar transações rápidas.';

  final _draft = TextEditingController();
  final _scroll = ScrollController();
  final _mensagens = <_ChatMsg>[_ChatMsg(role: 'assistant', content: _welcome)];
  var _sending = false;
  var _sugestoes = <ChatbotSugestao>[];
  var _conversas = <ChatbotConversaResumo>[];
  String? _conversaId;
  ChatbotPropostaTx? _proposta;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted) return;
      final repo = context.read<ChatbotRepository>();
      try {
        final list = await repo.listarSugestoes();
        if (mounted) setState(() => _sugestoes = list);
      } catch (_) {}
      await _refreshConversas();
    });
  }

  @override
  void dispose() {
    _draft.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _refreshConversas() async {
    try {
      final list = await context.read<ChatbotRepository>().listarConversas();
      if (mounted) setState(() => _conversas = list);
    } catch (_) {}
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.animateTo(
        _scroll.position.maxScrollExtent + 80,
        duration: PulsoTokens.durationNormal,
        curve: Curves.easeOut,
      );
    });
  }

  void _novaConversa({bool popSheet = false}) {
    setState(() {
      _conversaId = null;
      _mensagens
        ..clear()
        ..add(_ChatMsg(role: 'assistant', content: _welcome));
      _proposta = null;
      _draft.clear();
    });
    if (popSheet && Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    }
  }

  Future<void> _abrirConversa(String id, {bool popSheet = false}) async {
    try {
      final data = await context.read<ChatbotRepository>().obterConversa(id);
      if (!mounted) return;
      setState(() {
        _conversaId = data.id;
        _proposta = null;
        _mensagens
          ..clear()
          ..addAll(
            data.mensagens.map(
              (m) => _ChatMsg(id: m.id, role: m.role, content: m.content),
            ),
          );
        if (_mensagens.isEmpty) {
          _mensagens.add(_ChatMsg(role: 'assistant', content: _welcome));
        }
      });
      if (popSheet && Navigator.of(context).canPop()) {
        Navigator.of(context).pop();
      }
      _scrollToEnd();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _abrirHistorico() async {
    await _refreshConversas();
    if (!mounted) return;
    final scheme = Theme.of(context).colorScheme;
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (sheetContext) {
        return SafeArea(
          child: SizedBox(
            height: MediaQuery.of(sheetContext).size.height * 0.7,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 4, 8, 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Conversas',
                          style: Theme.of(sheetContext).textTheme.titleMedium
                              ?.copyWith(fontWeight: FontWeight.w700),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () => _novaConversa(popSheet: true),
                        icon: const Icon(Icons.add_comment_outlined, size: 18),
                        label: const Text('Nova'),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1),
                Expanded(
                  child: _conversas.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Text(
                              'Suas conversas salvas aparecem aqui.',
                              textAlign: TextAlign.center,
                              style: Theme.of(sheetContext).textTheme.bodySmall
                                  ?.copyWith(color: scheme.onSurfaceVariant),
                            ),
                          ),
                        )
                      : ListView.builder(
                          itemCount: _conversas.length,
                          itemBuilder: (context, index) {
                            final c = _conversas[index];
                            final active = c.id == _conversaId;
                            return ListTile(
                              selected: active,
                              title: Text(
                                c.titulo,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                [
                                  _formatQuando(c.atualizadoEm),
                                  if ((c.preview ?? '').isNotEmpty) c.preview!,
                                ].where((e) => e.isNotEmpty).join(' · '),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              onTap: () => _abrirConversa(c.id, popSheet: true),
                              trailing: IconButton(
                                tooltip: 'Apagar',
                                icon: const Icon(
                                  Icons.delete_outline,
                                  size: 18,
                                ),
                                onPressed: () => _apagarConversa(c.id),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _apagarConversa(String id) async {
    try {
      await context.read<ChatbotRepository>().excluirConversa(id);
      if (!mounted) return;
      setState(() {
        _conversas = _conversas.where((c) => c.id != id).toList();
        if (_conversaId == id) {
          _conversaId = null;
          _mensagens
            ..clear()
            ..add(_ChatMsg(role: 'assistant', content: _welcome));
          _proposta = null;
        }
      });
      showPulsoSnack(context, 'Conversa apagada');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _enviar(String texto) async {
    final mensagem = texto.trim();
    if (mensagem.isEmpty || _sending) return;
    setState(() {
      _sending = true;
      _proposta = null;
      _mensagens.add(_ChatMsg(role: 'user', content: mensagem));
      _draft.clear();
    });
    _scrollToEnd();

    final historico = _mensagens
        .where((m) => m.content != _welcome)
        .map((m) => {'role': m.role, 'content': m.content})
        .toList();
    if (historico.isNotEmpty) historico.removeLast();

    try {
      final reply = await context.read<ChatbotRepository>().enviarMensagem(
        mensagem: mensagem,
        historico: historico,
        modo: widget.modo,
        conversaId: _conversaId,
      );
      if (!mounted) return;
      setState(() {
        if (reply.conversaId != null) _conversaId = reply.conversaId;
        _mensagens.add(
          _ChatMsg(
            role: 'assistant',
            content: reply.resposta,
            recusada: reply.recusada,
          ),
        );
        _proposta = reply.propostaTransacao;
        _sending = false;
      });
      _scrollToEnd();
      await _refreshConversas();
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _mensagens.add(_ChatMsg(role: 'assistant', content: error.message));
        _sending = false;
      });
      showPulsoSnack(context, error.message);
      _scrollToEnd();
    }
  }

  Future<void> _confirmar() async {
    final proposta = _proposta;
    if (proposta == null || _sending) return;
    setState(() => _sending = true);
    try {
      await context.read<ChatbotRepository>().confirmarTransacao(proposta);
      if (!mounted) return;
      setState(() {
        _proposta = null;
        _mensagens.add(
          _ChatMsg(
            role: 'assistant',
            content:
                'Pronto! Lancei ${proposta.tipo == 'DESPESA' ? 'a despesa' : 'a receita'} de R\$ ${proposta.valor.toStringAsFixed(2).replaceAll('.', ',')}${proposta.descricao != null ? ' (${proposta.descricao})' : ''}.',
          ),
        );
        _sending = false;
      });
      showPulsoSnack(context, 'Transação lançada');
      _scrollToEnd();
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _sending = false);
      showPulsoSnack(context, error.message);
    }
  }

  String _formatQuando(DateTime? at) {
    if (at == null) return '';
    final local = at.toLocal();
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final day = DateTime(local.year, local.month, local.day);
    final hh = local.hour.toString().padLeft(2, '0');
    final mm = local.minute.toString().padLeft(2, '0');
    if (day == today) return '$hh:$mm';
    if (day == today.subtract(const Duration(days: 1))) return 'Ontem';
    final dd = local.day.toString().padLeft(2, '0');
    final mo = local.month.toString().padLeft(2, '0');
    return '$dd/$mo';
  }

  IconData _chipIcon(String? name) {
    switch (name) {
      case 'calendar':
        return Icons.calendar_today_outlined;
      case 'target':
        return Icons.gps_fixed;
      case 'chart':
        return Icons.bar_chart;
      case 'wallet':
        return Icons.account_balance_wallet_outlined;
      case 'trend':
        return Icons.trending_up;
      default:
        return Icons.lightbulb_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final accent = PulsoColors.accent(brightness);
    final scheme = Theme.of(context).colorScheme;
    final user = context.watch<AuthController>().user;
    final initial = (user?.nome ?? '?').trim().isEmpty
        ? '?'
        : user!.nome.trim()[0].toUpperCase();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
            PulsoTokens.space2,
            PulsoTokens.space2,
            PulsoTokens.space2,
            PulsoTokens.space2,
          ),
          child: Row(
            children: [
              IconButton(
                tooltip: 'Conversas',
                onPressed: _abrirHistorico,
                icon: const Icon(Icons.history),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Pulso Assistente',
                      style: Theme.of(context).textTheme.titleLarge
                          ?.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: accent.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(
                              color: accent.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Text(
                            'Powered by Gemini',
                            style: Theme.of(context).textTheme.labelSmall
                                ?.copyWith(
                                  color: accent,
                                  fontWeight: FontWeight.w700,
                                ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Color(0xFF22C55E),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Online',
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Nova conversa',
                onPressed: () => _novaConversa(),
                icon: const Icon(Icons.add_comment_outlined),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            controller: _scroll,
            padding: const EdgeInsets.fromLTRB(
              PulsoTokens.space4,
              PulsoTokens.space2,
              PulsoTokens.space4,
              PulsoTokens.space3,
            ),
            itemCount: _mensagens.length + (_sending ? 1 : 0),
            itemBuilder: (context, index) {
              if (_sending && index == _mensagens.length) {
                return Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: scheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Text('…'),
                  ),
                );
              }
              final msg = _mensagens[index];
              final mine = msg.role == 'user';
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  mainAxisAlignment: mine
                      ? MainAxisAlignment.end
                      : MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (!mine) ...[
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: accent,
                        child: const Icon(
                          Icons.smart_toy_outlined,
                          size: 16,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 8),
                    ],
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                        decoration: BoxDecoration(
                          color: mine
                              ? accent.withValues(alpha: 0.16)
                              : scheme.surfaceContainerHighest,
                          border: Border.all(
                            color: mine
                                ? accent.withValues(alpha: 0.45)
                                : scheme.outline.withValues(alpha: 0.5),
                          ),
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(16),
                            topRight: const Radius.circular(16),
                            bottomLeft: Radius.circular(mine ? 16 : 4),
                            bottomRight: Radius.circular(mine ? 4 : 16),
                          ),
                        ),
                        child: Text(msg.content),
                      ),
                    ),
                    if (mine) ...[
                      const SizedBox(width: 8),
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: accent.withValues(alpha: 0.2),
                        foregroundColor: accent,
                        backgroundImage: (user?.urlAvatar ?? '').isNotEmpty
                            ? NetworkImage(user!.urlAvatar!)
                            : null,
                        child: (user?.urlAvatar ?? '').isEmpty
                            ? Text(
                                initial,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                ),
                              )
                            : null,
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ),
        if (_proposta != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space4),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(PulsoTokens.space3),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: accent.withValues(alpha: 0.45)),
                color: accent.withValues(alpha: 0.08),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Confirmar ${_proposta!.tipo} · R\$ ${_proposta!.valor.toStringAsFixed(2).replaceAll('.', ',')}',
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  if ((_proposta!.descricao ?? '').isNotEmpty)
                    Text(_proposta!.descricao!),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () => setState(() => _proposta = null),
                        child: const Text('Descartar'),
                      ),
                      FilledButton(
                        onPressed: _sending ? null : _confirmar,
                        child: const Text('Confirmar'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(
            PulsoTokens.space4,
            PulsoTokens.space2,
            PulsoTokens.space4,
            PulsoTokens.space2,
          ),
          child: Row(
            children: [
              for (final s in _sugestoes) ...[
                ActionChip(
                  avatar: Icon(_chipIcon(s.icon), size: 16),
                  label: Text(s.label),
                  onPressed: _sending ? null : () => _enviar(s.label),
                ),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ),
        SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(
              PulsoTokens.space4,
              0,
              PulsoTokens.space4,
              PulsoTokens.space3,
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _draft,
                    enabled: !_sending,
                    textInputAction: TextInputAction.send,
                    onSubmitted: _enviar,
                    decoration: const InputDecoration(
                      hintText: 'Pergunte ao Pulso...',
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _sending ? null : () => _enviar(_draft.text),
                  style: FilledButton.styleFrom(
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(14),
                  ),
                  child: const Icon(Icons.send, size: 18),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
