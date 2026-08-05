# Scanners automáticos

Scanners rodam via **GitHub Actions** e complementam as auditorias manuais/agente. Achados automáticos devem ser **triados** e, quando relevantes, registrados em [`.github/audits/results/`](../results/).

## Inventário

| Scanner | Workflow | Quando roda | Escopo | Relacionado a |
|---------|----------|-------------|--------|---------------|
| **npm audit (API)** | [`security.yml`](../../workflows/security.yml) | Push, PR, segundas 09:00 UTC | `Codigo/Pulso/api` | `security-audit`, `devops-audit` |
| **npm audit (Web)** | [`security.yml`](../../workflows/security.yml) | Push, PR, segundas 09:00 UTC | `Codigo/Pulso/web` | `security-audit`, `devops-audit` |
| **CI lint/test/build** | [`ci.yml`](../../workflows/ci.yml) | Push, PR | API + Web | `devops-audit`, `dev-senior-review` |
| **Dependabot** | [`dependabot.yml`](../../dependabot.yml) | Semanal | npm (web/api), Actions | `security-audit`, `devops-audit` |
| **PR labeler** | [`labeler.yml`](../../workflows/labeler.yml) | PR | Paths tocados | `po-audit`, `plans` |

Mapa declarativo: [`../manifest.yml`](../manifest.yml)

## O que fica onde

| Tipo de saída | Onde |
|---------------|------|
| Logs de execução CI | GitHub Actions (aba Actions do repo) |
| Relatório estruturado (SEC/OPS/DEV…) | `.github/audits/results/<tipo>/` |
| Histórico PO ago/2026 | `Documentacao/03-Auditorias/` (não mover) |

## Adicionar scanner

1. Criar ou estender workflow em `.github/workflows/`
2. Registrar em `manifest.yml` → `audits.<tipo>.scanners`
3. Documentar aqui na tabela acima

Scanners futuros sugeridos: CodeQL, ESLint security plugin, gitleaks, Lighthouse CI (UX).
