# Prompts de auditoria

Protocolos completos para auditorias especializadas. **Não apague** — são a spec que skills e copy-paste devem seguir.

## Mapa prompt → skill → saída

| Prompt | Skill | Pasta de saída |
|--------|-------|----------------|
| [product-owner.md](./product-owner.md) | `po-audit` | [`../results/product-owner/`](../results/product-owner/) |
| [security.md](./security.md) | `security-audit` | [`../results/application-security/`](../results/application-security/) |
| [devops.md](./devops.md) | `devops-audit` | [`../results/devops/`](../results/devops/) |
| [dev-senior.md](./dev-senior.md) | `dev-senior-review` | [`../results/code-review/`](../results/code-review/) |
| [ux-design.md](./ux-design.md) | `ux-audit` | [`../results/ux-design/`](../results/ux-design/) |
| [architecture.md](./architecture.md) | `architecture-audit` | [`../results/architecture/`](../results/architecture/) |

Índice completo (scanners, fases, IDs): [`../manifest.yml`](../manifest.yml)

## Como invocar

```
Audite o módulo 04 Metas com po-audit
Execute Fase 1 da security-audit
```

Auditorias multi-fase: **uma fase por sessão**, aguardar OK entre fases.

## Relação com cards

Após auditoria Product Owner, atualizar epic em [`.github/plans/cards/`](../../plans/cards/) — seções **Correções PO** e **Rastreamento de Implementação**.
