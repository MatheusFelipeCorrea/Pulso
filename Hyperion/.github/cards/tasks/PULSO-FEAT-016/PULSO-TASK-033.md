---
card_id: PULSO-TASK-033
title: "Frontend — TransactionsPage, filtros e listagem"
status: Done
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
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


## 👤 Responsável

Maria Clara (`mariaoliveira27`)

## 🔗 Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — `TransactionsPage`, filtros e lista (`FEAT-016`) → issue [#121](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/121)
## 📋 Resumo

### ✅ Concluído
- Spec de estado e fetch paralelo definida

### ⏳ Pendente
- Implementar página e componentes de listagem/filtro
