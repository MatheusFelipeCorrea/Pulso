---
name: ux-audit
description: >-
  Auditoria UX/UI e Design System em 3 fases: tokens, componentes, jornadas por módulo.
  Foco em padronização (Vital Purple), não redesign. Gera UX-N-NN em
  Documentacao/03-Auditorias/UX Design/. UMA fase por vez.
---

# UX Audit — Padronização e Design System

## Protocolo completo

`Documentacao/03-Auditorias/Prompts/AnaliseDesigner.md`

## Variáveis

| Variável | Default |
|----------|---------|
| `${PHASE}` | `1` \| `2` \| `3` \| `consolidar` |
| `${OUTPUT_DIR}` | `Documentacao/03-Auditorias/UX Design/` |

## Arquivos de saída

| Fase | Arquivo |
|------|---------|
| 1 | `design-fase-1-fundamentos-tokens.md` |
| 2 | `design-fase-2-componentes-padroes.md` |
| 3 | `design-fase-3-jornadas-modulos.md` |
| consolidar | `design-sumario-executivo.md` |

## Fontes

- `Codigo/Pulso/web/src/design-system/`
- `Codigo/Pulso/web/src/styles/`, `theme.css`
- `Codigo/Pulso/web/src/components/badges/`
- Epic Design System: `.github/plans/cards/[EPIC] Design System - Pulso.md`

## Regras

- ID achados: `UX-<FASE>-<NN>`
- Cada inconsistência → **decisão canônica** (padrão único)
- Regra de ouro: padronizar, não catalogar variações
