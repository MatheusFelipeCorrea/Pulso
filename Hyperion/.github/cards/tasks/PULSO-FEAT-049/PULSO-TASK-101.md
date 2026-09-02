---
card_id: "PULSO-TASK-101"
title: "Frontend — BudgetPage e client HTTP"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-049"
due_date: null
board_sync_at: "2026-08-26T15:32:29.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — BudgetPage e client HTTP

> **Contexto:** Página `/budget` com filtro de mês, carregamento de status e ações.

## 📝 Descrição

Implementar página e serviço HTTP do módulo.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/BudgetPage.jsx` | Estado filtros/status; carregar; copiar; abrir modal |
| `services/budgetService.js` | GET status, POST salvar, POST copiar, DELETE |
| Rota | `App.jsx` → `/budget`; label em `appRoutes.js` |

**Query:** `?mes=YYYY-MM` via search params / `TransactionFilters`

Ações: editar limites, copiar mês anterior (toast de sucesso/erro 409)

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar BudgetPage e client
