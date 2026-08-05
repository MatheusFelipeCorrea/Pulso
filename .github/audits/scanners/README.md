# Scanners automáticos

Complementam auditorias manuais/agente via **GitHub Actions**.  
Hub: [`../README.md`](../README.md) · Manifesto: [`../manifest.yml`](../manifest.yml).

Achados relevantes → triar em [`../results/`](../results/README.md).

## Inventário

| Scanner | Workflow | Quando | Escopo | Relacionado a |
|---------|----------|--------|--------|---------------|
| **npm audit (API)** | [`security.yml`](../../workflows/security.yml) | Push, PR, seg. 09:00 UTC | `Codigo/Pulso/api` | `security-audit`, `devops-audit` |
| **npm audit (Web)** | [`security.yml`](../../workflows/security.yml) | Push, PR, seg. 09:00 UTC | `Codigo/Pulso/web` | `security-audit`, `devops-audit` |
| **CI lint/test/build** | [`ci.yml`](../../workflows/ci.yml) | Push, PR | API + Web | `devops-audit`, `dev-senior-review` |
| **Dependabot** | [`dependabot.yml`](../../dependabot.yml) | **Off** (`open-pull-requests-limit: 0`) | npm, Actions | bump manual |
| **PR labeler** | [`labeler.yml`](../../workflows/labeler.yml) | PR | Paths | `po-audit`, `plans` |

## Onde fica a saída

| Tipo | Onde |
|------|------|
| Logs CI | GitHub Actions |
| Relatório estruturado | `.github/audits/results/<tipo>/` |
| Histórico PO | `Documentacao/03-Auditorias/` |

## Adicionar scanner

1. Workflow em `.github/workflows/`  
2. Registrar em `manifest.yml` → `audits.<tipo>.scanners`  
3. Documentar nesta tabela  

Sugestões futuras: CodeQL, gitleaks, Lighthouse CI.