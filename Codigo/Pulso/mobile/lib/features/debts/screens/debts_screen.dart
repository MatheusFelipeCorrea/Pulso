import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/debts/data/debt_models.dart';
import 'package:pulso/features/debts/data/debt_repository.dart';
import 'package:pulso/features/debts/state/debts_controller.dart';
import 'package:pulso/features/debts/utils/debt_status.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class DebtsScreen extends StatefulWidget {
  const DebtsScreen({super.key});

  @override
  State<DebtsScreen> createState() => _DebtsScreenState();
}

class _DebtsScreenState extends State<DebtsScreen> {
  String _aba = 'ME_DEVEM';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<DebtsController>().reload();
    });
  }

  List<PulsoDivida> _visiveis(List<PulsoDivida> dividas) {
    if (_aba == 'QUITADAS')
      return dividas.where((item) => item.quitada).toList();
    return dividas
        .where((item) => !item.quitada && item.direcao == _aba)
        .toList();
  }

  Future<void> _pagar(PulsoDivida divida) async {
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Registrar pagamento'),
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
    if (ok != true || valor == null || !mounted) return;
    try {
      await context.read<DebtRepository>().registrarPagamento(
        divida.id,
        valor: valor,
      );
      if (!mounted) return;
      showPulsoSnack(context, 'Pagamento registrado');
      await context.read<DebtsController>().reload();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _acao(PulsoDivida divida, String tipo) async {
    final repo = context.read<DebtRepository>();
    try {
      if (tipo == 'quitar') await repo.quitar(divida.id);
      if (tipo == 'reabrir') await repo.reabrir(divida.id);
      if (tipo == 'excluir') {
        final ok = await showPulsoConfirm(
          context: context,
          title: 'Excluir dívida',
          message: 'Excluir o lançamento de ${divida.nomePessoa}?',
        );
        if (ok != true) return;
        await repo.excluir(divida.id);
      }
      if (!mounted) return;
      showPulsoSnack(context, 'Dívida atualizada');
      await context.read<DebtsController>().reload();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _detalhe(PulsoDivida divida) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: PulsoTokens.space4,
            right: PulsoTokens.space4,
            bottom: MediaQuery.paddingOf(context).bottom + PulsoTokens.space4,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                divida.nomePessoa,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text('Total ${formatBrl(divida.valor)}'),
              Text('Pago ${formatBrl(divida.valorPago)}'),
              Text('Restante ${formatBrl(divida.valorRestante)}'),
              if (divida.prazoDevolucao != null)
                Text(
                  'Prazo ${divida.prazoDevolucao!.day.toString().padLeft(2, '0')}/${divida.prazoDevolucao!.month.toString().padLeft(2, '0')}/${divida.prazoDevolucao!.year}',
                ),
              if ((divida.observacao ?? '').trim().isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(divida.observacao!),
              ],
              const SizedBox(height: 12),
              Text(
                'Pagamentos',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              if (divida.pagamentos.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text('Nenhum pagamento registrado.'),
                )
              else
                ...divida.pagamentos.map(
                  (p) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(formatBrl(p.valor)),
                    subtitle: Text(
                      p.data == null
                          ? '—'
                          : '${p.data!.day.toString().padLeft(2, '0')}/${p.data!.month.toString().padLeft(2, '0')}/${p.data!.year}',
                    ),
                    trailing: IconButton(
                      tooltip: 'Excluir pagamento',
                      onPressed: () async {
                        try {
                          await context.read<DebtRepository>().excluirPagamento(
                            divida.id,
                            p.id,
                          );
                          if (!context.mounted) return;
                          Navigator.pop(context);
                          showPulsoSnack(context, 'Pagamento removido');
                          await context.read<DebtsController>().reload();
                        } on ApiException catch (error) {
                          if (!context.mounted) return;
                          showPulsoSnack(context, error.message);
                        }
                      },
                      icon: const Icon(Icons.delete_outline),
                    ),
                  ),
                ),
              const SizedBox(height: 8),
              FilledButton.tonal(
                onPressed: () {
                  Navigator.pop(context);
                  context.push('/debts/new', extra: divida);
                },
                child: const Text('Editar dívida'),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<DebtsController>();
    final brightness = Theme.of(context).brightness;
    final visiveis = _visiveis(controller.dividas);

    return RefreshIndicator(
      onRefresh: controller.reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(
          PulsoTokens.space4,
          PulsoTokens.space2,
          PulsoTokens.space4,
          96,
        ),
        children: [
          const PulsoPageHeader(
            title: 'Dívidas pessoais',
            subtitle: 'Acompanhe o que você deve e o que ainda falta receber.',
            icon: Icons.handshake_outlined,
          ),
          Row(
            children: [
              Expanded(
                child: _ResumoCard(
                  label: 'Me devem',
                  valor: formatBrl(controller.resumo.meDevem.total),
                  detalhe: '${controller.resumo.meDevem.quantidade} em aberto',
                  icon: Icons.call_received,
                  color: PulsoColors.successOf(brightness),
                ),
              ),
              const SizedBox(width: PulsoTokens.space3),
              Expanded(
                child: _ResumoCard(
                  label: 'Eu devo',
                  valor: formatBrl(controller.resumo.euDevo.total),
                  detalhe: '${controller.resumo.euDevo.quantidade} em aberto',
                  icon: Icons.call_made,
                  color: PulsoColors.dangerOf(brightness),
                ),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space4),
          Wrap(
            spacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Me devem'),
                selected: _aba == 'ME_DEVEM',
                onSelected: (_) => setState(() => _aba = 'ME_DEVEM'),
              ),
              ChoiceChip(
                label: const Text('Eu devo'),
                selected: _aba == 'EU_DEVO',
                onSelected: (_) => setState(() => _aba = 'EU_DEVO'),
              ),
              ChoiceChip(
                label: const Text('Quitadas'),
                selected: _aba == 'QUITADAS',
                onSelected: (_) => setState(() => _aba = 'QUITADAS'),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space4),
          if (controller.loading && controller.dividas.isEmpty)
            const Center(child: CircularProgressIndicator())
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Dívidas indisponíveis',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.reload,
            )
          else if (visiveis.isEmpty)
            const PulsoEmptyState(
              title: 'Nada por aqui',
              description: 'Registre um empréstimo para acompanhar o saldo.',
            )
          else
            ...visiveis.map(
              (divida) => _DebtCard(
                divida: divida,
                onOpen: () => _detalhe(divida),
                onEdit: () => context.push('/debts/new', extra: divida),
                onPay: divida.quitada ? null : () => _pagar(divida),
                onSettle: divida.quitada ? null : () => _acao(divida, 'quitar'),
                onReopen: divida.quitada
                    ? () => _acao(divida, 'reabrir')
                    : null,
                onDelete: () => _acao(divida, 'excluir'),
              ),
            ),
        ],
      ),
    );
  }
}

class _ResumoCard extends StatelessWidget {
  const _ResumoCard({
    required this.label,
    required this.valor,
    required this.detalhe,
    required this.icon,
    required this.color,
  });

  final String label;
  final String valor;
  final String detalhe;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PulsoSoftIcon(icon: icon, color: color, size: 36),
          const SizedBox(height: 8),
          Text(label, style: Theme.of(context).textTheme.labelMedium),
          Text(valor, style: Theme.of(context).textTheme.titleMedium),
          Text(detalhe, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _DebtCard extends StatelessWidget {
  const _DebtCard({
    required this.divida,
    required this.onDelete,
    required this.onOpen,
    required this.onEdit,
    this.onPay,
    this.onSettle,
    this.onReopen,
  });

  final PulsoDivida divida;
  final VoidCallback onDelete;
  final VoidCallback onOpen;
  final VoidCallback onEdit;
  final VoidCallback? onPay;
  final VoidCallback? onSettle;
  final VoidCallback? onReopen;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final status = debtStatusVisual(
      quitada: divida.quitada,
      dataQuitacao: divida.dataQuitacao,
      prazoDevolucao: divida.prazoDevolucao,
      valorPago: divida.valorPago,
      valorRestante: divida.valorRestante,
      valorTotal: divida.valor,
    );
    final color = switch (status.tone) {
      'success' => PulsoColors.successOf(brightness),
      'warning' => PulsoColors.warningOf(brightness),
      'danger' => PulsoColors.dangerOf(brightness),
      _ => PulsoColors.secondaryText(brightness),
    };
    final direcao = debtDirecaoLabel(divida.direcao);

    return PulsoSurface(
      margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
      onTap: onOpen,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  divida.nomePessoa,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              Text(
                formatBrl(divida.valorRestante),
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              PulsoBadge.custom(
                label: direcao,
                icon: divida.direcao == 'ME_DEVEM'
                    ? Icons.call_received
                    : Icons.call_made,
                color: PulsoColors.accent(brightness),
                compact: true,
              ),
              PulsoBadge.custom(
                label: status.label,
                icon: status.icon,
                color: color,
                compact: true,
              ),
            ],
          ),
          if ((divida.observacao ?? '').trim().isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              divida.observacao!,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
          Row(
            children: [
              if (onPay != null)
                TextButton(onPressed: onPay, child: const Text('Pagar')),
              if (onSettle != null)
                TextButton(onPressed: onSettle, child: const Text('Quitar')),
              if (onReopen != null)
                TextButton(onPressed: onReopen, child: const Text('Reabrir')),
              const Spacer(),
              IconButton(
                tooltip: 'Editar',
                onPressed: onEdit,
                icon: const Icon(Icons.edit_outlined),
              ),
              IconButton(
                tooltip: 'Excluir',
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
