---
card_id: "PULSO-TASK-104"
title: "QA — testes unitários de orçamento"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-051"
due_date: null
board_sync_at: "2026-08-26T15:32:32.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "QA / Testes"
---


# [TASK] QA — testes unitários de orçamento

> **Contexto:** Regressão para status, rollover, alertas, cópia e utils web.

## 📝 Descrição

Implementar suites API e Web do módulo.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/budgetService.test.js` | status, salvar, copiar 409, alertas |
| `unit/utils/budgetRolloverUtils.test.js` | sobra positiva / estouro / inativo |
| `unit/utils/budgetMapper.test.js` | status normal/alerta/estourado |
| `unit/jobs/budgetAlertJob.test.js` | run job |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/budgetService.test.js` | HTTP client |
| `unit/utils/budgetUtils.test.js` | mês anterior / conversões |
| `unit/utils/budgetFilterUtils.test.js` | filtro categorias |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites
