---
card_id: "PULSO-FEAT-049"
title: "Frontend — BudgetPage e resumo"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-009"
due_date: null
board_sync_at: "2026-08-26T15:30:22.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [FEATURE] Frontend — BudgetPage e resumo

> **Contexto:** Página `/budget` com filtro de mês, cards de resumo e listas de categorias.

**Refs:** RF-110 · RF-114 · RN-059

## 📝 Descrição

Implementar tela de orçamento mensal consumindo `GET /orcamentos/status`.

## ✅ Critérios de Aceite

- Rota autenticada `/budget` em `App.jsx` / `appRoutes.js`
- Filtro de período (mês) via `TransactionFilters` / query `mes`
- `BudgetSummaryCards` — totais, % usado, aviso RN-059 se `orcamentoExcedeRenda`
- `BudgetCategoryList` — barras de progresso por status
- `BudgetCategoriesWithoutLimit` — CTA para adicionar limite
- Ação copiar do mês anterior
- Empty state quando sem limites

## 🔗 Sub-issues

- PULSO-TASK-101
- PULSO-TASK-102

## 📋 Resumo

### ✅ Concluído
- Layout e fluxos da página definidos

### ⏳ Pendente
- PULSO-TASK-101–102 — página e componentes de lista/resumo
