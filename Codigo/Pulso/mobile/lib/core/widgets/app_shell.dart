import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/pulso_brand.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/transactions/utils/formatters.dart';
import 'package:pulso/features/transactions/widgets/filters_sheet.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final tx = context.watch<TransactionsController>();

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: location == '/transactions' ? 64 : kToolbarHeight,
        title: _title(context, location, tx),
        actions: _actions(context, location),
      ),
      drawer: const PulsoSidebar(),
      body: child,
    );
  }

  Widget _title(BuildContext context, String location, TransactionsController tx) {
    if (location.startsWith('/transactions') && !location.contains('/new')) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Transações', style: Theme.of(context).textTheme.titleMedium),
          Text(
            TransactionPeriod.label(tx.filters.periodo),
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      );
    }
    if (location == '/categories') return const Text('Categorias');
    if (location == '/tags') return const Text('Tags');
    if (location == '/goals') return const Text('Metas');
    if (location == '/dashboard') return const Text('Início');
    return const Text('Pulso');
  }

  List<Widget> _actions(BuildContext context, String location) {
    if (location == '/transactions') {
      return [
        IconButton(
          tooltip: 'Filtros',
          onPressed: () async {
            final controller = context.read<TransactionsController>();
            final next = await showTransactionFiltersSheet(
              context: context,
              current: controller.filters,
              options: controller.options,
            );
            if (next != null && context.mounted) await controller.applyFilters(next);
          },
          icon: const Icon(Icons.tune),
        ),
        Padding(
          padding: const EdgeInsets.only(right: PulsoTokens.space2),
          child: FilledButton.icon(
            style: FilledButton.styleFrom(
              minimumSize: const Size(0, PulsoTokens.buttonMd),
              padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space3),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            onPressed: () => context.push('/transactions/new'),
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Nova'),
          ),
        ),
      ];
    }
    if (location == '/goals') {
      return [
        Padding(
          padding: const EdgeInsets.only(right: PulsoTokens.space2),
          child: FilledButton.icon(
            style: FilledButton.styleFrom(
              minimumSize: const Size(0, PulsoTokens.buttonMd),
              padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space3),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            onPressed: () => context.push('/goals/form'),
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Nova'),
          ),
        ),
      ];
    }
    return const [];
  }
}

class PulsoSidebar extends StatelessWidget {
  const PulsoSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final theme = context.watch<ThemeController>();
    final user = auth.user;
    final location = GoRouterState.of(context).uri.path;
    final initials = _initials(user?.nome ?? '');
    final brightness = Theme.of(context).brightness;
    final kind = badgeKindFromModoUso(user?.modoUso);

    return Drawer(
      width: 280,
      child: SafeArea(
        child: Semantics(
          container: true,
          label: 'Navegação principal',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Padding(
                padding: EdgeInsets.fromLTRB(PulsoTokens.space5, PulsoTokens.space3, PulsoTokens.space4, PulsoTokens.space2),
                child: PulsoBrand(height: 28, showTagline: true),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(PulsoTokens.space3, PulsoTokens.space2, PulsoTokens.space3, PulsoTokens.space3),
                child: Container(
                  padding: const EdgeInsets.all(PulsoTokens.space3),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
                    border: Border.all(color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.6)),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: PulsoColors.button,
                        foregroundColor: Colors.white,
                        child: Text(initials, style: const TextStyle(fontWeight: FontWeight.w700)),
                      ),
                      const SizedBox(width: PulsoTokens.space3),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.nome ?? 'Usuário',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: Theme.of(context).textTheme.titleSmall,
                            ),
                            const SizedBox(height: 6),
                            if (kind != null) PulsoBadge.kind(kind: kind, brightness: brightness, compact: true),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              _NavTile(
                icon: Icons.swap_horiz,
                label: 'Transações',
                selected: location == '/transactions' || location.startsWith('/transactions/'),
                onTap: () => _go(context, '/transactions'),
              ),
              _NavTile(
                icon: Icons.grid_view_outlined,
                label: 'Início',
                selected: location == '/dashboard',
                onTap: () => _go(context, '/dashboard'),
              ),
              _NavTile(
                icon: Icons.flag_outlined,
                label: 'Metas',
                selected: location == '/goals' || location.startsWith('/goals/'),
                onTap: () => _go(context, '/goals'),
              ),
              const Spacer(),
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, 0),
                child: Text('CONTA', style: Theme.of(context).textTheme.labelSmall),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space3, vertical: PulsoTokens.space2),
                child: SegmentedButton<ThemeMode>(
                  showSelectedIcon: false,
                  style: const ButtonStyle(visualDensity: VisualDensity.compact),
                  segments: const [
                    ButtonSegment(value: ThemeMode.light, label: Text('Claro'), icon: Icon(Icons.light_mode, size: 16)),
                    ButtonSegment(value: ThemeMode.dark, label: Text('Escuro'), icon: Icon(Icons.dark_mode, size: 16)),
                  ],
                  selected: {theme.mode == ThemeMode.dark ? ThemeMode.dark : ThemeMode.light},
                  onSelectionChanged: (value) => theme.setMode(value.first),
                ),
              ),
              ListTile(
                leading: Icon(Icons.logout, color: Theme.of(context).colorScheme.error),
                title: Text('Sair', style: TextStyle(color: Theme.of(context).colorScheme.error)),
                onTap: () async {
                  Navigator.pop(context);
                  await auth.logout();
                  if (context.mounted) context.go('/login');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _go(BuildContext context, String path) {
    Navigator.pop(context);
    context.go(path);
  }

  String _initials(String nome) {
    final parts = nome.trim().split(RegExp(r'\s+')).where((part) => part.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts.first[0].toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }
}

class _NavTile extends StatelessWidget {
  const _NavTile({
    required this.icon,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: selected ? PulsoColors.accent(Theme.of(context).brightness) : null),
      title: Text(
        label,
        style: TextStyle(
          color: selected ? PulsoColors.accent(Theme.of(context).brightness) : null,
          fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
        ),
      ),
      selected: selected,
      selectedTileColor: PulsoColors.primary.withValues(alpha: 0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: onTap,
    );
  }
}
