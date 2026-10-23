import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
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
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _grupo = widget.inicial;
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    setState(() {
      _loading = _grupo == null;
      _error = null;
    });
    try {
      final grupo = await context.read<GroupRepository>().obter(widget.grupoId);
      if (!mounted) return;
      setState(() => _grupo = grupo);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final grupo = _grupo;
    return PulsoFormScaffold(
      title: grupo?.nome ?? 'Grupo',
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
      PulsoPageHeader(
        title: grupo.nome,
        subtitle: (grupo.descricao ?? '').trim().isEmpty
            ? 'Membros, metas e a viagem compartilhada deste grupo.'
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
          trailing: PulsoBadge.custom(
            label: papelMembro.label,
            icon: papelMembro.icon,
            color: papelMembro.admin
                ? PulsoColors.accent(brightness)
                : PulsoColors.infoOf(brightness),
            compact: true,
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
      if (meta != null) ...[
        const SizedBox(height: PulsoTokens.space4),
        const PulsoSectionHeader(title: 'Meta do grupo', icon: Icons.gps_fixed),
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
            ],
          ),
        ),
      ],
    ];
  }
}
