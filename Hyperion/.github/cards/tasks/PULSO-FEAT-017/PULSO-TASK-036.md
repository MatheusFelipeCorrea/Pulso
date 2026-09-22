---
card_id: PULSO-TASK-036
title: "QA â€” testes unitÃ¡rios de transaÃ§Ãµes"
status: Done
type: Task
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-017
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA â€” testes unitÃ¡rios de transaÃ§Ãµes

> **Contexto:** RegressÃ£o para CRUD, filtros, recorrÃªncia e regras VA/VR (VT rejeitado).

## ðŸ“ DescriÃ§Ã£o

Implementar suites API e Web cobrindo fluxos crÃ­ticos documentados no epic.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### API â€” `Codigo/api/tests/` (NOVO â€” CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/transactionService.test.js` | CRUD, resumo, exclusÃ£o recorrente |
| `unit/services/transactionFilterService.test.js` | Filtros query |
| `unit/jobs/recurringTransactions.test.js` | GeraÃ§Ã£o filhas |
| `unit/utils/recursoCategoriaRules.test.js` | RF-026 |
| `unit/services/categorySuggestionService.test.js` | RF-028 |
| `unit/utils/transactionMapper.test.js` | DTO |

### Web â€” `Codigo/web/tests/` (NOVO â€” CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/transactionFilters.test.js` | Build filtros API |
| `unit/utils/transactionValidation.test.js` | ValidaÃ§Ãµes client |
| `unit/utils/transactionRecurrence.test.js` | RRULE builder |
| `unit/hooks/useTransactionFilterOptions.test.js` | Hook filtros |
| `unit/services/transactionService.test.js` | Chamadas HTTP |

## ðŸ‘¤ ResponsÃ¡vel

Sofia Vasconcelos (`sofiavasconcelosms`)

## ðŸ”— Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) â€” Suites unitÃ¡rias API + Web (`FEAT-017`) â†’ issue [#124](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/124)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Matriz de testes definida

### â³ Pendente
- Escrever/expandir todas as suites listadas
