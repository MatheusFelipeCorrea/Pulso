---
card_id: "PULSO-FEAT-016"
title: "Frontend — página de transações"
status: "Backlog"
type: "Feature"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-003"
due_date: null
board_sync_at: "2026-08-26T15:29:49.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [FEATURE] Frontend — página de transações

> **Contexto:** Tela principal `/transactions` com resumo, filtros, lista, paginação e modais (RF-015–024).

**Refs:** RF-015 · RF-016 · RF-022 · RF-023 · RF-024

## 📝 Descrição

Página orquestra listagem + resumo paralelos; filtros pendentes vs. ativos; modais criar/editar/excluir; gestão inline de categorias e tags.

## ✅ Critérios de Aceite

### Cenário 1 — Listagem
**Então** transações agrupadas por data; paginação 10/página; loading/error states.

### Cenário 2 — Filtros
**Então** período, categoria, tipo, recurso, busca texto/tag; botões Filtrar/Limpar.

### Cenário 3 — Resumo
**Então** cards receitas/despesas/saldo refletem filtros ativos.

### Cenário 4 — CRUD
**Então** modais criar/editar com validação; toast sucesso/erro.

## 🔗 Sub-issues

- PULSO-TASK-033
- PULSO-TASK-034
- PULSO-TASK-035

## 📋 Resumo

### ✅ Concluído
- Spec de UX e componentes mapeada

### ⏳ Pendente
- PULSO-TASK-033 — TransactionsPage + listagem/filtros/resumo
- PULSO-TASK-034 — TransactionFormModal
- PULSO-TASK-035 — DeleteTransactionModal + estilos
