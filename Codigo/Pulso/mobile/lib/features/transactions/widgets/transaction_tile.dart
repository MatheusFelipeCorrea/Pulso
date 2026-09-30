import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/widgets/category_icon.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
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
    final isReceita = transacao.tipo == 'RECEITA';
    final isTransferencia = transacao.tipo == 'TRANSFERENCIA';
    final color = isTransferencia
        ? const Color(0xFF3B82F6)
        : (parseHexColor(transacao.categoria?.cor) ?? PulsoColors.primary);
    final amountColor = isTransferencia
        ? const Color(0xFF3B82F6)
        : (isReceita ? PulsoColors.success : PulsoColors.danger);
    final title = transacao.descricao?.trim().isNotEmpty == true
        ? transacao.descricao!.trim()
        : (isTransferencia
            ? '${recursoLabel(transacao.recurso)} → ${recursoLabel(transacao.recursoDestino ?? '')}'
            : (transacao.categoria?.nome ?? 'Transação'));
    final prefix = isTransferencia ? '' : (isReceita ? '+' : '-');
    final recurso = badgeFromRecurso(transacao.recurso);

    return ListTile(
      onTap: onEdit,
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: isTransferencia
          ? CategoryGlyph(icone: 'ArrowLeftRight', color: color)
          : CategoryGlyph(icone: transacao.categoria?.icone, color: color),
      title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Wrap(
          spacing: 6,
          runSpacing: 4,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            if (recurso != null) PulsoBadge(style: recurso, compact: true),
            if (transacao.isRecorrenteSerie)
              PulsoBadge(
                style: const PulsoBadgeStyle(
                  label: 'Recorrente',
                  icon: Icons.autorenew,
                  color: Color(0xFF3B82F6),
                ),
                compact: true,
              ),
          ],
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$prefix${formatBrl(transacao.valor)}',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: amountColor,
                  fontWeight: FontWeight.w700,
                ),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'edit') onEdit();
              if (value == 'delete') onDelete();
            },
            itemBuilder: (_) => const [
              PopupMenuItem(value: 'edit', child: Text('Editar')),
              PopupMenuItem(value: 'delete', child: Text('Excluir')),
            ],
          ),
        ],
      ),
    );
  }
}
