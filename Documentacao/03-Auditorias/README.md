# 03 — Auditorias

Relatórios de auditoria. **Histórico** (ago/2026) nesta pasta; **novas execuções** em [`.github/audits/results/`](../../.github/audits/results/README.md).

## Hub operacional (prompts + scanners + novos resultados)

| Recurso | Caminho |
|---------|---------|
| Prompts (spec) | [`.github/audits/prompts/`](../../.github/audits/prompts/) |
| Scanners CI | [`.github/audits/scanners/`](../../.github/audits/scanners/) |
| Novos relatórios | [`.github/audits/results/`](../../.github/audits/results/) |
| Mapa completo | [`.github/audits/manifest.yml`](../../.github/audits/manifest.yml) |

## Pastas de resultados (histórico)

| Pasta | Conteúdo | Prompt / Skill |
|-------|----------|----------------|
| [Product Owner/](./Product%20Owner/) | Relatórios PO por módulo (ago/2026) | `product-owner.md` · `po-audit` |
| [Application Security/](./Application%20Security/) | Fases AppSec (SEC-N-NN) | `security.md` · `security-audit` |
| [DevOps/](./DevOps/) | CI/CD, cron, FinOps (OPS-N-NN) | `devops.md` · `devops-audit` |
| [Code Review/](./Code%20Review/) | Revisão profunda (DEV-N-NN) | `dev-senior.md` · `dev-senior-review` |
| [UX Design/](./UX%20Design/) | Padronização DS (UX-N-NN) | `ux-design.md` · `ux-audit` |
| [Architecture/](./Architecture/) | Arquitetura (ARCH-N-NN) — incl. fases iniciais | `architecture.md` · `architecture-audit` |
| [Prompts/](./Prompts/) | Redirect → `.github/audits/prompts/` | — |

## Product Owner — índice principal

| Documento | Conteúdo |
|-----------|----------|
| [00-Sumario-Executivo.md](./Product%20Owner/00-Sumario-Executivo.md) | Visão geral + correções aplicadas |
| [00-Achados-Transversais.md](./Product%20Owner/00-Achados-Transversais.md) | T1–T7 (infra, testes, serverless) |
| [01-…18-….md](./Product%20Owner/) | Um relatório por módulo implementado |
| [19-25-Modulos-Planejados.md](./Product%20Owner/19-25-Modulos-Planejados.md) | Escopo futuro |
| [20-Requisitos-Nao-Funcionais.md](./Product%20Owner/20-Requisitos-Nao-Funcionais.md) | RNFs consolidados |

**Requisitos auditados:** [../01-Produto/Requisitos/Readme.md](../01-Produto/Requisitos/Readme.md)
