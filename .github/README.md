# `.github/` — automação, planejamento e agentes

Configuração do repositório no GitHub: CI, Dependabot, labels, **cards de implementação** e ferramentas para agentes (Cursor/Copilot).

## Mapa rápido

```
.github/
├── README.md                 ← você está aqui
├── dependabot.yml            npm (web/api) + GitHub Actions
├── labeler.yml               labels automáticos em PRs
├── workflows/                CI (lint, test, build, prisma)
├── plans/
│   ├── README.md             índice de epics + status
│   ├── cards/                epics (Jira-like) — fonte de verdade do escopo
│   └── implementations/      planos gerados pelo agent (por feature)
├── agents/                   definições de agentes Cursor/Copilot
└── skills/                   skills reutilizáveis (geradores + manutenção)
```

**Não existem** (e não precisam, por ora): `.github/docs/`, `.github/instructions/` — documentação de produto/código ficou em [`Documentacao/`](../Documentacao/README.md).

---

## O que é cada coisa?

| Pasta / arquivo | Função | Quando usar |
|-----------------|--------|-------------|
| **`plans/cards/`** | Epics detalhados (escopo, stories, critérios) | Planejar e rastrear módulos; referência para PRs (`Refs:`) |
| **`plans/implementations/`** | Planos faseados gerados pelo agent | Durante implementação guiada pelo agent |
| **`agents/`** | Personas (implementation-plan, mentoring) | Cursor: `@implementation-plan.agent.md` |
| **`skills/`** | Prompts especializados | Gerar blueprint **de módulo novo** ou atualizar README |
| **`workflows/`** | CI + security scan | Automático em push/PR |
| **`dependabot.yml`** | Atualização semanal de deps | Automático |
| **`labeler.yml`** | Labels `web`, `api`, `docs`, `po-audit`, `plans`, etc. | Automático em PR |

---

## Skills — ativas vs. legado

| Skill | Uso recomendado hoje |
|-------|----------------------|
| `readme-updater` | ✅ Manter READMEs de API/Web alinhados ao código |
| `card-refiner` | ✅ Refinar/detalhar cards antes de implementar |
| `po-audit` | ✅ Auditoria PO módulo a módulo → `Documentacao/03-Auditorias/Product Owner/` |
| `security-audit` | ✅ AppSec em 3 fases → `Documentacao/03-Auditorias/Application Security/` |
| `devops-audit` | ✅ CI/CD, cron, migrations → `Documentacao/03-Auditorias/DevOps/` |
| `dev-senior-review` | ✅ Code review profundo → `Documentacao/03-Auditorias/Code Review/` |
| `ux-audit` | ✅ Padronização DS/UX → `Documentacao/03-Auditorias/UX Design/` |
| `architecture-audit` | ✅ Domínio, integrações, runtime → `Documentacao/03-Auditorias/Architecture/` |
| `project-architect` | 🟡 Novos módulos grandes (19–25) |
| `plantuml-diagram-generator` | 🟡 Atualizar diagramas em `Documentacao/04-Diagramas/` |
| `skills/_legacy/*-blueprint-generator` | ⏸ Legado greenfield — ver [`skills/_legacy/README.md`](./skills/_legacy/README.md) |

Prompts originais (spec completa): [`Documentacao/03-Auditorias/Prompts/`](../Documentacao/03-Auditorias/Prompts/README.md)

---

## Agents

| Agent | Papel |
|-------|--------|
| `implementation-plan.agent.md` | Lê card → gera plano em `plans/implementations/` → implementa por fases |
| `mentoring-juniors.agent.md` | Explica código e boas práticas para juniors |

---

## Convenções com o resto do repo

- **Requisitos oficiais:** [`Documentacao/01-Produto/Requisitos/`](../Documentacao/01-Produto/Requisitos/Readme.md)
- **Auditoria PO:** [`Documentacao/03-Auditorias/Product Owner/`](../Documentacao/03-Auditorias/Product Owner/00-Sumario-Executivo.md)
- **Commits:** [`Documentacao/02-Engenharia/Guia-Commits.md`](../Documentacao/02-Engenharia/Guia-Commits.md)
- Cards usam `Refs: RF-xxx` / `Refs: PO-AUDIT-2026-08` alinhados ao guia de commits

---

## Próximos epics sugeridos (ainda sem card)

| Módulo | Prioridade |
|--------|------------|
| Dashboard (RF-007–014) | 🔴 Alta |
| Perfil e Configurações (RF-073–078) | 🔴 Alta |
| Insights + Chatbot (RF-044–053) | 🟡 Média |
| Onboarding (RF-151–154) | 🟡 Média |
| Importação OFX/CSV (RF-155–158) | 🟡 Média |

Ver índice completo em [`plans/README.md`](./plans/README.md).
