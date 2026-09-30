---
card_id: PULSO-TASK-036
title: "QA — testes unitários de transações"
status: "In Revision"
type: Task
priority: Medium
sprint: "Sprint 3"
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

# [TASK] QA — testes unitários de transações

> **Contexto:** Regressão para CRUD, filtros, recorrência e regras VA/VR (VT rejeitado).

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/transactionService.test.js` | CRUD, resumo, exclusão recorrente |
| `unit/services/transactionFilterService.test.js` | Filtros query |
| `unit/jobs/recurringTransactions.test.js` | Geração filhas |
| `unit/utils/recursoCategoriaRules.test.js` | RF-026 |
| `unit/services/categorySuggestionService.test.js` | RF-028 |
| `unit/utils/transactionMapper.test.js` | DTO |

### Web — `Codigo/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/transactionFilters.test.js` | Build filtros API |
| `unit/utils/transactionValidation.test.js` | Validações client |
| `unit/utils/transactionRecurrence.test.js` | RRULE builder |
| `unit/hooks/useTransactionFilterOptions.test.js` | Hook filtros |
| `unit/services/transactionService.test.js` | Chamadas HTTP |


## 👤 Responsável

Sofia Vasconcelos (`sofiavasconcelosms`)

## 🔗 Pull Requests

- [#300](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/300) — Suites unitárias API + Web (`FEAT-017`) → issue [#124](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/124)
## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Nenhum
