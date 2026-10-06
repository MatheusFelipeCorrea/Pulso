import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/pulso_brand.dart';
import 'package:pulso/features/transactions/state/transactions_controller.dart';
import 'package:pulso/features/transactions/widgets/filters_sheet.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final premium = context.watch<AuthController>().user?.plano == 'PREMIUM';

    return Scaffold(
      appBar: AppBar(
        title: const PulsoBrand(height: 26),
        actions: _actions(context, location),
      ),
      drawer: const PulsoSidebar(),
      floatingActionButton: _fab(context, location),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _navIndex(location, premium),
        onDestinationSelected: (index) => _onNav(context, index, premium),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.swap_horiz),
            selectedIcon: Icon(Icons.swap_horiz),
            label: 'Transações',
          ),
          const NavigationDestination(
            icon: Icon(Icons.gps_fixed),
            selectedIcon: Icon(Icons.gps_fixed),
            label: 'Metas',
          ),
          if (premium)
            const NavigationDestination(
              icon: Icon(Icons.flight_takeoff_outlined),
              selectedIcon: Icon(Icons.flight_takeoff),
              label: 'Viagens',
            ),
        ],
      ),
      body: child,
    );
  }

  int _navIndex(String location, bool premium) {
    if (location.startsWith('/goals')) return 1;
    if (premium && location.startsWith('/trips')) return 2;
    return 0;
  }

  void _onNav(BuildContext context, int index, bool premium) {
    if (index == 0) context.go('/transactions');
    if (index == 1) context.go('/goals');
    if (premium && index == 2) context.go('/trips');
  }

  Widget? _fab(BuildContext context, String location) {
    if (location == '/transactions') {
      return FloatingActionButton.extended(
        onPressed: () => context.push('/transactions/new'),
        icon: const Icon(Icons.add),
        label: const Text('Nova'),
      );
    }
    if (location == '/calendar') {
      return FloatingActionButton.extended(
        onPressed: () => context.push('/calendar/reminder'),
        icon: const Icon(Icons.add),
        label: const Text('Lembrete'),
      );
    }
    if (location == '/goals') {
      return FloatingActionButton.extended(
        onPressed: () => context.push('/goals/form'),
        icon: const Icon(Icons.add),
        label: const Text('Nova'),
      );
    }
    if (location == '/budget') {
      return FloatingActionButton.extended(
        onPressed: () => context.push('/budget/edit'),
        icon: const Icon(Icons.edit_outlined),
        label: const Text('Editar'),
      );
    }
    if (location == '/trips') {
      return FloatingActionButton.extended(
        onPressed: () => context.push('/trips/new'),
        icon: const Icon(Icons.add),
        label: const Text('Nova'),
      );
    }
    return null;
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
        const SizedBox(width: PulsoTokens.space1),
      ];
    }
    return const [];
  }
}

class PulsoSidebar extends StatefulWidget {
  const PulsoSidebar({super.key});

  @override
  State<PulsoSidebar> createState() => _PulsoSidebarState();
}

class _PulsoSidebarState extends State<PulsoSidebar> {
  final _busca = TextEditingController();

  @override
  void dispose() {
    _busca.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final user = auth.user;
    final location = GoRouterState.of(context).uri.path;
    final initials = _initials(user?.nome ?? '');
    final brightness = Theme.of(context).brightness;
    final kind = badgeKindFromModoUso(user?.modoUso);
    final scheme = Theme.of(context).colorScheme;
    final query = _busca.text.trim().toLowerCase();
    final premium = user?.plano == 'PREMIUM';

    bool matches(String label) => query.isEmpty || label.toLowerCase().contains(query);

    final showTransacoes = matches('Transações') || matches('Financeiro');
    final showCalendario = matches('Calendário') || matches('Financeiro');
    final showOrcamento = matches('Orçamento') || matches('Financeiro');
    final showMetas = matches('Metas Financeiras') || matches('Planejamento');
    final showViagens = premium && (matches('Viagens e Moedas') || matches('Planejamento'));
    final showFinanceiro = showTransacoes || showCalendario || showOrcamento;
    final showPlanejamento = showMetas || showViagens;
    final showPerfil = matches('Perfil') || matches('Conta');
    final showSettings = matches('Configurações') || matches('Conta');
    final showSair = matches('Sair') || matches('Conta');

    return Drawer(
      width: 300,
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
                padding: const EdgeInsets.fromLTRB(PulsoTokens.space3, 0, PulsoTokens.space3, PulsoTokens.space2),
                child: TextField(
                  controller: _busca,
                  onChanged: (_) => setState(() {}),
                  decoration: const InputDecoration(
                    hintText: 'Buscar...',
                    prefixIcon: Icon(Icons.search, size: 18),
                    isDense: true,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(PulsoTokens.space3, PulsoTokens.space1, PulsoTokens.space3, PulsoTokens.space3),
                child: Container(
                  padding: const EdgeInsets.all(PulsoTokens.space3),
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
                    border: Border.all(color: scheme.outline.withValues(alpha: 0.6)),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: PulsoColors.button,
                        foregroundColor: Colors.white,
                        backgroundImage: (user?.urlAvatar ?? '').isNotEmpty
                            ? NetworkImage(user!.urlAvatar!)
                            : null,
                        child: (user?.urlAvatar ?? '').isEmpty
                            ? Text(initials, style: const TextStyle(fontWeight: FontWeight.w700))
                            : null,
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
                            if (kind != null) ...[
                              const SizedBox(height: 6),
                              PulsoBadge.kind(kind: kind, brightness: brightness, compact: true),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    if (showFinanceiro) ...[
                      const _GroupHeader(icon: Icons.payments_outlined, label: 'Financeiro'),
                      if (showTransacoes)
                        _NavTile(
                          icon: Icons.swap_horiz,
                          label: 'Transações',
                          selected: location == '/transactions' || location.startsWith('/transactions/'),
                          onTap: () => _go(context, '/transactions'),
                        ),
                      if (showCalendario)
                        _NavTile(
                          icon: Icons.calendar_month_outlined,
                          label: 'Calendário Financeiro',
                          selected: location == '/calendar' || location.startsWith('/calendar/'),
                          onTap: () => _go(context, '/calendar'),
                        ),
                      if (showOrcamento)
                        _NavTile(
                          icon: Icons.pie_chart_outline,
                          label: 'Orçamento Mensal',
                          selected: location == '/budget' || location.startsWith('/budget/'),
                          onTap: () => _go(context, '/budget'),
                        ),
                    ],
                    if (showPlanejamento) ...[
                      const _GroupHeader(icon: Icons.gps_fixed, label: 'Planejamento & Metas'),
                      if (showMetas)
                        _NavTile(
                          icon: Icons.gps_fixed,
                          label: 'Metas Financeiras',
                          selected: location == '/goals' || location.startsWith('/goals/'),
                          onTap: () => _go(context, '/goals'),
                        ),
                      if (showViagens)
                        _NavTile(
                          icon: Icons.flight_takeoff,
                          label: 'Viagens e Moedas',
                          selected: location == '/trips' || location.startsWith('/trips/'),
                          onTap: () => _go(context, '/trips'),
                        ),
                    ],
                  ],
                ),
              ),
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space2, PulsoTokens.space4, PulsoTokens.space1),
                child: Row(
                  children: [
                    Icon(Icons.person_outline, size: 16, color: scheme.onSurfaceVariant),
                    const SizedBox(width: 6),
                    Text('Conta', style: Theme.of(context).textTheme.labelSmall),
                  ],
                ),
              ),
              if (showPerfil)
                _NavTile(
                  icon: Icons.person_outline,
                  label: 'Perfil',
                  selected: location == '/profile',
                  onTap: () => _go(context, '/profile'),
                ),
              if (showSettings)
                _NavTile(
                  icon: Icons.settings_outlined,
                  label: 'Configurações',
                  selected: location == '/settings',
                  onTap: () => _go(context, '/settings'),
                ),
              if (showSair)
                ListTile(
                  leading: Icon(Icons.logout, color: scheme.error),
                  title: Text('Sair', style: TextStyle(color: scheme.error, fontWeight: FontWeight.w600)),
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

class _GroupHeader extends StatelessWidget {
  const _GroupHeader({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(PulsoTokens.space4, PulsoTokens.space3, PulsoTokens.space4, PulsoTokens.space1),
      child: Row(
        children: [
          Icon(icon, size: 16, color: scheme.onSurfaceVariant),
          const SizedBox(width: 8),
          Text(label.toUpperCase(), style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
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
    final scheme = Theme.of(context).colorScheme;
    final accent = PulsoColors.accent(Theme.of(context).brightness);
    final color = selected ? accent : scheme.onSurfaceVariant;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: PulsoTokens.space2),
      child: ListTile(
        leading: Icon(icon, color: color),
        title: Text(
          label,
          style: TextStyle(
            color: selected ? accent : scheme.onSurface,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
        selected: selected,
        selectedTileColor: PulsoColors.primary.withValues(alpha: 0.1),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        onTap: onTap,
      ),
    );
  }
}
