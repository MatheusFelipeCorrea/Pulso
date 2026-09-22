---
card_id: PULSO-TASK-033
title: "Frontend â€” TransactionsPage, filtros e listagem"
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

# [TASK] Frontend â€” TransactionsPage, filtros e listagem

> **Contexto:** Shell da pÃ¡gina `/transactions` com dados paralelos lista + resumo.

## ðŸ“ DescriÃ§Ã£o

Implementar pÃ¡gina principal com filtros pendentes/ativos, paginaÃ§Ã£o e cards de resumo.

## ðŸ› ï¸ ImplementaÃ§Ã£o

### PÃ¡ginas e componentes (NOVO â€” CRIAR)

| Arquivo | FunÃ§Ã£o |
|---------|--------|
| `pages/TransactionsPage.jsx` | OrquestraÃ§Ã£o estado, modais, fetch |
| `TransactionSummaryCards.jsx` | Receitas, despesas, saldo |
| `TransactionFilters.jsx` | PerÃ­odo, categoria, tipo, recurso, busca |
| `TransactionList.jsx` | Lista agrupada por data |
| `services/transactionService.js` | `buscarTransacoes`, `obterResumo`, CRUD |
| `utils/transactionFilters.js` | `DEFAULT_TRANSACTION_FILTROS`, `buildTransactionApiFiltros` |

**PadrÃ£o:** `AbortController` + `Promise.all` lista/resumo; paginaÃ§Ã£o `limite: 10`

**Rota:** `App.jsx` â†’ `path="transactions"` sob MainLayout

## ðŸ‘¤ ResponsÃ¡vel

Maria Clara (`mariaoliveira27`)

## ðŸ”— Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) â€” `TransactionsPage`, filtros e lista (`FEAT-016`) â†’ issue [#121](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/121)

## ðŸ“‹ Resumo

### âœ… ConcluÃ­do
- Spec de estado e fetch paralelo definida

### â³ Pendente
- Implementar pÃ¡gina e componentes de listagem/filtro
