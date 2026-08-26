---
card_id: PULSO-TASK-138
title: "Frontend — DebtsPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-068
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — DebtsPage e client

> **Contexto:** Página `/debts` orquestrando tabs, lista e modais.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/DebtsPage.jsx` | Tabs, filtros, resumo, lista paginada, modais |
| `services/debtService.js` | resumo, listar, CRUD, pagamentos, quitar, reabrir |
| `utils/debtFilters.js` | `DEBT_TABS`, `buildApiFiltros` |
| Rota | `App.jsx` → `/debts`; sidebar + `appRoutes.js` |

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar DebtsPage e client
