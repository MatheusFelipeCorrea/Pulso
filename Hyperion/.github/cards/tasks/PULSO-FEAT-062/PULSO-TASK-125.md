---
card_id: "PULSO-TASK-125"
title: "Frontend — ExpenseSplitPage e client"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-062"
due_date: null
board_sync_at: "2026-08-26T15:23:48.000Z"
categories:
  - "web"
  - "Frontend"
  - "UX / UI"
---


# [TASK] Frontend — ExpenseSplitPage e client

> **Contexto:** Página `/expense-split` orquestrando resumo, ativas e histórico.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/ExpenseSplitPage.jsx` | Load resumo/ativas/histórico; modais |
| `services/expenseSplitService.js` | resumo, ativas, historico, CRUD, pagar, lembrete |
| Rota | `App.jsx` → `/expense-split`; sidebar + `appRoutes.js` |

Paginação do histórico; empty states quando sem divisões.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client
