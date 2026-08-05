# Resultados de auditoria (novos)

Relatórios gerados por **skills/agentes** a partir desta organização.

## Pastas

| Pasta | Conteúdo | ID dos achados |
|-------|----------|----------------|
| [product-owner/](./product-owner/) | Um `.md` por módulo + sumários `00-*` | — |
| [application-security/](./application-security/) | Fases + sumário executivo | `SEC-<fase>-<nn>` |
| [devops/](./devops/) | Fases + sumário executivo | `OPS-<fase>-<nn>` |
| [code-review/](./code-review/) | Fases + sumário executivo | `DEV-<fase>-<nn>` |
| [ux-design/](./ux-design/) | Fases + guia canônico | `UX-<fase>-<nn>` |
| [architecture/](./architecture/) | Fases + sumário executivo | `ARCH-<fase>-<nn>` |

## Convenção de nomes

- **PO:** `{NN}-{Slug-Modulo}.md` — ex.: `04-Metas-Financeiras.md`
- **Multi-fase:** `{tipo}-fase-{N}-{slug}.md` — ex.: `security-fase-1-auth-authz.md`
- **Sumário:** `{tipo}-sumario-executivo.md`

Detalhes por prompt: [`.github/audits/prompts/`](../prompts/)

## Histórico

Relatórios já entregues em **ago/2026** (especialmente PO) permanecem em:

[`Documentacao/03-Auditorias/`](../../../Documentacao/03-Auditorias/README.md)

Não é necessário migrar — use esta pasta apenas para **novas** execuções.
