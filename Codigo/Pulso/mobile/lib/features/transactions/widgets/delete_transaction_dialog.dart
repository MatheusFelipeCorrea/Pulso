import 'package:flutter/material.dart';
import 'package:pulso/features/transactions/data/transaction_models.dart';

Future<({bool excluirFuturas})?> showDeleteTransactionDialog({
  required BuildContext context,
  required PulsoTransacao transacao,
}) {
  final label = transacao.descricao?.trim().isNotEmpty == true
      ? transacao.descricao!.trim()
      : (transacao.categoria?.nome ?? 'esta transação');

  if (transacao.isRecorrenteSerie) {
    return showModalBottomSheet<({bool excluirFuturas})>(
      context: context,
      showDragHandle: true,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Excluir transação', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Text(
                'A transação "$label" faz parte de uma série recorrente. '
                'Escolha se deseja excluir só esta ocorrência ou encerrar a série a partir desta data. '
                'O histórico anterior será mantido.',
              ),
              const SizedBox(height: 20),
              OutlinedButton(
                onPressed: () => Navigator.pop(context, (excluirFuturas: false)),
                child: const Text('Excluir só esta'),
              ),
              const SizedBox(height: 8),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
                onPressed: () => Navigator.pop(context, (excluirFuturas: true)),
                child: const Text('Excluir esta e futuras'),
              ),
            ],
          ),
        );
      },
    );
  }

  return showDialog<({bool excluirFuturas})>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Excluir transação'),
      content: Text('A transação "$label" será excluída permanentemente.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
          onPressed: () => Navigator.pop(context, (excluirFuturas: false)),
          child: const Text('Excluir'),
        ),
      ],
    ),
  );
}
