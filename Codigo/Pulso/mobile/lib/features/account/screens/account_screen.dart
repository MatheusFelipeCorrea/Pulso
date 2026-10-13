import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({
    super.key,
    required this.title,
    required this.subtitle,
    this.showTheme = false,
  });

  final String title;
  final String subtitle;
  final bool showTheme;

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthController>().user;
    final theme = context.watch<ThemeController>();
    final brightness = Theme.of(context).brightness;
    final kind = badgeKindFromModoUso(user?.modoUso);

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        PulsoTokens.space4,
        PulsoTokens.space2,
        PulsoTokens.space4,
        96,
      ),
      children: [
        PulsoPageHeader(
          title: title,
          subtitle: subtitle,
          icon: showTheme ? Icons.settings_outlined : Icons.person_outline,
        ),
        PulsoSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Field(label: 'Nome', value: user?.nome ?? '—'),
              const SizedBox(height: PulsoTokens.space4),
              _Field(label: 'E-mail', value: user?.email ?? '—'),
              const SizedBox(height: PulsoTokens.space4),
              _Field(label: 'Plano', value: user?.plano ?? 'FREE'),
              if (kind != null) ...[
                const SizedBox(height: PulsoTokens.space4),
                Text('Perfil', style: Theme.of(context).textTheme.labelSmall),
                const SizedBox(height: 6),
                PulsoBadge.kind(kind: kind, brightness: brightness),
              ],
            ],
          ),
        ),
        if (showTheme) ...[
          const SizedBox(height: PulsoTokens.space4),
          PulsoSurface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Aparência',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: PulsoTokens.space3),
                SegmentedButton<ThemeMode>(
                  showSelectedIcon: false,
                  segments: const [
                    ButtonSegment(
                      value: ThemeMode.light,
                      label: Text('Claro'),
                      icon: Icon(Icons.light_mode, size: 16),
                    ),
                    ButtonSegment(
                      value: ThemeMode.dark,
                      label: Text('Escuro'),
                      icon: Icon(Icons.dark_mode, size: 16),
                    ),
                  ],
                  selected: {
                    theme.mode == ThemeMode.dark
                        ? ThemeMode.dark
                        : ThemeMode.light,
                  },
                  onSelectionChanged: (value) => theme.setMode(value.first),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: PulsoTokens.space4),
        TextButton(
          onPressed: () => context.go('/transactions'),
          child: const Text('Voltar às transações'),
        ),
      ],
    );
  }
}

class _Field extends StatelessWidget {
  const _Field({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: Theme.of(context).textTheme.labelSmall,
        ),
        const SizedBox(height: 4),
        Text(value, style: Theme.of(context).textTheme.bodyLarge),
      ],
    );
  }
}
