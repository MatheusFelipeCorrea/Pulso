# Auditorias — prompts, scanners e resultados

Hub de auditorias do pack.  
Guia geral: [`../INDEX.md`](../INDEX.md) · Comandos: [`../COMMANDS.md`](../COMMANDS.md) · Setup: [`../USAGE.md`](../USAGE.md).

**Novos** relatórios → `results/` aqui.  
Histórico já entregue (ex.: PO ago/2026) → [`Documentacao/03-Auditorias/`](../../Documentacao/03-Auditorias/README.md) (não migrar).

## Estrutura

```
.github/audits/
├── README.md        ← você está aqui
├── manifest.yml     ← audit → skill → prompt → scanner → saída
├── prompts/         ← protocolos genéricos
├── overlays/        ← contexto de domínio (ex.: pulso.md)
├── scanners/        ← inventário dos scanners de CI
└── results/         ← relatórios novos (+ _summary/ do full-audit)
```

## Fluxo

| Tipo | Como | Onde |
|------|------|------|
| CI | Push/PR/schedule (Actions) | Logs no Actions; triagem manual em `results/` |
| Entrada | `project-startup` | `project.yml` |
| Suite | `full-audit` | `results/*` + `results/_summary/` |
| Isolada | skill `*-audit` / colar prompt | `results/<tipo>/` |

## Invocar

```text
Faça o start-up deste repositório
Auditoria completa do repositório
Audite o módulo 04 Metas com po-audit
Execute Fase 1 da security-audit
```

Auditorias **multi-fase**: uma fase por sessão; aguardar OK.

## Cards

Após PO audit, atualizar epic em [`../plans/cards/`](../plans/cards/) (correções + rastreamento).

## Overlay

Contexto Pulso: [`overlays/pulso.md`](./overlays/pulso.md) — complementa o prompt; nunca o substitui. Path em `project.yml` → `audits.overlay`.
