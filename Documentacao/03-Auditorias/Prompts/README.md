# Prompts de auditoria

Protocolos completos para auditorias especializadas. **Não apague estes arquivos** — são a spec que skills e copy-paste devem seguir.

## Pastas de saída (OBRIGATÓRIO)

| Prompt | Skill | Pasta de saída |
|--------|-------|----------------|
| [AnalisePO.md](./AnalisePO.md) | `po-audit` | [`../Product Owner/`](../Product%20Owner/) |
| [AnaliseSegurança.md](./AnaliseSegurança.md) | `security-audit` | [`../Application Security/`](../Application%20Security/) |
| [AnaliseDevops.md](./AnaliseDevops.md) | `devops-audit` | [`../DevOps/`](../DevOps/) |
| [AnaliseDevSenior.md](./AnaliseDevSenior.md) | `dev-senior-review` | [`../Code Review/`](../Code%20Review/) |
| [AnaliseDesigner.md](./AnaliseDesigner.md) | `ux-audit` | [`../UX Design/`](../UX%20Design/) |
| [AnaliseArquiteto.md](./AnaliseArquiteto.md) | `architecture-audit` | [`../Architecture/`](../Architecture/) |

Ao executar via **skill** ou **colar o prompt**, salve os arquivos gerados **sempre** na pasta indicada acima (caminhos completos estão dentro de cada prompt).

## Como invocar

```
Audite o módulo 04 Metas com po-audit
Execute Fase 1 da security-audit
```

Auditorias multi-fase: **uma fase por sessão**, aguardar OK entre fases.

## Relação com cards

Após auditoria Product Owner, atualizar epic em `.github/plans/cards/` — seções **Correções PO** e **Rastreamento de Implementação**.
