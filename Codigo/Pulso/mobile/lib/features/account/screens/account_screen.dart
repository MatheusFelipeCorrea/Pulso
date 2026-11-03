import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/pulso_tokens.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/core/widgets/pulso_badge.dart';
import 'package:pulso/core/widgets/pulso_feedback.dart';
import 'package:pulso/core/widgets/pulso_page.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';

const _freeFeatures = [
  'Dashboard e transações',
  'Orçamento e calendário',
  'Metas, dívidas e divisão',
  'Planejamento de compra',
];

const _premiumFeatures = [
  'Tudo do plano Free',
  'Grupos com convite e chat',
  'Viagens e moedas',
  'R\$ 50/mês em reais',
];

const _modoUsoLabel = {
  'ESTAGIARIO': 'Estagiário',
  'CLT': 'CLT',
  'PJ': 'PJ / Freelancer',
  'PESSOA_FISICA': 'Pessoa física',
};

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key, required this.mode});

  final AccountMode mode;

  bool get _isSettings => mode == AccountMode.settings;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    final theme = context.watch<ThemeController>();
    final user = auth.user;
    final brightness = Theme.of(context).brightness;
    final scheme = Theme.of(context).colorScheme;
    final accent = PulsoColors.accent(brightness);
    final isPremium = (user?.plano ?? 'FREE').toUpperCase() == 'PREMIUM';
    final kind = badgeKindFromModoUso(user?.modoUso);
    final features = isPremium ? _premiumFeatures : _freeFeatures;
    final nome = _displayName(user?.nome);
    final email = user?.email ?? '—';
    final modoKey = user?.modoUso ?? 'CLT';
    final modoLabel = _modoUsoLabel[modoKey] ?? modoKey.replaceAll('_', ' ');
    final initials = _initials(nome);
    final selectedTheme = theme.mode == ThemeMode.dark
        ? ThemeMode.dark
        : ThemeMode.light;

    return ListView(
      padding: const EdgeInsets.fromLTRB(
        PulsoTokens.space4,
        PulsoTokens.space2,
        PulsoTokens.space4,
        96,
      ),
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'CONTA',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: accent,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _isSettings ? 'Configurações' : 'Perfil',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _isSettings
                        ? 'Aparência, documentos e sessão neste dispositivo.'
                        : 'Seus dados e o plano ativo no Pulso.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: () =>
                  context.go(_isSettings ? '/profile' : '/settings'),
              child: Text(_isSettings ? 'Perfil' : 'Configurações'),
            ),
          ],
        ),
        const SizedBox(height: PulsoTokens.space4),
        if (_isSettings) ...[
          PulsoSurface(
            onTap: () => context.go('/profile'),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: PulsoColors.button,
                  foregroundColor: Colors.white,
                  backgroundImage: (user?.urlAvatar ?? '').isNotEmpty
                      ? NetworkImage(user!.urlAvatar!)
                      : null,
                  child: (user?.urlAvatar ?? '').isEmpty
                      ? Text(
                          initials,
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        )
                      : null,
                ),
                const SizedBox(width: PulsoTokens.space3),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(nome, style: Theme.of(context).textTheme.titleSmall),
                      const SizedBox(height: 2),
                      Text(
                        '$email · ${isPremium ? 'Premium' : 'Free'}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  'Ver perfil',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: accent,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Icon(Icons.chevron_right, color: accent, size: 18),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          PulsoSurface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Aparência', style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 6),
                Text(
                  'Escolha o tema da interface.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: PulsoTokens.space3),
                Row(
                  children: [
                    Expanded(
                      child: _ThemeChoiceCard(
                        label: 'Claro',
                        icon: Icons.light_mode_outlined,
                        selected: selectedTheme == ThemeMode.light,
                        previewDark: false,
                        onTap: () => theme.setMode(ThemeMode.light),
                      ),
                    ),
                    const SizedBox(width: PulsoTokens.space3),
                    Expanded(
                      child: _ThemeChoiceCard(
                        label: 'Escuro',
                        icon: Icons.dark_mode_outlined,
                        selected: selectedTheme == ThemeMode.dark,
                        previewDark: true,
                        onTap: () => theme.setMode(ThemeMode.dark),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          PulsoSurface(
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    PulsoTokens.space4,
                    PulsoTokens.space4,
                    PulsoTokens.space4,
                    PulsoTokens.space2,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Documentos',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Termos e privacidade do Pulso.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                _LinkTile(
                  icon: Icons.description_outlined,
                  title: 'Termos de uso',
                  subtitle: 'Regras de uso da plataforma',
                  onTap: () => context.push('/termos'),
                ),
                Divider(height: 1, color: scheme.outline.withValues(alpha: 0.5)),
                _LinkTile(
                  icon: Icons.privacy_tip_outlined,
                  title: 'Política de privacidade',
                  subtitle: 'Como tratamos seus dados',
                  onTap: () => context.push('/privacidade'),
                ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          PulsoSurface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Zona de risco',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  'Sair encerra só este dispositivo. Apagar remove a conta e os dados financeiros de forma permanente.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: PulsoTokens.space3),
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                  ),
                  onPressed: () => _logout(context, auth),
                  icon: const Icon(Icons.logout),
                  label: const Text('Sair da conta'),
                ),
                const SizedBox(height: PulsoTokens.space2),
                FilledButton.tonalIcon(
                  style: FilledButton.styleFrom(
                    foregroundColor: scheme.error,
                    backgroundColor: scheme.error.withValues(alpha: 0.12),
                    minimumSize: const Size.fromHeight(48),
                  ),
                  onPressed: () => _deleteAccount(context, auth),
                  icon: const Icon(Icons.delete_forever_outlined),
                  label: const Text('Apagar minha conta'),
                ),
              ],
            ),
          ),
        ] else ...[
          PulsoSurface(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(PulsoTokens.space4),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        accent.withValues(alpha: 0.16),
                        Colors.transparent,
                      ],
                    ),
                    border: Border(
                      bottom: BorderSide(
                        color: scheme.outline.withValues(alpha: 0.7),
                      ),
                    ),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 34,
                        backgroundColor: PulsoColors.button,
                        foregroundColor: Colors.white,
                        backgroundImage: (user?.urlAvatar ?? '').isNotEmpty
                            ? NetworkImage(user!.urlAvatar!)
                            : null,
                        child: (user?.urlAvatar ?? '').isEmpty
                            ? Text(
                                initials,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 18,
                                ),
                              )
                            : null,
                      ),
                      const SizedBox(width: PulsoTokens.space4),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              nome,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              email,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: scheme.onSurfaceVariant),
                            ),
                            const SizedBox(height: PulsoTokens.space3),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: [
                                if (kind != null)
                                  PulsoBadge.kind(
                                    kind: kind,
                                    brightness: brightness,
                                    compact: true,
                                  ),
                                PulsoBadge.custom(
                                  label: isPremium ? 'Premium' : 'Free',
                                  icon: isPremium
                                      ? Icons.workspace_premium_outlined
                                      : Icons.shield_outlined,
                                  color: isPremium
                                      ? accent
                                      : PulsoColors.secondaryText(brightness),
                                  compact: true,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: PulsoTokens.space2,
                    vertical: PulsoTokens.space1,
                  ),
                  child: Column(
                    children: [
                      _InfoRow(label: 'Nome', value: nome),
                      _InfoRow(label: 'E-mail', value: email),
                      _InfoRow(label: 'Perfil de uso', value: modoLabel),
                      _InfoRow(
                        label: 'Plano',
                        value: isPremium ? 'Premium' : 'Free',
                        showDivider: false,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: PulsoTokens.space4),
          PulsoSurface(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isPremium ? 'Incluído no Premium' : 'Incluído no Free',
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  isPremium
                      ? 'Grupos e viagens liberados nesta conta.'
                      : 'Core financeiro liberado. Premium adiciona grupos e viagens por R\$ 50/mês.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: PulsoTokens.space4),
                ...features.map(
                  (feature) => Padding(
                    padding: const EdgeInsets.only(bottom: PulsoTokens.space3),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.check_rounded, size: 16, color: accent),
                        const SizedBox(width: PulsoTokens.space2),
                        Expanded(
                          child: Text(
                            feature,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Future<void> _logout(BuildContext context, AuthController auth) async {
    final ok = await showPulsoConfirm(
      context: context,
      title: 'Sair da conta',
      message: 'Encerrar a sessão neste dispositivo?',
      confirmLabel: 'Sair',
      danger: true,
    );
    if (ok != true || !context.mounted) return;
    await auth.logout();
    if (!context.mounted) return;
    context.go('/login');
  }

  Future<void> _deleteAccount(BuildContext context, AuthController auth) async {
    final ok = await showPulsoCriticalConfirm(
      context: context,
      title: 'Apagar sua conta?',
      message:
          'Isso remove permanentemente seus dados financeiros, grupos criados e preferências. Não dá para desfazer.',
      confirmationText: 'APAGAR',
      confirmLabel: 'Apagar conta',
      cancelLabel: 'Manter conta',
    );
    if (ok != true || !context.mounted) return;
    try {
      await auth.deleteAccount(confirmacao: 'APAGAR');
      if (!context.mounted) return;
      showPulsoSnack(context, 'Conta apagada. Seus dados foram removidos.');
      context.go('/login');
    } catch (error) {
      if (!context.mounted) return;
      showPulsoSnack(context, AuthController.messageOf(error));
    }
  }
}

enum AccountMode { profile, settings }

class _ThemeChoiceCard extends StatelessWidget {
  const _ThemeChoiceCard({
    required this.label,
    required this.icon,
    required this.selected,
    required this.previewDark,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final bool previewDark;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final accent = PulsoColors.accent(Theme.of(context).brightness);
    final previewBg = previewDark
        ? const Color(0xFF09090B)
        : const Color(0xFFFAFAFA);
    final previewLine = previewDark
        ? const Color(0xFF3F3F46)
        : const Color(0xFFD4D4D8);
    final previewAccent = previewDark
        ? const Color(0xFFA78BFA)
        : const Color(0xFF7C3AED);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
        child: AnimatedContainer(
          duration: PulsoTokens.durationFast,
          padding: const EdgeInsets.all(PulsoTokens.space2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(PulsoTokens.radiusLg),
            border: Border.all(
              color: selected
                  ? accent.withValues(alpha: 0.55)
                  : Theme.of(context).colorScheme.outline.withValues(alpha: 0.7),
            ),
            color: selected
                ? accent.withValues(alpha: 0.1)
                : Theme.of(context).colorScheme.surfaceContainerHighest,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 64,
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: previewBg,
                  borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
                  border: Border.all(
                    color: previewDark
                        ? const Color(0xFF27272A)
                        : const Color(0xFFE4E4E7),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _PreviewBar(widthFactor: 0.42, color: previewAccent),
                    const SizedBox(height: 6),
                    _PreviewBar(widthFactor: 0.72, color: previewLine),
                    const Spacer(),
                    _PreviewBar(widthFactor: 0.58, color: previewLine),
                  ],
                ),
              ),
              const SizedBox(height: PulsoTokens.space2),
              Row(
                children: [
                  Icon(icon, size: 16, color: selected ? accent : null),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      label,
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: selected ? accent : null,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  if (selected)
                    Icon(Icons.check_rounded, size: 16, color: accent),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PreviewBar extends StatelessWidget {
  const _PreviewBar({required this.widthFactor, required this.color});

  final double widthFactor;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: widthFactor,
      child: Container(
        height: 7,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(999),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    this.showDivider = true,
  });

  final String label;
  final String value;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: PulsoTokens.space3,
        vertical: PulsoTokens.space3,
      ),
      decoration: BoxDecoration(
        border: showDivider
            ? Border(
                bottom: BorderSide(
                  color: scheme.outline.withValues(alpha: 0.45),
                ),
              )
            : null,
      ),
      child: Row(
        children: [
          SizedBox(
            width: 108,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: scheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

class _LinkTile extends StatelessWidget {
  const _LinkTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final accent = PulsoColors.accent(Theme.of(context).brightness);
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: accent.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(PulsoTokens.radiusMd),
        ),
        child: Icon(icon, size: 18, color: accent),
      ),
      title: Text(title, style: Theme.of(context).textTheme.titleSmall),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

String _displayName(String? nome) {
  final raw = (nome ?? '').trim();
  if (raw.isEmpty) return 'Usuário';
  final cleaned = raw
      .replaceAll(RegExp(r'\s*\([^)]*\)\s*'), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
  return cleaned.isEmpty ? 'Usuário' : cleaned;
}

String _initials(String nome) {
  final parts = nome
      .trim()
      .split(RegExp(r'\s+'))
      .where((part) => part.isNotEmpty)
      .toList();
  if (parts.isEmpty) return 'U';
  if (parts.length == 1) {
    final value = parts.first;
    return value.substring(0, value.length >= 2 ? 2 : 1).toUpperCase();
  }
  return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
}
