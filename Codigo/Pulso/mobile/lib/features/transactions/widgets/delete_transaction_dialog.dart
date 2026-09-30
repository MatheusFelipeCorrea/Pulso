import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';

Future<({bool excluirFuturas})?> showDeleteTransactionDialog({
  required BuildContext context,
  required PulsoTransacao transacao,
}) {
  final label = transacao.descricao?.trim().isNotEmpty == true
      ? transacao.descricao!.trim()
      : (transacao.categoria?.nome ?? 'esta transação');

  if (transacao.isRecorrenteSerie) {
    return showDialog<({bool excluirFuturas})>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Excluir transação'),
          content: Text(
            'A transação "$label" faz parte de uma série recorrente. '
            'Escolha se deseja excluir só esta ocorrência ou encerrar a série a partir desta data. '
            'O histórico anterior será mantido.',
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
            OutlinedButton(
              onPressed: () => Navigator.pop(context, (excluirFuturas: false)),
              child: const Text('Excluir só esta'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
                foregroundColor: Colors.white,
                minimumSize: const Size(0, PulsoTokens.buttonMd),
              ),
              onPressed: () => Navigator.pop(context, (excluirFuturas: true)),
              child: const Text('Excluir esta e futuras'),
            ),
          ],
        );
      },
    );
  }

  return showPulsoConfirm(
    context: context,
    title: 'Excluir transação',
    message: 'A transação "$label" será excluída permanentemente.',
  ).then((ok) => ok == true ? (excluirFuturas: false) : null);
}
