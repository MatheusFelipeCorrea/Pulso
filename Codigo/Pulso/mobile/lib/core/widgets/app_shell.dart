import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/pulso_brand.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const PulsoBrand(height: 28),
      ),
      drawer: const PulsoSidebar(),
      body: child,
    );
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
    final badge = badgeFromModoUso(user?.modoUso);
    final initials = _initials(user?.nome ?? '');

    return Drawer(
      width: 280,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 16, 8),
              child: PulsoBrand(height: 28, showTagline: true),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Theme.of(context).dividerColor.withValues(alpha: 0.6),
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: PulsoColors.primary,
                      foregroundColor: Colors.white,
                      child: Text(initials, style: const TextStyle(fontWeight: FontWeight.w700)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.nome ?? 'Usuário',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 6),
                          PulsoBadge(style: badge, compact: true),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            _NavTile(
              icon: Icons.grid_view_outlined,
              label: 'Dashboard',
              selected: location == '/dashboard',
              onTap: () => _go(context, '/dashboard'),
            ),
            ExpansionTile(
              initiallyExpanded: true,
              leading: const Icon(Icons.payments_outlined),
              title: const Text('Financeiro'),
              childrenPadding: const EdgeInsets.only(left: 12),
              children: [
                _NavTile(
                  icon: Icons.swap_horiz,
                  label: 'Transações',
                  selected: location.startsWith('/transactions'),
                  onTap: () => _go(context, '/transactions'),
                ),
                _NavTile(
                  icon: Icons.category_outlined,
                  label: 'Categorias',
                  selected: location == '/categories',
                  onTap: () => _go(context, '/categories'),
                ),
                _NavTile(
                  icon: Icons.label_outline,
                  label: 'Tags',
                  selected: location == '/tags',
                  onTap: () => _go(context, '/tags'),
                ),
              ],
            ),
            const Spacer(),
            const Divider(height: 1),
            SwitchListTile(
              secondary: Icon(theme.mode == ThemeMode.dark ? Icons.dark_mode : Icons.light_mode),
              title: const Text('Tema escuro'),
              value: theme.mode == ThemeMode.dark,
              onChanged: (_) => theme.toggle(),
            ),
            ListTile(
              leading: const Icon(Icons.logout, color: PulsoColors.danger),
              title: const Text('Sair', style: TextStyle(color: PulsoColors.danger)),
              onTap: () async {
                Navigator.pop(context);
                await auth.logout();
                if (context.mounted) context.go('/login');
              },
            ),
          ],
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
      leading: Icon(icon, color: selected ? PulsoColors.primary : null),
      title: Text(
        label,
        style: TextStyle(
          color: selected ? PulsoColors.primary : null,
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
