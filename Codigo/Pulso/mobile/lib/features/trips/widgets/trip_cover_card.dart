import 'package:flutter/material.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/currency_flag.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/trips/data/trip_models.dart';
import 'package:pulso/features/trips/utils/trip_image_utils.dart';

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
        clipBehavior: Clip.antiAlias,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusXl),
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
                SizedBox(
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
                        right: 48,
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
                      if (onEdit != null || onDelete != null)
                        Positioned(
                          top: 4,
                          right: 4,
                          child: Material(
                            color: Colors.black45,
                            shape: const CircleBorder(),
                            child: PopupMenuButton<String>(
                              padding: EdgeInsets.zero,
                              icon: const Icon(
                                Icons.more_vert,
                                color: Colors.white,
                                size: 20,
                              ),
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
                          ),
                        ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    PulsoTokens.space4,
                    PulsoTokens.space3,
                    PulsoTokens.space4,
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
                      Flexible(
                        child: Text(
                          formatDayHeader(viagem.dataPrevista),
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                      const SizedBox(width: PulsoTokens.space2),
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
                      const SizedBox(width: PulsoTokens.space2),
                      Flexible(
                        child: Text(
                          formatBrl(viagem.totalBrl),
                          textAlign: TextAlign.end,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
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

class _Cover extends StatefulWidget {
  const _Cover({required this.url, required this.destino});

  final String? url;
  final String destino;

  @override
  State<_Cover> createState() => _CoverState();
}

class _CoverState extends State<_Cover> {
  late String? _currentUrl;
  var _retried = false;

  @override
  void initState() {
    super.initState();
    _currentUrl = repairWikiThumbUrl(widget.url);
  }

  @override
  void didUpdateWidget(covariant _Cover oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.url != widget.url) {
      _currentUrl = repairWikiThumbUrl(widget.url);
      _retried = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_currentUrl == null || _currentUrl!.isEmpty) {
      return _Fallback(destino: widget.destino);
    }
    return Image.network(
      _currentUrl!,
      fit: BoxFit.cover,
      headers: const {'Referer': ''},
      errorBuilder: (context, error, stack) {
        if (!_retried) {
          final shrunk = shrinkWikiThumbUrl(_currentUrl, maxWidth: 220);
          if (shrunk != null && shrunk != _currentUrl) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (!mounted) return;
              setState(() {
                _retried = true;
                _currentUrl = shrunk;
              });
            });
            return _Fallback(destino: widget.destino);
          }
        }
        return _Fallback(destino: widget.destino);
      },
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
