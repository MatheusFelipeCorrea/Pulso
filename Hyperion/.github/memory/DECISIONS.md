# Decisions Log

Quick decisions that do not warrant a full ADR. For architecture, use `.github/docs/adr/`.

| ID | Date | Decision | Rationale |
|----|------|----------|-----------|
| D-001 | 2026-08-26 | Kit Hyperion nested (`kit.root: Hyperion`) | Evita poluir a raiz; cards/skills ficam sob `Hyperion/.github/` |
| D-002 | 2026-08-26 | Manter CI de produto (`ci.yml`, `security.yml`, `labeler.yml`) | Pipeline Pulso já cobre api/web; template `hyperion-product-ci` é genérico demais |
| D-003 | 2026-08-26 | `hyperion-sync-cards.yml` adaptado para paths `Hyperion/` | Templates stock assumem kit na raiz |
| D-004 | 2026-08-26 | Desligar `kit_validation` e `security_scan` do Hyperion no product CI | Validate do kit é para maintainers; security já existe no produto |

## Migration 2026-08-26

- Stack detectada: monorepo Node (api Jest + web Vitest/Vite)
- Cards: 244 validados, layout nested-by-parent
- Locale: pt-BR
- Próximo: `/sync` (board) ou `/refine` em novos itens
