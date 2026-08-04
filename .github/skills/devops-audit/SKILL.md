---
name: devops-audit
description: >-
  Auditoria DevOps/SRE em 3 fases: CI/CD, jobs/confiabilidade, observabilidade/custos.
  Analisa .github/workflows, vercel.json, prisma migrations, cron. Gera OPS-N-NN em
  Documentacao/03-Auditorias/DevOps/. UMA fase por vez.
---

# DevOps Audit — Plataforma e Operação

## Protocolo completo

`Documentacao/03-Auditorias/Prompts/AnaliseDevops.md`

## Variáveis

| Variável | Default |
|----------|---------|
| `${PHASE}` | `1` \| `2` \| `3` \| `consolidar` |
| `${OUTPUT_DIR}` | `Documentacao/03-Auditorias/DevOps/` |

## Arquivos de saída

| Fase | Arquivo |
|------|---------|
| 1 | `devops-fase-1-cicd-ambientes.md` |
| 2 | `devops-fase-2-jobs-confiabilidade.md` |
| 3 | `devops-fase-3-observabilidade-custos.md` |
| consolidar | `devops-sumario-executivo.md` |

## Fontes obrigatórias

- `.github/workflows/`, `vercel.json`, `.github/dependabot.yml`
- `Codigo/Pulso/api/src/jobs/`, `cronController.js`, `server.js`
- `prisma/migrations/`, `package.json` scripts
- `Documentacao/02-Engenharia/Deploy/`

## Regras

- ID achados: `OPS-<FASE>-<NN>`
- Uma fase por sessão; aguardar OK do usuário
- Citar YAML, scripts e configs concretos
