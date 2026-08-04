---
name: architecture-audit
description: >-
  Auditoria arquitetural Staff em 3 fases: domínio/dados, integrações/runtime,
  front-end/evolução. Gera ARCH-N-NN em Documentacao/03-Auditorias/Architecture/.
  UMA fase por vez; trade-offs explícitos.
---

# Architecture Audit — Domínio, Integrações, Runtime

## Protocolo completo

`Documentacao/03-Auditorias/Prompts/AnaliseArquiteto.md`

## Variáveis

| Variável | Default |
|----------|---------|
| `${PHASE}` | `1` \| `2` \| `3` \| `consolidar` |
| `${OUTPUT_DIR}` | `Documentacao/03-Auditorias/Architecture/` |

## Arquivos de saída

| Fase | Arquivo |
|------|---------|
| 1 | `arch-fase-1-dominio-dados.md` |
| 2 | `arch-fase-2-integracoes-runtime.md` |
| 3 | `arch-fase-3-frontend-evolucao.md` |
| consolidar | `arch-sumario-executivo.md` |

## Fontes

- `Documentacao/04-Diagramas/`
- `prisma/schema.prisma`, migrations pendentes
- `.github/plans/cards/` — boundaries entre módulos
- `Documentacao/03-Auditorias/Product Owner/00-Achados-Transversais.md`

## Regras

- ID achados: `ARCH-<FASE>-<NN>`
- Bounded contexts vs. 25 módulos planejados
- Serverless: cron Vercel vs node-cron local, rate limit memória
