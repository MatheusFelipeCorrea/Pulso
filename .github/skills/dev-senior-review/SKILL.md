---
name: dev-senior-review
description: >-
  Code review profundo em 3 fases: backend (services/prisma), frontend (React),
  testes e integração. Caça bugs, edge cases, code smells. Gera DEV-N-NN em
  .github/audits/results/code-review/. UMA fase por vez; snippets com correção sugerida.
---

# Dev Senior Review — Auditoria de Implementação

## Protocolo completo

`.github/audits/prompts/dev-senior.md`

## Variáveis

| Variável | Default |
|----------|---------|
| `${PHASE}` | `1` (backend) \| `2` (frontend) \| `3` (testes) \| `consolidar` |
| `${OUTPUT_DIR}` | `.github/audits/results/code-review/` |
| `${MODULE_SCOPE}` | opcional — ex.: `metaService`, `GoalsPage` |

## Arquivos de saída

| Fase | Arquivo |
|------|---------|
| 1 | `dev-fase-1-backend.md` |
| 2 | `dev-fase-2-frontend.md` |
| 3 | `dev-fase-3-testes-integracao.md` |
| consolidar | `dev-sumario-executivo.md` |

## Regras

- ID achados: `DEV-<FASE>-<NN>`
- Priorizar bugs reais sobre nitpicks
- Cada bug: snippet, input que dispara, correção com código pronto
- Uma fase por sessão

## Foco Pulso

- Camadas: controller → service → repository (RNF-011)
- Prisma transactions em operações financeiras
- Race conditions: metas, VT saldo, aportes grupo
- Frontend: useEffect/fetch sem cleanup, estado page-local vs Redux
