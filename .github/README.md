# `.github/` — automação, planejamento e agentes

> **README principal do repositório:** [../README.md](../README.md)  
> Este arquivo descreve **somente** o conteúdo da pasta `.github/` (CI, epics, skills, auditorias).

Configuração do repositório no GitHub: workflows, Dependabot, labels, **cards de implementação** e ferramentas para agentes (Cursor/Copilot).

## Mapa rápido

```
.github/
├── README.md                 ← índice desta pasta (não é a home do repo)
├── dependabot.yml
├── labeler.yml
├── workflows/                CI + security scan
├── audits/                 prompts, scanners, resultados novos
├── plans/                  epics e planos de implementação
├── agents/                 personas Cursor/Copilot
└── skills/                 auditorias e manutenção
```

Detalhes de cada subpasta:

| Pasta | Índice |
|-------|--------|
| `audits/` | [audits/README.md](./audits/README.md) |
| `plans/` | [plans/README.md](./plans/README.md) |
| `skills/` | tabela abaixo + [`skills/_legacy/`](./skills/_legacy/README.md) |

---

## O que é cada coisa?

| Pasta / arquivo | Função |
|-----------------|--------|
| **`audits/`** | Prompts, scanners CI e resultados de auditoria |
| **`plans/cards/`** | Epics detalhados — fonte de verdade do escopo |
| **`plans/implementations/`** | Planos faseados gerados pelo agent |
| **`agents/`** | Personas (`implementation-plan`, `mentoring-juniors`) |
| **`skills/`** | Invocações especializadas para Cursor |
| **`workflows/`** | CI + `npm audit` (push/PR/schedule) |

Documentação de produto e código: [`Documentacao/`](../Documentacao/README.md)

---

## Skills — ativas vs. legado

| Skill | Saída |
|-------|-------|
| `po-audit` | `.github/audits/results/product-owner/` |
| `security-audit` | `.github/audits/results/application-security/` |
| `devops-audit` | `.github/audits/results/devops/` |
| `dev-senior-review` | `.github/audits/results/code-review/` |
| `ux-audit` | `.github/audits/results/ux-design/` |
| `architecture-audit` | `.github/audits/results/architecture/` |
| `readme-updater` | READMEs API/Web |
| `card-refiner` | Refino de epics |
| `project-architect` | Novos módulos grandes |
| `plantuml-diagram-generator` | Diagramas em `Documentacao/04-Diagramas/` |
| `skills/_legacy/*` | ⏸ Legado greenfield |

Prompts (spec): [audits/prompts/](./audits/prompts/README.md) · Histórico ago/2026: [Documentacao/03-Auditorias/](../Documentacao/03-Auditorias/README.md)

---

## Agents

| Agent | Papel |
|-------|--------|
| `implementation-plan.agent.md` | Card → plano em `plans/implementations/` → implementação por fases |
| `mentoring-juniors.agent.md` | Explicações para juniors |

---

## Convenções

- Requisitos: [Documentacao/01-Produto/Requisitos/](../Documentacao/01-Produto/Requisitos/Readme.md)
- Commits: [Guia-Commits.md](../Documentacao/02-Engenharia/Guia-Commits.md)
- Cards: `Refs: RF-xxx` / `Refs: PO-AUDIT-2026-08`

---

## Próximos epics sugeridos

| Módulo | Prioridade |
|--------|------------|
| Perfil e Configurações (RF-073–078) | 🔴 Alta |
| Insights + Chatbot (RF-044–053) | 🟡 Média |
| Importação OFX/CSV/PDF (RF-155–158) | 🟡 Média |
| Onboarding (RF-151–154) | 🟡 Média |

Índice completo: [plans/README.md](./plans/README.md)
