import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';

class TripCoverCard extends StatelessWidget {
  const TripCoverCard({
    super.key,
    required this.viagem,
    required this.onOpen,
    this.onEdit,
    this.onDelete,
  });

  final PulsoViagem viagem;
  final VoidCallback onOpen;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onOpen,
          borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
          child: Ink(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
              border: Border.all(color: Theme.of(context).colorScheme.outline),
              boxShadow: PulsoTokens.shadowMd(
                Theme.of(context).brightness == Brightness.dark,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(PulsoTokens.radiusXl),
                  ),
                  child: SizedBox(
                    height: 148,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        _Cover(
                          url: viagem.coverImageUrl,
                          destino: viagem.destino,
                        ),
                        const DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.transparent, Color(0x99000000)],
                            ),
                          ),
                        ),
                        Positioned(
                          left: 14,
                          right: 14,
                          bottom: 12,
                          child: Text(
                            viagem.destino,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w700,
                                ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    PulsoTokens.space4,
                    PulsoTokens.space3,
                    PulsoTokens.space3,
                    PulsoTokens.space3,
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.calendar_today_outlined,
                        size: 14,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        formatDayHeader(viagem.dataPrevista),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(width: PulsoTokens.space3),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: PulsoColors.button.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(
                            PulsoTokens.radiusFull,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CurrencyFlag(code: viagem.moeda, size: 16),
                            const SizedBox(width: 6),
                            Text(
                              viagem.moeda,
                              style: Theme.of(context).textTheme.labelSmall
                                  ?.copyWith(
                                    color: PulsoColors.button,
                                    fontWeight: FontWeight.w700,
                                  ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Text(
                        formatBrl(viagem.totalBrl),
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      if (onEdit != null || onDelete != null)
                        PopupMenuButton<String>(
                          onSelected: (value) {
                            if (value == 'edit') onEdit?.call();
                            if (value == 'delete') onDelete?.call();
                          },
                          itemBuilder: (context) => [
                            if (onEdit != null)
                              const PopupMenuItem(
                                value: 'edit',
                                child: Text('Editar'),
                              ),
                            if (onDelete != null)
                              const PopupMenuItem(
                                value: 'delete',
                                child: Text('Excluir'),
                              ),
                          ],
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Cover extends StatelessWidget {
  const _Cover({required this.url, required this.destino});

  final String? url;
  final String destino;

  @override
  Widget build(BuildContext context) {
    if (url == null || url!.isEmpty) {
      return _Fallback(destino: destino);
    }
    return Image.network(
      url!,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stack) => _Fallback(destino: destino),
    );
  }
}

class _Fallback extends StatelessWidget {
  const _Fallback({required this.destino});

  final String destino;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [PulsoColors.primary, PulsoColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Text(
          destino.isEmpty ? '✈' : destino.characters.first.toUpperCase(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 42,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
