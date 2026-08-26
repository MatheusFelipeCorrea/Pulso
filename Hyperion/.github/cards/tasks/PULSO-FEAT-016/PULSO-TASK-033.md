---
card_id: PULSO-TASK-033
title: "Frontend — TransactionsPage, filtros e listagem"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-016
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — TransactionsPage, filtros e listagem

> **Contexto:** Shell da página `/transactions` com dados paralelos lista + resumo.

## 📝 Descrição

Implementar página principal com filtros pendentes/ativos, paginação e cards de resumo.

## 🛠️ Implementação

### Páginas e componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TransactionsPage.jsx` | Orquestração estado, modais, fetch |
| `TransactionSummaryCards.jsx` | Receitas, despesas, saldo |
| `TransactionFilters.jsx` | Período, categoria, tipo, recurso, busca |
| `TransactionList.jsx` | Lista agrupada por data |
| `services/transactionService.js` | `buscarTransacoes`, `obterResumo`, CRUD |
| `utils/transactionFilters.js` | `DEFAULT_TRANSACTION_FILTROS`, `buildTransactionApiFiltros` |

**Padrão:** `AbortController` + `Promise.all` lista/resumo; paginação `limite: 10`

**Rota:** `App.jsx` → `path="transactions"` sob MainLayout

## 📋 Resumo

### ✅ Concluído
- Spec de estado e fetch paralelo definida

### ⏳ Pendente
- Implementar página e componentes de listagem/filtro
