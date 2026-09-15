import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/core/theme/theme_controller.dart';
import 'package:pulso/features/auth/legal/legal_content.dart';
import 'package:pulso/features/auth/widgets/pulso_brand.dart';

class LegalDocumentScreen extends StatelessWidget {
  const LegalDocumentScreen({
    super.key,
    required this.meta,
    required this.sections,
  });

  final LegalMeta meta;
  final List<LegalSection> sections;

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeController>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final secondary = isDark ? PulsoColors.darkSecondary : PulsoColors.lightSecondary;
    final border = isDark ? PulsoColors.darkBorder : PulsoColors.lightBorder;
    final card = isDark ? PulsoColors.darkCard : PulsoColors.lightCard;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 12, 8),
              child: Row(
                children: [
                  const PulsoBrand(),
                  const Spacer(),
                  IconButton(
                    tooltip: isDark ? 'Tema claro' : 'Tema escuro',
                    onPressed: theme.toggle,
                    icon: Icon(isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 720),
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                    children: [
                      TextButton.icon(
                        onPressed: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/register');
                          }
                        },
                        icon: const Icon(Icons.arrow_back, size: 18),
                        label: const Text('Voltar ao cadastro'),
                        style: TextButton.styleFrom(
                          foregroundColor: PulsoColors.primary,
                          alignment: Alignment.centerLeft,
                          padding: EdgeInsets.zero,
                        ),
                      ),
                      const SizedBox(height: 16),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          color: card,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: border),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: PulsoColors.primary.withValues(alpha: isDark ? 0.18 : 0.1),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text(
                                  meta.badge,
                                  style: const TextStyle(
                                    color: PulsoColors.primary,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                meta.title,
                                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                      fontWeight: FontWeight.w700,
                                    ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Última atualização: ${meta.updatedAt}',
                                style: TextStyle(color: secondary, fontSize: 13),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                meta.intro,
                                style: TextStyle(color: secondary, height: 1.55),
                              ),
                              const SizedBox(height: 28),
                              for (final section in sections) ...[
                                Text(
                                  section.title,
                                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  section.content,
                                  style: TextStyle(color: secondary, height: 1.65, fontSize: 15),
                                ),
                                const SizedBox(height: 22),
                              ],
                              const Divider(),
                              const SizedBox(height: 12),
                              Text(
                                'Dúvidas? Entre em contato pelo suporte disponível no aplicativo.',
                                style: TextStyle(color: secondary, fontSize: 13, height: 1.5),
                              ),
                              const SizedBox(height: 16),
                              Wrap(
                                spacing: 16,
                                runSpacing: 8,
                                children: [
                                  TextButton(
                                    onPressed: () => context.go(meta.relatedPath),
                                    child: Text(meta.relatedLabel),
                                  ),
                                  TextButton(
                                    onPressed: () => context.go('/register'),
                                    child: const Text('Criar conta'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
