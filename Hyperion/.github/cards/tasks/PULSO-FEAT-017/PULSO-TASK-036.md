---
card_id: "PULSO-TASK-036"
title: "QA — testes unitários de transações"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-017"
due_date: null
board_sync_at: "2026-08-26T15:31:24.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes unitários de transações

> **Contexto:** Regressão para CRUD, filtros, recorrência e regras VA/VR/VT.

## 📝 Descrição

Implementar suites API e Web cobrindo fluxos críticos documentados no epic.

## 🛠️ Implementação

### API — `Codigo/Pulso/api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/transactionService.test.js` | CRUD, resumo, exclusão recorrente |
| `unit/services/transactionFilterService.test.js` | Filtros query |
| `unit/jobs/recurringTransactions.test.js` | Geração filhas |
| `unit/utils/recursoCategoriaRules.test.js` | RF-025 |
| `unit/services/categorySuggestionService.test.js` | RF-141 |
| `unit/utils/transactionMapper.test.js` | DTO |

### Web — `Codigo/Pulso/web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/transactionFilters.test.js` | Build filtros API |
| `unit/utils/transactionValidation.test.js` | Validações client |
| `unit/utils/transactionRecurrence.test.js` | RRULE builder |
| `unit/hooks/useTransactionFilterOptions.test.js` | Hook filtros |
| `unit/services/transactionService.test.js` | Chamadas HTTP |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir todas as suites listadas
