---
card_id: PULSO-FEAT-014
title: "TransferÃªncias entre recursos"
status: Done
type: Feature
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Regra de NegÃ³cio
---

# [FEATURE] TransferÃªncias entre recursos

> **Contexto:** MovimentaÃ§Ã£o entre recursos (ex.: DINHEIRO â†’ POUPANCA) sem contabilizar como receita/despesa nos totais (RF-027).

**Refs:** RF-027

## ðŸ“ DescriÃ§Ã£o

Tipo `TRANSFERENCIA` com `recurso` origem e `recursoDestino` destino; sem `categoriaId`; excluÃ­da de agregados receita/despesa; notificaÃ§Ã£o `TRANSFERENCIA_REGISTRADA`.

## âœ… CritÃ©rios de Aceite

### CenÃ¡rio 1 â€” Criar transferÃªncia
**Quando** `tipo=TRANSFERENCIA`, `recursoâ‰ recursoDestino`,  
**EntÃ£o** grava transaÃ§Ã£o; saldos origem/destino atualizados via lÃ³gica de recurso.

### CenÃ¡rio 2 â€” Resumo
**EntÃ£o** transferÃªncias **nÃ£o** entram em totais de receitas/despesas do `/resumo`.

### CenÃ¡rio 3 â€” UI
**EntÃ£o** toggle transferÃªncia no form; selects origem/destino; validaÃ§Ã£o client-side.

## ðŸ”— Sub-issues

- PULSO-TASK-030

## ðŸ‘¤ ResponsÃ¡vel

Sofia Vasconcelos (`sofiavasconcelosms`)

## ðŸ”— Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) â€” Testes de transferÃªncia e QA (`FEAT-014` + `FEAT-017`) â†’ issue [#27](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/27)
- [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298) â€” Tipo `TRANSFERENCIA` no service da API (`FEAT-012`)
- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” Toggle de transferÃªncia no formulÃ¡rio web (`FEAT-016`)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec RF-027 e enum `TipoRecurso` incluindo POUPANCA documentados

### â³ Pendente
- PULSO-TASK-030 â€” backend + frontend transferÃªncias
