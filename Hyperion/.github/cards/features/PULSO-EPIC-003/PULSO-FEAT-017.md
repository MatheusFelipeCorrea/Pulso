---
card_id: PULSO-FEAT-017
title: "QA â€” testes de transaÃ§Ãµes"
status: Done
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA â€” testes de transaÃ§Ãµes

> **Contexto:** Cobertura de regressÃ£o para service, filtros, recorrÃªncia, regras de recurso e utils web.

**Refs:** RNF-015

## ðŸ“ DescriÃ§Ã£o

Suites unitÃ¡rias API e Web para fluxos crÃ­ticos de transaÃ§Ãµes, incluindo exclusÃ£o recorrente e validaÃ§Ã£o VA/VR (VT rejeitado).

## âœ… CritÃ©rios de Aceite

**Quando** `npm test` API,  
**EntÃ£o** passam: `transactionService`, `transactionFilterService`, `recurringTransactions`, `recursoCategoriaRules`, `categorySuggestionService`, `transactionMapper`.

**Quando** `npm test` Web,  
**EntÃ£o** passam: `transactionFilters`, `transactionValidation`, `transactionRecurrence`, `useTransactionFilterOptions`.

## ðŸ”— Sub-issues

- PULSO-TASK-036

## ðŸ‘¤ ResponsÃ¡vel

Sofia Vasconcelos (`sofiavasconcelosms`)

## ðŸ”— Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) â€” Suites unitÃ¡rias API + Web (`FEAT-014` + `FEAT-017`) â†’ issue [#30](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/30)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Escopo de testes mapeado

### â³ Pendente
- PULSO-TASK-036 â€” implementar/expandir suites
