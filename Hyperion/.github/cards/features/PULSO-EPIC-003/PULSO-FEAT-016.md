---
card_id: PULSO-FEAT-016
title: "Frontend — página de transações"
status: Done
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-003
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Frontend — página de transações

> **Contexto:** Tela principal `/transactions` com resumo, filtros, lista, paginação e modais (RF-016–025).

**Refs:** RF-016 · RF-017 · RF-023 · RF-024 · RF-025

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


## 👤 Responsável

Maria Clara (`mariaoliveira27`)

## 🔗 Pull Requests

- [#301](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/301) — Página de transações (`FEAT-016`) → issue [#29](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/29)
## 📋 Resumo

### ✅ Concluído
- Spec de UX e componentes mapeada

### ⏳ Pendente
- PULSO-TASK-033 — TransactionsPage + listagem/filtros/resumo
- PULSO-TASK-034 — TransactionFormModal
- PULSO-TASK-035 — DeleteTransactionModal + estilos
