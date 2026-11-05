import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/groups/data/group_chat_socket.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/data/group_repository.dart';
import 'package:pulso/features/groups/utils/group_labels.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class GroupDetailScreen extends StatefulWidget {
  const GroupDetailScreen({super.key, required this.grupoId, this.inicial});

  final String grupoId;
  final PulsoGrupo? inicial;

  @override
  State<GroupDetailScreen> createState() => _GroupDetailScreenState();
}

class _GroupDetailScreenState extends State<GroupDetailScreen> {
  PulsoGrupo? _grupo;
  List<PulsoGrupoMensagem> _mensagens = const [];
  final _chatCtrl = TextEditingController();
  bool _loading = true;
  bool _sending = false;
  String? _error;
  void Function()? _offSocket;

  GroupRepository get _repo => context.read<GroupRepository>();

  @override
  void initState() {
    super.initState();
    _grupo = widget.inicial;
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _load();
      await _bindSocket();
    });
  }

  @override
  void dispose() {
    _offSocket?.call();
    _chatCtrl.dispose();
    super.dispose();
  }

  Future<void> _bindSocket() async {
    final chat = context.read<GroupChatSocket>();
    await chat.joinGrupo(widget.grupoId);
    _offSocket = await chat.onMensagem((payload) {
      if (payload['grupoId'] != null &&
          payload['grupoId'].toString() != widget.grupoId) {
        return;
      }
      final raw = payload['mensagem'];
      if (raw is! Map) return;
      final msg = PulsoGrupoMensagem.fromJson(Map<String, dynamic>.from(raw));
      if (!mounted) return;
      if (_mensagens.any((item) => item.id == msg.id && msg.id.isNotEmpty)) {
        return;
      }
      setState(() => _mensagens = [..._mensagens, msg]);
    });
  }

  Future<void> _load() async {
    setState(() {
      _loading = _grupo == null;
      _error = null;
    });
    try {
      final grupo = await _repo.obter(widget.grupoId);
      final msgs = await _repo.listarMensagens(widget.grupoId);
      if (!mounted) return;
      setState(() {
        _grupo = grupo;
        _mensagens = msgs;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _alterarImagem() async {
    final grupo = _grupo;
    if (grupo == null || !grupo.isAdmin) return;
    final urlCtrl = TextEditingController(text: grupo.urlImagem ?? '');
    final escolha = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Foto do grupo'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: urlCtrl,
              decoration: const InputDecoration(
                labelText: 'URL da imagem (opcional)',
              ),
            ),
            const SizedBox(height: PulsoTokens.space3),
            const Text('Ou envie um arquivo da galeria.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, 'cancel'),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, 'restore'),
            child: const Text('Usar da viagem'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, 'url'),
            child: const Text('Salvar URL'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, 'file'),
            child: const Text('Arquivo'),
          ),
        ],
      ),
    );
    final url = urlCtrl.text.trim();
    urlCtrl.dispose();
    if (escolha == null || escolha == 'cancel' || !mounted) return;
    try {
      late final PulsoGrupo atualizado;
      if (escolha == 'file') {
        final picked = await FilePicker.pickFiles(
          type: FileType.image,
          withData: true,
        );
        final file = picked?.files.single;
        final bytes = file?.bytes;
        if (bytes == null) return;
        atualizado = await _repo.enviarImagem(
          grupo.id,
          MultipartFile.fromBytes(
            bytes,
            filename: file!.name.isEmpty ? 'grupo.jpg' : file.name,
          ),
        );
      } else if (escolha == 'restore') {
        atualizado = await _repo.editar(grupo.id, limparUrlImagem: true);
      } else {
        atualizado = await _repo.editar(
          grupo.id,
          urlImagem: url.isEmpty ? null : url,
          limparUrlImagem: url.isEmpty,
        );
      }
      if (!mounted) return;
      setState(() => _grupo = atualizado);
      showPulsoSnack(context, 'Foto do grupo atualizada');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _editarGrupo() async {
    final grupo = _grupo;
    if (grupo == null || !grupo.isAdmin) return;
    final nome = TextEditingController(text: grupo.nome);
    final desc = TextEditingController(text: grupo.descricao ?? '');
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Editar grupo'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nome,
              decoration: const InputDecoration(labelText: 'Nome'),
            ),
            const SizedBox(height: PulsoTokens.space3),
            TextField(
              controller: desc,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Descrição'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
    final nomeTxt = nome.text.trim();
    final descTxt = desc.text.trim();
    nome.dispose();
    desc.dispose();
    if (ok != true || nomeTxt.isEmpty || !mounted) return;
    try {
      final atualizado = await _repo.editar(
        grupo.id,
        nome: nomeTxt,
        descricao: descTxt,
      );
      if (!mounted) return;
      setState(() => _grupo = atualizado);
      showPulsoSnack(context, 'Grupo atualizado');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _renovarCodigo() async {
    final grupo = _grupo;
    if (grupo == null || !grupo.isAdmin) return;
    try {
      final atualizado = await _repo.renovarCodigo(grupo.id);
      if (!mounted) return;
      setState(() => _grupo = atualizado);
      showPulsoSnack(context, 'Código renovado');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _removerMembro(PulsoGrupoMembro membro) async {
    final grupo = _grupo;
    if (grupo == null || !grupo.isAdmin || membro.souEu) return;
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Remover membro',
      message: 'Remover ${membro.nome} do grupo?',
    );
    if (ok != true || !mounted) return;
    try {
      await _repo.removerMembro(grupo.id, membro.id);
      if (!mounted) return;
      showPulsoSnack(context, 'Membro removido');
      await _load();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _aporte() async {
    final grupo = _grupo;
    final meta = grupo?.meta;
    if (grupo == null || meta?.id == null) {
      showPulsoSnack(context, 'Este grupo ainda não tem meta com aporte');
      return;
    }
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Registrar aporte'),
        content: TextField(
          controller: ctrl,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: const InputDecoration(labelText: 'Valor (R\$)'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
    final valor = parseMoney(ctrl.text);
    ctrl.dispose();
    if (ok != true || valor == null || valor <= 0 || !mounted) return;
    try {
      final atualizado = await _repo.registrarAporte(
        grupo.id,
        meta!.id!,
        valor: valor,
      );
      if (!mounted) return;
      setState(() => _grupo = atualizado);
      showPulsoSnack(context, 'Aporte registrado');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _criarMeta() async {
    final grupo = _grupo;
    if (grupo == null || !grupo.isAdmin) return;
    final nome = TextEditingController();
    final alvo = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nova meta do grupo'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nome,
              decoration: const InputDecoration(labelText: 'Nome'),
            ),
            const SizedBox(height: PulsoTokens.space3),
            TextField(
              controller: alvo,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: const InputDecoration(labelText: 'Valor alvo (R\$)'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Criar'),
          ),
        ],
      ),
    );
    final nomeTxt = nome.text.trim();
    final valor = parseMoney(alvo.text);
    nome.dispose();
    alvo.dispose();
    if (ok != true || nomeTxt.isEmpty || valor == null || !mounted) return;
    try {
      final atualizado = await _repo.criarMetas(grupo.id, [
        {'nome': nomeTxt, 'valorAlvo': valor},
      ]);
      if (!mounted) return;
      setState(() => _grupo = atualizado);
      showPulsoSnack(context, 'Meta criada');
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _enviarMensagem() async {
    final texto = _chatCtrl.text.trim();
    if (texto.isEmpty || _sending) return;
    setState(() => _sending = true);
    try {
      final msg = await _repo.enviarMensagem(widget.grupoId, texto: texto);
      if (!mounted) return;
      setState(() {
        _mensagens = [..._mensagens, msg];
        _chatCtrl.clear();
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final grupo = _grupo;
    return PulsoFormScaffold(
      title: grupo?.nome ?? 'Grupo',
      actions: [
        if (grupo?.isAdmin == true) ...[
          IconButton(
            tooltip: 'Foto',
            onPressed: _alterarImagem,
            icon: const Icon(Icons.image_outlined),
          ),
          IconButton(
            tooltip: 'Editar',
            onPressed: _editarGrupo,
            icon: const Icon(Icons.edit_outlined),
          ),
        ],
      ],
      child: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(PulsoTokens.space4),
          children: [
            if (_loading && grupo == null)
              const Padding(
                padding: EdgeInsets.only(top: PulsoTokens.space8),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_error != null && grupo == null)
              PulsoEmptyState(
                title: 'Não foi possível abrir o grupo',
                description: _error!,
                actionLabel: 'Tentar de novo',
                onAction: _load,
              )
            else if (grupo != null)
              ..._body(context, grupo),
          ],
        ),
      ),
    );
  }

  List<Widget> _body(BuildContext context, PulsoGrupo grupo) {
    final brightness = Theme.of(context).brightness;
    final papel = groupPapelVisual(grupo.meuPapel);
    final meta = grupo.meta;
    final viagem = grupo.viagem;

    return [
      if ((grupo.capa ?? '').isNotEmpty)
        Padding(
          padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.network(
              grupo.capa!,
              height: 140,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => const SizedBox.shrink(),
            ),
          ),
        ),
      PulsoPageHeader(
        title: grupo.nome,
        subtitle: (grupo.descricao ?? '').trim().isEmpty
            ? 'Membros, metas, chat e a viagem compartilhada.'
            : grupo.descricao,
        icon: Icons.groups_outlined,
        trailing: PulsoBadge.custom(
          label: papel.label,
          icon: papel.icon,
          color: papel.admin
              ? PulsoColors.accent(brightness)
              : PulsoColors.secondaryText(brightness),
        ),
      ),
      if ((grupo.codigoConvite ?? '').isNotEmpty)
        PulsoSurface(
          margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
          child: Row(
            children: [
              const Icon(Icons.vpn_key_outlined),
              const SizedBox(width: PulsoTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Código de convite',
                      style: Theme.of(context).textTheme.labelMedium,
                    ),
                    Text(
                      formatCodigoConvite(grupo.codigoConvite),
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Copiar',
                onPressed: () async {
                  await Clipboard.setData(
                    ClipboardData(text: grupo.codigoConvite!),
                  );
                  if (!context.mounted) return;
                  showPulsoSnack(context, 'Código copiado');
                },
                icon: const Icon(Icons.copy_outlined),
              ),
              if (grupo.isAdmin)
                IconButton(
                  tooltip: 'Renovar',
                  onPressed: _renovarCodigo,
                  icon: const Icon(Icons.refresh),
                ),
            ],
          ),
        ),
      PulsoSectionHeader(
        title: 'Membros',
        icon: Icons.people_outline,
        actionLabel: '${grupo.quantidadeMembros}',
      ),
      ...grupo.pessoas.map((membro) {
        final nome = formatGrupoMembroDisplayNome(
          membro.nome,
          souEu: membro.souEu,
        );
        final papelMembro = groupPapelVisual(membro.papel);
        return ListTile(
          contentPadding: EdgeInsets.zero,
          leading: CircleAvatar(
            backgroundImage: (membro.urlAvatar ?? '').isNotEmpty
                ? NetworkImage(membro.urlAvatar!)
                : null,
            child: (membro.urlAvatar ?? '').isEmpty
                ? Text(nome.isEmpty ? '?' : nome[0].toUpperCase())
                : null,
          ),
          title: Text(nome),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              PulsoBadge.custom(
                label: papelMembro.label,
                icon: papelMembro.icon,
                color: papelMembro.admin
                    ? PulsoColors.accent(brightness)
                    : PulsoColors.infoOf(brightness),
                compact: true,
              ),
              if (grupo.isAdmin && !membro.souEu)
                IconButton(
                  tooltip: 'Remover',
                  onPressed: () => _removerMembro(membro),
                  icon: const Icon(Icons.person_remove_outlined),
                ),
            ],
          ),
        );
      }),
      if (viagem != null) ...[
        const SizedBox(height: PulsoTokens.space4),
        const PulsoSectionHeader(title: 'Viagem', icon: Icons.flight_takeoff),
        PulsoSurface(
          child: Row(
            children: [
              PulsoSoftIcon(
                icon: Icons.flight_takeoff,
                color: PulsoColors.accent(brightness),
              ),
              const SizedBox(width: PulsoTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      viagem.destino,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      '${viagem.moeda ?? 'BRL'} · pretensão ${formatBrl(double.tryParse(viagem.totalGrupo) ?? 0)}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
      const SizedBox(height: PulsoTokens.space4),
      PulsoSectionHeader(
        title: 'Meta do grupo',
        icon: Icons.gps_fixed,
        actionLabel: meta == null && grupo.isAdmin ? 'Criar' : null,
        onAction: meta == null && grupo.isAdmin ? _criarMeta : null,
      ),
      if (meta != null)
        PulsoSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(meta.nome, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: PulsoTokens.space2),
              LinearProgressIndicator(
                value: (meta.percentual.clamp(0, 100)) / 100,
              ),
              const SizedBox(height: PulsoTokens.space2),
              Text(
                '${meta.percentual}% · ${formatBrl(double.tryParse(meta.valorAtual) ?? 0)} de ${formatBrl(double.tryParse(meta.valorAlvo) ?? 0)}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              if (meta.id != null) ...[
                const SizedBox(height: PulsoTokens.space3),
                Align(
                  alignment: Alignment.centerRight,
                  child: FilledButton.tonalIcon(
                    onPressed: _aporte,
                    icon: const Icon(Icons.add),
                    label: const Text('Aporte'),
                  ),
                ),
              ],
            ],
          ),
        )
      else
        PulsoSurface(
          child: Text(
            grupo.isAdmin
                ? 'Ainda sem meta. Crie uma para acompanhar o progresso juntos.'
                : 'Este grupo ainda não tem meta compartilhada.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      const SizedBox(height: PulsoTokens.space4),
      const PulsoSectionHeader(title: 'Chat', icon: Icons.chat_bubble_outline),
      PulsoSurface(
        child: Column(
          children: [
            if (_mensagens.isEmpty)
              const PulsoEmptyState(
                title: 'Nenhuma mensagem ainda',
                description: 'Diga oi para a galera.',
                icon: Icons.chat_bubble_outline,
              )
            else
              ..._mensagens.take(30).map((msg) => _GroupChatBubble(msg: msg)),
            const SizedBox(height: PulsoTokens.space2),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _chatCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Escreva uma mensagem',
                      isDense: true,
                    ),
                    onSubmitted: (_) => _enviarMensagem(),
                  ),
                ),
                IconButton(
                  onPressed: _sending ? null : _enviarMensagem,
                  icon: const Icon(Icons.send),
                ),
              ],
            ),
          ],
        ),
      ),
    ];
  }
}

class _GroupChatBubble extends StatelessWidget {
  const _GroupChatBubble({required this.msg});

  final PulsoGrupoMensagem msg;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final accent = PulsoColors.accent(theme.brightness);
    final mine = msg.souEu;
    final autor = mine
        ? 'Você'
        : (formatGrupoMembroDisplayNome(msg.autorNome).isEmpty
              ? 'Membro'
              : formatGrupoMembroDisplayNome(msg.autorNome));
    final hora = msg.criadoEm == null
        ? null
        : _formatHora(msg.criadoEm!.toLocal());
    final maxWidth = MediaQuery.sizeOf(context).width * 0.72;

    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: maxWidth),
        margin: const EdgeInsets.only(bottom: PulsoTokens.space2),
        padding: const EdgeInsets.symmetric(
          horizontal: PulsoTokens.space3,
          vertical: PulsoTokens.space2,
        ),
        decoration: BoxDecoration(
          color: mine
              ? accent.withValues(alpha: 0.18)
              : scheme.surfaceContainerHighest,
          border: mine
              ? Border.all(color: accent.withValues(alpha: 0.35))
              : null,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(PulsoTokens.radiusXl),
            topRight: const Radius.circular(PulsoTokens.radiusXl),
            bottomLeft: Radius.circular(
              mine ? PulsoTokens.radiusXl : PulsoTokens.radiusSm,
            ),
            bottomRight: Radius.circular(
              mine ? PulsoTokens.radiusSm : PulsoTokens.radiusXl,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: mine
              ? CrossAxisAlignment.end
              : CrossAxisAlignment.start,
          children: [
            Text(
              autor,
              style: theme.textTheme.labelSmall?.copyWith(
                color: mine ? accent : scheme.onSurfaceVariant,
                fontWeight: PulsoTokens.weightSemibold,
              ),
            ),
            const SizedBox(height: 2),
            Text(msg.texto, style: theme.textTheme.bodyMedium),
            if (hora != null) ...[
              const SizedBox(height: 2),
              Text(
                hora,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: scheme.onSurfaceVariant,
                  fontSize: 11,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  static String _formatHora(DateTime d) {
    final h = d.hour.toString().padLeft(2, '0');
    final m = d.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }
}
