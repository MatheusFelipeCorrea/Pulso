import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class TransactionTile extends StatelessWidget {
  const TransactionTile({
    super.key,
    required this.transacao,
    required this.onEdit,
    required this.onDelete,
  });

  final PulsoTransacao transacao;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final isReceita = transacao.tipo == 'RECEITA';
    final isTransferencia = transacao.tipo == 'TRANSFERENCIA';
    final color = isTransferencia
        ? PulsoColors.infoOf(brightness)
        : (parseHexColor(transacao.categoria?.cor) ??
              PulsoColors.accent(brightness));
    final amountColor = isTransferencia
        ? PulsoColors.infoOf(brightness)
        : (isReceita
              ? PulsoColors.successOf(brightness)
              : PulsoColors.dangerOf(brightness));
    final title = transacao.descricao?.trim().isNotEmpty == true
        ? transacao.descricao!.trim()
        : (isTransferencia
              ? '${recursoLabel(transacao.recurso)} → ${recursoLabel(transacao.recursoDestino ?? '')}'
              : (transacao.categoria?.nome ?? 'Transação'));
    final prefix = isTransferencia ? '' : (isReceita ? '+' : '-');
    final recursoKind = badgeKindFromRecurso(transacao.recurso);
    final amountText = '$prefix${formatBrl(transacao.valor)}';
    final semanticsAmount = isTransferencia
        ? 'Transferência ${formatBrl(transacao.valor)}'
        : (isReceita
              ? 'Receita ${formatBrl(transacao.valor)}'
              : 'Despesa ${formatBrl(transacao.valor)}');

    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space2),
      child: PulsoSurface(
        padding: const EdgeInsets.symmetric(
          horizontal: PulsoTokens.space3,
          vertical: PulsoTokens.space3,
        ),
        onTap: onEdit,
        child: Row(
          children: [
            CategoryGlyph(
              icone: isTransferencia
                  ? 'ArrowLeftRight'
                  : transacao.categoria?.icone,
              color: color,
            ),
            const SizedBox(width: PulsoTokens.space3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      if (recursoKind != null)
                        PulsoBadge.kind(
                          kind: recursoKind,
                          brightness: brightness,
                          compact: true,
                        ),
                      if (transacao.categoria?.nome != null &&
                          transacao.descricao?.trim().isNotEmpty == true)
                        Text(
                          transacao.categoria!.nome,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      if (transacao.isRecorrenteSerie)
                        PulsoBadge.kind(
                          kind: PulsoBadgeKind.transacaoRecorrente,
                          brightness: brightness,
                          compact: true,
                        ),
                      ...transacao.tags.map(
                        (tag) => PulsoBadge.custom(
                          label: tag.nome,
                          icon: iconFromLucide(tag.icone ?? 'Tag'),
                          color:
                              parseHexColor(tag.cor) ??
                              PulsoColors.infoOf(brightness),
                          compact: true,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: PulsoTokens.space2),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Semantics(
                  label: semanticsAmount,
                  child: Text(
                    amountText,
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: amountColor,
                      fontWeight: PulsoTokens.weightBold,
                    ),
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    PulsoIconButton(
                      tooltip: 'Editar transação',
                      onPressed: onEdit,
                      icon: Icons.edit_outlined,
                    ),
                    PulsoIconButton(
                      tooltip: 'Excluir transação',
                      onPressed: onDelete,
                      icon: Icons.delete_outline,
                      danger: true,
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
