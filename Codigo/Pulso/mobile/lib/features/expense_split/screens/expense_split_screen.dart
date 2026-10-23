import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/api/api_exception.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/expense_split/data/split_models.dart';
import 'package:pulso/features/expense_split/data/split_repository.dart';
import 'package:pulso/features/expense_split/state/split_controller.dart';
import 'package:pulso/features/expense_split/utils/split_labels.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';

class ExpenseSplitScreen extends StatefulWidget {
  const ExpenseSplitScreen({super.key});

  @override
  State<ExpenseSplitScreen> createState() => _ExpenseSplitScreenState();
}

class _ExpenseSplitScreenState extends State<ExpenseSplitScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<ExpenseSplitController>().reload();
    });
  }

  Future<void> _pagar(PulsoDivisao divisao, SplitParticipante pessoa) async {
    try {
      await context.read<ExpenseSplitRepository>().marcarPago(
        divisao.id,
        pessoa.id,
      );
      if (!mounted) return;
      showPulsoSnack(context, '${pessoa.nome} marcado como pago');
      await context.read<ExpenseSplitController>().reload();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  Future<void> _excluir(PulsoDivisao divisao) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Excluir divisão',
      message: 'Excluir “${divisao.titulo}”?',
    );
    if (ok != true || !mounted) return;
    try {
      await context.read<ExpenseSplitRepository>().excluir(divisao.id);
      if (!mounted) return;
      showPulsoSnack(context, 'Divisão excluída');
      await context.read<ExpenseSplitController>().reload();
    } on ApiException catch (error) {
      if (!mounted) return;
      showPulsoSnack(context, error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<ExpenseSplitController>();
    final brightness = Theme.of(context).brightness;
    final resumo = controller.resumo;

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
            title: 'Divisão de despesas',
            subtitle:
                'Divida uma conta, marque quem já pagou e acompanhe o saldo.',
            icon: Icons.groups_2_outlined,
          ),
          Row(
            children: [
              Expanded(
                child: _Mini(
                  label: 'Me devem',
                  value: formatBrl(resumo.meDevem),
                  icon: Icons.call_received,
                  color: PulsoColors.successOf(brightness),
                ),
              ),
              const SizedBox(width: PulsoTokens.space2),
              Expanded(
                child: _Mini(
                  label: 'Eu devo',
                  value: formatBrl(resumo.euDevo),
                  icon: Icons.call_made,
                  color: PulsoColors.dangerOf(brightness),
                ),
              ),
              const SizedBox(width: PulsoTokens.space2),
              Expanded(
                child: _Mini(
                  label: 'Saldo',
                  value: formatBrl(resumo.saldo),
                  icon: Icons.account_balance_wallet_outlined,
                  color: PulsoColors.accent(brightness),
                ),
              ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space5),
          if (controller.loading &&
              controller.ativas.isEmpty &&
              controller.historico.isEmpty)
            const Center(child: CircularProgressIndicator())
          else if (controller.error != null)
            PulsoEmptyState(
              title: 'Divisões indisponíveis',
              description: controller.error!,
              actionLabel: 'Tentar de novo',
              onAction: controller.reload,
            )
          else if (!resumo.possuiDivisoes &&
              controller.ativas.isEmpty &&
              controller.historico.isEmpty)
            PulsoEmptyState(
              title: 'Nenhuma divisão',
              description: 'Crie a primeira conta compartilhada.',
              actionLabel: 'Nova divisão',
              onAction: () => context.push('/expense-split/new'),
            )
          else ...[
            const PulsoSectionHeader(title: 'Em aberto', icon: Icons.timelapse),
            if (controller.ativas.isEmpty)
              Text(
                'Nenhuma divisão ativa.',
                style: Theme.of(context).textTheme.bodySmall,
              )
            else
              ...controller.ativas.map(
                (item) => _SplitCard(
                  divisao: item,
                  onPay: _pagar,
                  onDelete: () => _excluir(item),
                ),
              ),
            const SizedBox(height: PulsoTokens.space4),
            const PulsoSectionHeader(title: 'Histórico', icon: Icons.history),
            if (controller.historico.isEmpty)
              Text(
                'O histórico ainda está vazio.',
                style: Theme.of(context).textTheme.bodySmall,
              )
            else
              ...controller.historico.map(
                (item) => _SplitCard(
                  divisao: item,
                  onPay: item.quitada ? null : _pagar,
                  onDelete: () => _excluir(item),
                ),
              ),
          ],
        ],
      ),
    );
  }
}

class _Mini extends StatelessWidget {
  const _Mini({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  final String label;
  final String value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return PulsoSurface(
      padding: const EdgeInsets.all(PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(height: 6),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
          Text(value, style: Theme.of(context).textTheme.titleSmall),
        ],
      ),
    );
  }
}

class _SplitCard extends StatelessWidget {
  const _SplitCard({required this.divisao, required this.onDelete, this.onPay});

  final PulsoDivisao divisao;
  final VoidCallback onDelete;
  final void Function(PulsoDivisao divisao, SplitParticipante pessoa)? onPay;

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final status = splitStatusVisual(divisao.status);
    final statusColor = status.tone == 'success'
        ? PulsoColors.successOf(brightness)
        : PulsoColors.warningOf(brightness);

    return PulsoSurface(
      margin: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PulsoSoftIcon(
                icon: Icons.receipt_long_outlined,
                color: PulsoColors.accent(brightness),
                size: 36,
              ),
              const SizedBox(width: PulsoTokens.space3),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      divisao.titulo,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Text(
                      formatBrl(divisao.valorTotal),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Excluir',
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              PulsoBadge.custom(
                label: status.label,
                icon: status.icon,
                color: statusColor,
                compact: true,
              ),
              PulsoBadge.custom(
                label: splitTipoLabel(divisao.tipo),
                icon: Icons.pie_chart_outline,
                color: PulsoColors.infoOf(brightness),
                compact: true,
              ),
              if (divisao.pendentes > 0)
                PulsoBadge.custom(
                  label:
                      '${divisao.pendentes} pendente${divisao.pendentes == 1 ? '' : 's'}',
                  icon: Icons.schedule,
                  color: PulsoColors.orangeOf(brightness),
                  compact: true,
                ),
            ],
          ),
          const SizedBox(height: PulsoTokens.space3),
          ...divisao.participantes.map((pessoa) {
            final pessoaStatus = participanteStatusVisual(pessoa.status);
            final cor = pessoa.pago
                ? PulsoColors.successOf(brightness)
                : PulsoColors.warningOf(brightness);
            return ListTile(
              contentPadding: EdgeInsets.zero,
              dense: true,
              title: Text(pessoa.nome),
              subtitle: Text(formatBrl(pessoa.valor)),
              trailing: pessoa.pago || onPay == null
                  ? PulsoBadge.custom(
                      label: pessoaStatus.label,
                      icon: pessoaStatus.icon,
                      color: cor,
                      compact: true,
                    )
                  : TextButton(
                      onPressed: () => onPay!(divisao, pessoa),
                      child: const Text('Marcar pago'),
                    ),
            );
          }),
        ],
      ),
    );
  }
}
