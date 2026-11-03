---
card_id: PULSO-TASK-125
title: "Frontend — ExpenseSplitPage e client"
status: "In Revision"
type: Task
priority: Highest
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-062
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
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

## 👤 Responsáveis

- Vinícius Simões (`ViniSimoesV`) — web
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — Flutter


## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client
